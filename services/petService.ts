
import { createClient } from '@supabase/supabase-js';
import { Pet, HealthRecord, UserProfile } from '../types';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_P2z5GB_sRCuyIDLZgCt7AA__3Nm9oJR';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to safely extract error message
const formatError = (error: any): string => {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  // Handle Supabase specific error objects
  if (error.code && error.message) return `Error ${error.code}: ${error.message}`;
  return error.details || error.hint || JSON.stringify(error);
};

class PetService {
  
  // --- AUTHENTICATION ---

  async signIn(): Promise<UserProfile | null> {
    try {
      // 1. Intento Preferido: Auth Anónima
      if (typeof supabase.auth.signInAnonymously === 'function') {
          const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
          
          if (!authError && authData.user) {
             return await this.getUserProfile(authData.user.id);
          }
      }
    } catch (e) {
      // Ignorar errores de soporte
    }
    return null;
  }

  async authWithEmail(email: string, password: string): Promise<UserProfile | null> {
    // 1. Intentar Login normal
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (!signInError && signInData.user) {
        return await this.getUserProfile(signInData.user.id);
    }

    // 2. Manejar error de email no confirmado
    if (signInError && signInError.message.includes("Email not confirmed")) {
        throw new Error("CONFIRM_EMAIL_SENT"); // Special signal
    }

    // 3. Si el error es de credenciales, intentamos ver si es un usuario nuevo o contraseña incorrecta
    if (signInError && (signInError.message.includes("Invalid login credentials") || signInError.message.includes("invalid_grant"))) {
        
        // Intentamos registrar. 
        // Si el usuario NO existe, se registrará exitosamente.
        // Si el usuario SÍ existe, fallará indicando que ya existe, lo que significa que el fallo anterior fue CONTRASEÑA INCORRECTA.
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (signUpError) {
            if (signUpError.message.includes('provider is not enabled')) {
                throw new Error("El registro por Email no está habilitado en Supabase.");
            }
            if (signUpError.message.includes("User already registered") || signUpError.message.includes("already has been registered")) {
                 throw new Error("Contraseña incorrecta.");
            }
            throw new Error(formatError(signUpError));
        }

        if (signUpData.user && !signUpData.session) {
            throw new Error("CONFIRM_EMAIL_SENT");
        }

        if (signUpData.user) {
            // Initialize profile immediately to avoid permission errors
            const newUserProfile: UserProfile = {
                uid: signUpData.user.id,
                firstName: '', lastName: '', phone: '', email: email, securityPin: '',
                address: { street: '', number: '', city: '', province: '', countryCode: '+54' }
            };
            await this.updateUserProfile(newUserProfile);
            return newUserProfile;
        }
    }

    throw new Error(formatError(signInError || "Error de autenticación"));
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        return await this.getUserProfile(session.user.id);
    }
    return null;
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  // --- PROFILE MANAGEMENT ---

  async getUserProfile(uid: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error || !data) {
      // Return empty profile structure if not found
      return {
        uid: uid,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        securityPin: '',
        address: {
          street: '',
          number: '',
          city: '',
          province: '',
          countryCode: '+54'
        }
      };
    }

    return {
      uid: data.uid,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone || '',
      email: data.email || '',
      securityPin: data.security_pin || '',
      photoUrl: data.photo_url,
      address: data.address || { street: '', number: '', city: '', province: '', countryCode: '+54' }
    };
  }

  async updateUserProfile(user: UserProfile): Promise<void> {
    const payload = {
      uid: user.uid,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      email: user.email,
      security_pin: user.securityPin,
      address: user.address,
      photo_url: user.photoUrl,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'uid' });

    if (error) {
        console.error('Error updating profile:', error);
        throw new Error(formatError(error));
    }
  }

  // --- PETS MANAGEMENT ---

  // Helper to map DB response to Pet type
  private _mapPetData(p: any): Pet {
      // Normalize SEX field strictly to 'Macho' or 'Hembra'
      let normalizedSex = 'Macho';
      if (p.sex) {
          const s = p.sex.toLowerCase();
          if (s === 'hembra' || s === 'female') normalizedSex = 'Hembra';
      }

      return {
        id: p.id,
        ownerId: p.owner_id,
        name: p.name,
        breed: p.breed,
        species: p.species,
        sex: normalizedSex as 'Macho' | 'Hembra', 
        birthDate: p.birth_date,
        weight: p.weight,
        ownerName: p.owner_name,
        photoUrl: p.photo_url,
        status: p.status,
        notes: p.notes,
        chipId: p.chip_id,
        lastLat: p.lost_lat,
        lastLng: p.lost_lng,
        originalOwnerId: p.original_owner_id,
        trackingEndDate: p.tracking_end_date
      };
  }

  async getPets(): Promise<Pet[]> {
    // IMPORTANT: Filter by authenticated user to ensure data privacy
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    try {
        // INTENTO 1: Fetch pets I own OR pets I originally owned (tracking).
        // Si la base de datos no tiene la columna 'original_owner_id', esto fallará.
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .or(`owner_id.eq.${user.id},original_owner_id.eq.${user.id}`);

        if (error) throw error;
        return data.map((p: any) => this._mapPetData(p));

    } catch (e: any) {
        // FALLBACK: Si falla (probablemente porque no existe la columna en tu DB vieja),
        // hacemos un fetch simple solo por 'owner_id'.
        console.warn("Retrying fetch with simple query (schema mismatch likely)...", e.message);
        
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('owner_id', user.id);
            
        if (error) {
            console.error('Error fetching pets (fallback):', error);
            return [];
        }
        return data.map((p: any) => this._mapPetData(p));
    }
  }

  async addPet(pet: Pet): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const payload = {
      id: pet.id,
      owner_id: user.id,
      name: pet.name,
      breed: pet.breed,
      species: pet.species,
      sex: pet.sex || 'Macho', 
      birth_date: pet.birthDate || null,
      weight: pet.weight,
      owner_name: pet.ownerName,
      photo_url: pet.photoUrl,
      status: pet.status,
      notes: pet.notes,
      chip_id: pet.chipId
    };

    const { error } = await supabase
      .from('pets')
      .insert([payload]);

    if (error) {
        console.error('Error adding pet:', error);
        throw new Error(formatError(error));
    }
  }

  async updatePet(pet: Pet): Promise<void> {
     const payload: any = {
      name: pet.name,
      breed: pet.breed,
      species: pet.species,
      sex: pet.sex || 'Macho', 
      birth_date: pet.birthDate || null,
      weight: pet.weight,
      owner_name: pet.ownerName,
      photo_url: pet.photoUrl,
      status: pet.status,
      notes: pet.notes,
      chip_id: pet.chipId
    };

    // Include tracking fields if they exist in the object
    if(pet.originalOwnerId) payload.original_owner_id = pet.originalOwnerId;
    if(pet.trackingEndDate) payload.tracking_end_date = pet.trackingEndDate;

    const { error } = await supabase
      .from('pets')
      .update(payload)
      .eq('id', pet.id);

    if (error) {
        console.error('Error updating pet:', error);
        throw new Error(formatError(error));
    }
  }

  // Use this for normal adoption by a real logged in user
  async adoptPet(petId: string, newOwnerName: string): Promise<void> {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error("Debes iniciar sesión para adoptar");

     const { data: currentPet, error: fetchError } = await supabase
        .from('pets').select('owner_id').eq('id', petId).single();
     
     if (fetchError || !currentPet) throw new Error("Error obteniendo datos de la mascota");

     const previousOwnerId = currentPet.owner_id;
     
     // 30 Days Tracking
     const trackingEnd = new Date();
     trackingEnd.setDate(trackingEnd.getDate() + 30);

     const payload = {
         owner_id: user.id,
         owner_name: newOwnerName,
         original_owner_id: previousOwnerId, 
         tracking_end_date: trackingEnd.toISOString(),
         status: 'safe', 
         lost_lat: null, 
         lost_lng: null
     };

     const { error } = await supabase
       .from('pets')
       .update(payload)
       .eq('id', petId);

     if (error) {
         console.warn("Tracking update failed (likely missing columns), trying simple transfer...");
         const simplePayload = { owner_id: user.id, owner_name: newOwnerName, status: 'safe', lost_lat: null, lost_lng: null };
         const { error: simpleError } = await supabase.from('pets').update(simplePayload).eq('id', petId);
         if(simpleError) throw new Error(formatError(simpleError));
     }
  }

  // NEW: Simulate adoption by an external "Ghost" user to test tracking UI
  async simulateExternalAdoption(petId: string): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // 1. Get current pet data
      const { data: currentPet, error: fetchError } = await supabase
        .from('pets').select('owner_id').eq('id', petId).single();
      if(fetchError) throw new Error(formatError(fetchError));

      // 2. Prepare payload
      // Use a random UUID for the new owner (simulated)
      const ghostOwnerId = '00000000-0000-0000-0000-000000000000'; 
      const trackingEnd = new Date();
      trackingEnd.setDate(trackingEnd.getDate() + 30);

      const payload = {
         owner_id: ghostOwnerId,
         owner_name: "Adoptante de Prueba",
         original_owner_id: user.id, 
         tracking_end_date: trackingEnd.toISOString(),
         status: 'safe', 
         lost_lat: null, 
         lost_lng: null
      };

      const { error } = await supabase
        .from('pets')
        .update(payload)
        .eq('id', petId);

      if (error) throw new Error(formatError(error));
  }

  async deletePet(petId: string): Promise<void> {
    console.log(`Iniciando borrado de mascota ${petId}...`);
    
    // 1. Primero borrar registros médicos asociados
    const { error: healthError } = await supabase
      .from('health_records')
      .delete()
      .eq('pet_id', petId);

    if (healthError) {
      console.error('Error al borrar registros médicos:', healthError);
    } 

    // 2. Luego borrar la mascota
    const { error: petError } = await supabase
      .from('pets')
      .delete()
      .eq('id', petId);

    if (petError) {
        console.error('Error fatal al borrar mascota:', petError);
        throw new Error(formatError(petError));
    }
    console.log('Mascota borrada exitosamente.');
  }

  async updatePetStatus(petId: string, status: 'safe' | 'lost' | 'adoption', lat?: number | null, lng?: number | null): Promise<void> {
    const payload: any = { status };
    if (lat !== undefined) payload.lost_lat = lat;
    if (lng !== undefined) payload.lost_lng = lng;

    const { error } = await supabase
      .from('pets')
      .update(payload)
      .eq('id', petId);

    if (error) {
      console.error('Error updating status:', error);
      throw new Error(formatError(error));
    }
  }

  // --- HEALTH RECORDS ---

  async getHealthRecords(petId: string): Promise<HealthRecord[]> {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('pet_id', petId);

    if (error) {
      console.error('Error fetching records:', error);
      return [];
    }

    return data.map((r: any) => ({
      id: r.id,
      petId: r.pet_id,
      title: r.title,
      date: r.date,
      nextDueDate: r.next_due_date,
      type: r.type,
      notes: r.notes,
      veterinarian: r.veterinarian,
      fileUrl: r.file_url
    }));
  }

  async addHealthRecord(record: HealthRecord): Promise<void> {
    const payload = {
      id: record.id,
      pet_id: record.petId,
      title: record.title,
      date: record.date || null,
      next_due_date: record.nextDueDate || null,
      type: record.type,
      notes: record.notes,
      veterinarian: record.veterinarian,
      file_url: record.fileUrl
    };

    const { error } = await supabase
      .from('health_records')
      .insert([payload]);
      
    if (error) {
        console.error('Error adding record:', error);
        throw new Error(formatError(error));
    }
  }

  async updateHealthRecord(record: HealthRecord): Promise<void> {
    const payload = {
      title: record.title,
      date: record.date || null,
      next_due_date: record.nextDueDate || null,
      type: record.type,
      notes: record.notes,
      veterinarian: record.veterinarian,
      file_url: record.fileUrl
    };

    const { error } = await supabase
      .from('health_records')
      .update(payload)
      .eq('id', record.id);
      
    if (error) {
        console.error('Error updating record:', error);
        throw new Error(formatError(error));
    }
  }

  async deleteHealthRecord(recordId: string): Promise<void> {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId);
        
      if (error) {
        console.error('Error deleting record:', error);
        throw new Error(formatError(error));
      }
  }

  // --- PUBLIC ACCESS & COMMUNITY ---

  async getPublicPetData(petId: string): Promise<{ pet: Pet, owner: UserProfile } | null> {
     const { data: petData, error: petError } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .single();
      
     if(petError || !petData) return null;

     return { pet: this._mapPetData(petData), owner: await this._fetchOwnerForPublic(petData.owner_id) };
  }

  private async _fetchOwnerForPublic(ownerId: string): Promise<UserProfile> {
      const { data: userData, error: userError } = await supabase
       .from('profiles')
       .select('*')
       .eq('uid', ownerId)
       .single();

     if (userError || !userData) {
         return {
             uid: 'hidden',
             firstName: 'Dueño',
             lastName: '(Privado)',
             phone: '',
             email: '',
             securityPin: '',
             address: { street: '', number: '', city: '', province: '', countryCode: '' }
         };
     }

     return {
        uid: userData.uid,
        firstName: userData.first_name,
        lastName: userData.last_name,
        phone: userData.phone,
        email: userData.email,
        securityPin: '', 
        address: userData.address || { street: '', number: '', city: '', province: '', countryCode: '' },
        photoUrl: userData.photo_url
     };
  }

  // Modified to fetch both LOST and ADOPTION pets for the map
  async getCommunityPets(): Promise<Pet[]> {
    const { data, error } = await supabase
        .from('pets')
        .select('*')
        .in('status', ['lost', 'adoption']);
    
    if (error) return [];
    
    return data.map((p: any) => this._mapPetData(p));
  }
}

export const petService = new PetService();
