import React, { useState, useEffect } from 'react';
import { PublicPetProfile } from './components/PublicPetProfile';
import { FormularioComercio } from './components/FormularioComercio';
import { TablaComercios } from './components/TablaComercios';
import { AdminMessages } from './components/AdminMessages';
import LandingPage from './components/LandingPage';
import { MobileSimulator } from './components/beta/MobileSimulator';
import { Pet, UserProfile } from './types';
import { petService, supabase } from './services/petService';
import { Lock, Eye, EyeOff, Layout, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scannedPet, setScannedPet] = useState<Pet | null>(null);
  const [scannedOwner, setScannedOwner] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showBetaSimulator, setShowBetaSimulator] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Estado para el comercio que se está editando
  const [comercioAEditar, setComercioAEditar] = useState<any | null>(null);
  const [adminTab, setAdminTab] = useState<'comercios' | 'mensajes'>('comercios');

  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
      }
    });

    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true' || hash.includes('type=recovery') || hash.includes('access_token')) {
      setIsResettingPassword(true);
    }

    const getPetIdFromUrl = () => {
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

  const handleAdminRecoverPassword = async () => {
    if (!email) {
      alert("Por favor, ingresa tu correo electrónico primero.");
      return;
    }
    try {
      await petService.recoverPassword(email);
      alert(`Enviamos las instrucciones a ${email}. Revisa tu correo.`);
    } catch (err: any) {
      alert("Error al solicitar recuperación: " + err.message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setResetLoading(true);
    try {
      await petService.updatePassword(newPassword);
      alert("¡Contraseña actualizada con éxito! Ya puedes ingresar.");
      setIsResettingPassword(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err: any) {
      alert("Error al actualizar contraseña: " + err.message);
    } finally {
      setResetLoading(false);
    }
  };

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
      <LandingPage
        onAdminLogin={() => setShowLogin(true)}
        onBetaLogin={() => setShowBetaSimulator(true)}
        onLogout={handleLogout}
        user={user}
      />

      {isResettingPassword && (
        <div className="fixed inset-0 bg-[#0d0f35]/95 backdrop-blur-md flex items-center justify-center z-[150] p-4">
          <div className="bg-[#1c183d] w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-white/10 space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Nueva Contraseña</h2>
              <p className="text-[#00d1c6] text-xs font-bold uppercase tracking-wider">Ingresa tu nueva contraseña para DNI-PETS</p>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nueva Contraseña (mínimo 6 caracteres)"
                  required
                  minLength={6}
                  className="w-full bg-[#2a2550] border border-white/10 p-4 pr-12 rounded-2xl text-white outline-none focus:border-[#00d1c6] transition-all"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00d1c6]"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black p-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {resetLoading ? 'Actualizando...' : 'Establecer Contraseña'}
              </button>

              <button
                type="button"
                onClick={() => setIsResettingPassword(false)}
                className="w-full text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

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
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAdminRecoverPassword}
                    className="text-[10px] text-slate-400 hover:text-[#00d1c6] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
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

      {showBetaSimulator && (
        <MobileSimulator onClose={() => setShowBetaSimulator(false)} />
      )}

      {user?.email === 'maguero89@gmail.com' && (
        <div className="bg-[#1c183d] p-8 md:p-20 border-t border-white/5 relative z-10">
          <div className="max-w-5xl mx-auto space-y-12">

            {/* ADMIN HEADER & TABS */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h3 className="text-4xl font-[900] text-white uppercase tracking-tighter">
                  {adminTab === 'comercios' ? 'Gestión de Comercios' : 'Buzón de Mensajes'}
                </h3>
                <p className="text-[#00d1c6] text-xs font-bold uppercase tracking-[0.2em] mt-2">
                  Panel de Administración - DNI-PETS
                </p>
              </div>

              {/* TAB SWITCHER */}
              <div className="flex bg-[#2a2550] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
                <button
                  onClick={() => setAdminTab('comercios')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'comercios'
                      ? 'bg-[#00d1c6] text-[#0d0f35] shadow-lg shadow-[#00d1c6]/20'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Layout size={14} />
                  Mapa
                </button>
                <button
                  onClick={() => setAdminTab('mensajes')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'mensajes'
                      ? 'bg-[#00d1c6] text-[#0d0f35] shadow-lg shadow-[#00d1c6]/20'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <MessageSquare size={14} />
                  Mensajes
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {adminTab === 'comercios' ? (
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
              ) : (
                <div className="space-y-8">
                  <AdminMessages />
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;