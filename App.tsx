import React, { useState, useEffect } from 'react';
import { PublicPetProfile } from './components/PublicPetProfile';
import { FormularioComercio } from './components/FormularioComercio';
import { TablaComercios } from './components/TablaComercios';
import LandingPage from './components/LandingPage';
import { Pet, UserProfile } from './types';
import { petService, supabase } from './services/petService';
import { Lock, Eye, EyeOff } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scannedPet, setScannedPet] = useState<Pet | null>(null);
  const [scannedOwner, setScannedOwner] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="h-screen w-screen bg-[#0d0f35] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00D1C6]"></div>
      </div>
    );
  }

  if (scannedPet && scannedOwner) return <PublicPetProfile pet={scannedPet} owner={scannedOwner} />;

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f35]">
      <LandingPage />

      <footer className="py-12 bg-[#0d0f35] flex flex-col items-center justify-center border-t border-white/5 relative z-10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          © 2026 DNI-PETS - Digital Identity
        </p>
        {!user ? (
          <button
            onClick={() => setShowLogin(true)}
            className="text-slate-700 hover:text-[#00d1c6] transition-colors p-3 bg-white/5 rounded-full border border-white/5"
          >
            <Lock size={16} />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black text-[#00d1c6] uppercase tracking-widest bg-[#00d1c6]/10 px-3 py-1 rounded-full border border-[#00d1c6]/20">
              Sesión iniciada
            </span>
            <button onClick={handleLogout} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:text-red-400 transition-colors">
              CERRAR SESIÓN
            </button>
          </div>
        )}
      </footer>

      {showLogin && (
        <div className="fixed inset-0 bg-[#0d0f35]/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c183d] w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-[900] text-white uppercase tracking-tighter">Admin Login</h2>
              <p className="text-[#00d1c6] text-[10px] font-bold uppercase tracking-widest mt-2">DNI-PETS Control Panel</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <input type="email" className="w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all" placeholder="admin@dnipets.com" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[#2a2550] border border-white/5 p-4 pr-12 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all placeholder:text-slate-400/30"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00d1c6] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black p-5 rounded-2xl shadow-xl shadow-[#00d1c6]/10 transition-all uppercase tracking-widest text-sm mt-4">
                Entrar al Panel
              </button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-400 transition-colors">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {user?.email === 'maguero89@gmail.com' && (
        <div className="bg-[#1c183d] p-8 md:p-20 border-t border-white/5 relative z-10">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-4xl font-[900] text-white uppercase tracking-tighter">Gestión de Comercios</h3>
                <p className="text-[#00d1c6] text-xs font-bold uppercase tracking-[0.2em] mt-2">Panel de Administración - DNI-PETS</p>
              </div>
              <div className="bg-[#2a2550] px-4 py-2 rounded-xl border border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</p>
                <p className="text-[#00d1c6] font-bold text-sm">Sincronizado con Supabase</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                <FormularioComercio
                  comercioAEditar={comercioAEditar}
                  onCancelarEdicion={() => setComercioAEditar(null)}
                  onComercioGuardado={() => setRefreshKey(prev => prev + 1)}
                />
              </div>
              <div className="lg:col-span-7">
                <TablaComercios
                  refreshKey={refreshKey}
                  onEditRequest={(com) => setComercioAEditar(com)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;