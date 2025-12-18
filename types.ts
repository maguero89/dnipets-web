// --- TIPOS DE LA APP ---
export enum AppMode {
  Landing = 'landing',
  Chat = 'chat',
  Image = 'image',
  Live = 'live'
}

// --- TIPO QUE FALTABA (SOLUCIONA EL ERROR 1 y 3) ---
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  images?: string[]; // Array de strings (base64) opcional
}

// --- TIPOS PARA MASCOTAS Y QR ---
export type PetStatus = 'safe' | 'lost' | 'adoption';
export type RecordType = 'vaccine' | 'vet_visit' | 'certificate';

export interface Address {
  street: string;
  number: string;
  city: string;
  province: string;
  countryCode: string;
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  address?: Address;
  securityPin?: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  originalOwnerId?: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  sex: 'Macho' | 'Hembra';
  birthDate: string;
  weight: number;
  ownerName: string;
  photoUrl: string;
  status: PetStatus;
  notes?: string;
  chipId?: string;
  lastLat?: number;
  lastLng?: number;
  trackingEndDate?: string;
}

export interface HealthRecord {
  id: string;
  petId: string;
  title: string;
  type: RecordType;
  date: string;
  nextDueDate?: string;
  notes?: string;
  veterinarian?: string;
  fileUrl?: string;
}
// --- TIPO PARA EL GENERADOR DE IMÁGENES ---
export interface ImageGenerationResult {
  url: string;
  prompt: string;
  createdAt: number;
}