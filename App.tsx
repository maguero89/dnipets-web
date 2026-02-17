import React, { useState, useEffect } from 'react';
import { AdminMapa } from './components/AdminMapa';
import LandingPage from './components/LandingPage';
import { Pet, UserProfile } from './types';
import { petService, supabase } from './services/petService'; 
import { PawPrintBackground } from './components/PawPrintBackground';
import { 
  ShieldCheck, 
  AlertTriangle, 
  User as UserIcon, 
  MessageCircle, 
  Lock, 
  Store, 
  MapPin, 
  Phone, 
  AlignLeft, 
  Navigation,
  Edit,
  Trash2,
  XCircle
} from 'lucide-react';

// --- COMPONENTE: FORMULARIO DE COMERCIO (CREAR Y EDITAR) ---
const FormularioComercio = ({ 
  onComercioGuardado, 
  comercioAEditar, 
  onCancelarEdicion 
}: { 
  onComercioGuardado: () => void, 
  comercioAEditar: any | null,
  onCancelarEdicion: () => void
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    rubro: 'veterinaria',
    direccion: '',
    lat: '',
    lng: '',
    telefono: '',
    resena: ''
  });

  // Efecto para cargar datos cuando entramos en modo edición
  useEffect(() => {
    if (comercioAEditar) {
      setFormData({
        nombre: comercioAEditar.nombre || '',
        rubro: comercioAEditar.rubro || 'veterinaria',
        direccion: comercioAEditar.direccion || '',
        lat: comercioAEditar.lat?.toString() || '',
        lng: comercioAEditar.lng?.toString() || '',
        telefono: comercioAEditar.telefono || '',
        resena: comercioAEditar.resena || ''
      });
    } else {
      setFormData({ nombre: '', rubro: 'veterinaria', direccion: '', lat: '', lng: '', telefono: '', resena: '' });
    }
  }, [comercioAEditar]);

  const inputStyle = "w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none transition-all text-slate-900 bg-white placeholder:text-slate-400 mb-4";
  const labelStyle = "text-xs font-black text-slate-500 uppercase ml-1 mb-1 flex items-center gap-1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { 
      nombre: formData.nombre, 
      rubro: formData.rubro, 
      direccion: formData.direccion,
      lat: parseFloat(formData.lat), 
      lng: parseFloat(formData.lng),
      telefono: formData.telefono,
      resena: formData.resena
    };

    if (comercioAEditar) {
      // MODO EDICIÓN: Actualizar registro existente
      const { error } = await supabase
        .from('comercios')
        .update(payload)
        .eq('id', comercioAEditar.id);

      if (error) alert("Error al actualizar: " + error.message);
      else {
        alert("Comercio actualizado correctamente");
        onCancelarEdicion();
        onComercioGuardado();
      }
    } else {
      // MODO CREACIÓN: Insertar nuevo registro
      const { error } = await supabase.from('comercios').insert([payload]);
      if (error) alert("Error al guardar: " + error.message);
      else {
        alert("¡Comercio registrado con éxito!");
        setFormData({ nombre: '', rubro: 'veterinaria', direccion: '', lat: '', lng: '', telefono: '', resena: '' });
        onComercioGuardado();
      }
    }
  };

  return (
    <div className={`bg-white p-6 rounded-3xl border-2 transition-all ${comercioAEditar ? 'border-orange-400 shadow-orange-100 shadow-2xl' : 'border-slate-200 shadow-sm'}`}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2">
          <Store className={comercioAEditar ? "text-orange-500" : "text-blue-600"} /> 
          {comercioAEditar ? 'Editando Comercio' : 'Registrar Nuevo Comercio'}
        </h4>
        {comercioAEditar && (
          <button onClick={onCancelarEdicion} className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-xs font-bold uppercase">
            <XCircle size={16}/> Cancelar
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Nombre del lugar</label>
          <input type="text" className={inputStyle} placeholder="Ej: Veterinaria Akira" required
            value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
        </div>
        <div>
          <label className={labelStyle}>Rubro</label>
          <select className={inputStyle} value={formData.rubro} onChange={(e) => setFormData({...formData, rubro: e.target.value})}>
            <option value="veterinaria">Veterinaria</option>
            <option value="petshop">Petshop</option>
            <option value="peluqueria">Peluquería</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>Dirección</label>
          <input type="text" className={inputStyle} placeholder="Calle, Número, Localidad" required
            value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
        </div>
        <div>
          <label className={labelStyle}><Navigation size={12}/> Latitud</label>
          <input type="number" step="any" className={inputStyle} placeholder="-32.1234" required
            value={formData.lat} onChange={(e) => setFormData({...formData, lat: e.target.value})} />
        </div>
        <div>
          <label className={labelStyle}><Navigation size={12}/> Longitud</label>
          <input type="number" step="any" className={inputStyle} placeholder="-68.1234" required
            value={formData.lng} onChange={(e) => setFormData({...formData, lng: e.target.value})} />
        </div>
        <div>
          <label className={labelStyle}>Teléfono / WhatsApp</label>
          <input type="tel" className={inputStyle} placeholder="+54 9..." 
            value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>Pequeña Reseña</label>
          <textarea rows={2} className={inputStyle} placeholder="Breve descripción..." 
            value={formData.resena} onChange={(e) => setFormData({...formData, resena: e.target.value})} />
        </div>
        <button type="submit" className={`md:col-span-2 w-full text-white font-black p-4 rounded-xl shadow-lg transition-all uppercase tracking-widest ${comercioAEditar ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {comercioAEditar ? 'Actualizar Cambios' : 'Guardar Comercio'}
        </button>
      </form>
    </div>
  );
};

// --- COMPONENTE: TABLA DE COMERCIOS (ACCIONES REALES) ---
const TablaComercios = ({ refreshKey, onEditRequest }: { refreshKey: number, onEditRequest: (comercio: any) => void }) => {
  const [comercios, setComercios] = useState<any[]>([]);

  const fetchComercios = async () => {
    const { data, error } = await supabase.from('comercios').select('*').order('created_at', { ascending: false });
    if (!error) setComercios(data || []);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      const { error } = await supabase.from('comercios').delete().eq('id', id);
      if (!error) fetchComercios();
    }
  };

  useEffect(() => { fetchComercios(); }, [refreshKey]);

  return (
    <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200"><h4 className="text-sm font-black text-slate-700 uppercase">Comercios Registrados</h4></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 text-xs font-black text-slate-400 uppercase">Nombre</th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase">Rubro</th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase">Dirección</th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comercios.map((comercio) => (
              <tr key={comercio.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm font-bold text-slate-700">{comercio.nombre}</td>
                <td className="p-4 text-sm text-slate-500"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold uppercase">{comercio.rubro}</span></td>
                <td className="p-4 text-sm text-slate-500">{comercio.direccion}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEditRequest(comercio)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(comercio.id, comercio.nombre)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {comercios.length === 0 && <p className="p-8 text-center text-slate-400 text-sm italic">No hay comercios cargados.</p>}
      </div>
    </div>
  );
};

// --- COMPONENTE: FICHA PÚBLICA DE MASCOTA (QR) ---
const PublicPetProfile = ({ pet, owner }: { pet: Pet, owner: UserProfile }) => {
    const isLost = pet.status === 'lost';
    const isSafe = pet.status === 'safe';
    const phone = owner.phone ? owner.phone.replace(/[^0-9]/g, '') : '';
    const whatsappLink = phone ? `https://wa.me/${phone}?text=Hola, escaneé el código QR de ${pet.name} y quiero ayudar.` : null;

    if (isSafe) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20"><PawPrintBackground /></div>
                <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10 p-6 text-center space-y-6">
                    <div className="relative w-40 h-40 mx-auto">
                        <img src={pet.photoUrl} className="w-full h-full object-cover rounded-full border-4 border-green-500/30 shadow-lg shadow-green-500/20" alt={pet.name} />
                        <div className="absolute bottom-2 right-2 bg-green-500 text-slate-900 p-2 rounded-full border-4 border-slate-900"><ShieldCheck className="w-6 h-6" /></div>
                    </div>
                    <div><h1 className="text-3xl font-black text-white uppercase tracking-wide">{pet.name}</h1><p className="text-slate-400 font-medium">{pet.breed}</p></div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700"><p className="text-green-400 font-bold text-lg mb-1">¡Estoy seguro!</p><p className="text-slate-300 text-sm">Actualmente estoy en casa y cuidado por mi dueño, <span className="font-bold text-white">{owner.firstName}</span>.</p></div>
                    <div className="pt-4 border-t border-slate-800"><p className="text-xs text-slate-600">Identidad verificada por DNI-PETS</p></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"><PawPrintBackground /></div>
            <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10">
                <div className="relative h-72">
                    <img src={pet.photoUrl} className="w-full h-full object-cover" alt={pet.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                        {isLost ? (
                            <span className="bg-red-600 text-white font-bold px-4 py-1 rounded-full animate-pulse shadow-lg shadow-red-900/50 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> PERDIDO</span>
                        ) : (
                            <span className="bg-blue-500 text-white font-bold px-4 py-1 rounded-full shadow-lg shadow-blue-900/50 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> EN ADOPCIÓN</span>
                        )}
                    </div>
                    <div className="absolute bottom-4 left-6 right-6"><h1 className="text-4xl font-black text-white uppercase tracking-wide drop-shadow-md">{pet.name}</h1><p className="text-slate-200 text-lg font-medium drop-shadow-md">{pet.breed} • {pet.sex}</p></div>
                </div>
                <div className="px-6 py-4">
                    {isLost ? (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4"><h3 className="font-bold text-red-500 text-lg mb-1">¡Ayúdame a volver!</h3><p className="text-sm text-red-300">Estoy perdido. Contacta a mi familia urgentemente.</p></div>
                    ) : (
                        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4"><h3 className="font-bold text-blue-400 text-lg mb-1">¡Búscame un hogar!</h3><p className="text-sm text-blue-300">Busco familia. Contáctanos para adoptarme.</p></div>
                    )}
                </div>
                <div className="px-6 pb-8 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-4 border border-slate-700"><div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center shrink-0"><UserIcon className="text-slate-400" /></div><div><p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Responsable</p><p className="text-lg font-bold text-slate-100">{owner.firstName || 'Usuario DNI-PETS'}</p></div></div>
                    {whatsappLink ? (
                        <a href={whatsappLink} target="_blank" rel="noreferrer" className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg ${isLost ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20 text-white' : 'bg-[#25D366] hover:bg-[#128C7E] shadow-green-900/20 text-white'}`}><MessageCircle className="w-6 h-6" /> {isLost ? 'Reportar Hallazgo' : 'Contactar por WhatsApp'}</a>
                    ) : (
                        <div className="text-center text-slate-500 text-sm p-2 bg-slate-800 rounded-lg">Contacto privado</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---
const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scannedPet, setScannedPet] = useState<Pet | null>(null);
  const [scannedOwner, setScannedOwner] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Estado para el comercio que se está editando
  const [comercioAEditar, setComercioAEditar] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const getPetIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('p') || params.get('id');
    };

    const petId = getPetIdFromUrl();
    if (petId) {
        petService.getPublicPetData(petId)
            .then((result) => {
                if (result) {
                    setScannedPet(result.pet);
                    setScannedOwner(result.owner);
                }
            })
            .catch(err => console.error("Error QR:", err));
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error al ingresar: " + error.message);
    else setShowLogin(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  if (loading) {
      return (
        <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00D1C6]"></div>
        </div>
      );
  }

  if (scannedPet && scannedOwner) return <PublicPetProfile pet={scannedPet} owner={scannedOwner} />;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <LandingPage />

      <footer className="py-10 bg-slate-50 flex flex-col items-center justify-center border-t border-slate-100">
        <p className="text-slate-400 text-sm mb-4">© 2026 DNI-PETS - Todos los derechos reservados</p>
        {!user ? (
          <button onClick={() => setShowLogin(true)} className="text-slate-300 hover:text-blue-500 transition-colors p-2"><Lock size={16} /></button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Sesión iniciada</span>
            <button onClick={handleLogout} className="text-red-500 text-xs font-bold hover:underline">CERRAR SESIÓN</button>
          </div>
        )}
      </footer>

      {showLogin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center"><h2 className="text-2xl font-black text-slate-800 uppercase">Admin Login</h2></div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" className="w-full border-2 border-slate-200 p-3 rounded-xl text-slate-900 bg-white" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="w-full border-2 border-slate-200 p-3 rounded-xl text-slate-900 bg-white" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl shadow-lg">ENTRAR</button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full text-slate-500 text-sm">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {user?.email === 'maguero89@gmail.com' && (
        <div className="bg-blue-50 p-6 md:p-12 border-t-4 border-blue-600">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl">
              <h3 className="text-xl font-black uppercase">Gestión de Comercios</h3>
              <p className="text-blue-100 text-sm">Panel de Administración - DNI-PETS</p>
            </div>

            <FormularioComercio 
              comercioAEditar={comercioAEditar} 
              onCancelarEdicion={() => setComercioAEditar(null)}
              onComercioGuardado={() => setRefreshKey(prev => prev + 1)} 
            />

            <TablaComercios 
              refreshKey={refreshKey} 
              onEditRequest={(com) => setComercioAEditar(com)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;