import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { petService } from '../../services/petService';
import { Home, Map, Heart, User, Key, LogOut, Save, X } from 'lucide-react';

interface BetaUserProfileProps {
  profile: UserProfile;
  onBackToHome: () => void;
  onLogout: () => void;
}

export const BetaUserProfile: React.FC<BetaUserProfileProps> = ({ profile, onBackToHome, onLogout }) => {
  const [editingPin, setEditingPin] = useState(false);
  const [pin, setPin] = useState(profile.securityPin || '0000');
  const [loading, setLoading] = useState(false);

  const handleSavePin = async () => {
    if (pin.length !== 4) return alert("El PIN debe tener exactamente 4 dígitos numéricos.");
    setLoading(true);
    try {
      await petService.updateUserProfile({ ...profile, securityPin: pin });
      profile.securityPin = pin;
      setEditingPin(false);
      alert("¡PIN de Seguridad actualizado con éxito!");
    } catch (e: any) {
      alert("Error al actualizar PIN: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPinToDefault = async () => {
    setLoading(true);
    try {
      await petService.updateUserProfile({ ...profile, securityPin: '0000' });
      setPin('0000');
      profile.securityPin = '0000';
      setEditingPin(false);
      alert("¡PIN restablecido con éxito a '0000'!");
    } catch (e: any) {
      alert("Error al restablecer PIN: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full relative overflow-hidden animate-in fade-in duration-300">
      
      {/* BACKGROUND PATTERN SIMULATION */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none overflow-hidden flex flex-wrap gap-10 p-4">
        {[...Array(20)].map((_, i) => (
          <svg key={i} viewBox="0 0 100 100" className="w-12 h-12 text-[#00D1C6]">
            <circle cx="20" cy="38" r="12" fill="currentColor" />
            <circle cx="42" cy="22" r="12" fill="currentColor" />
            <circle cx="68" cy="25" r="12" fill="currentColor" />
            <circle cx="88" cy="45" r="12" fill="currentColor" />
            <path d="M28 62 C 28 62, 40 45, 55 45 C 70 45, 82 62, 82 62 C 82 62, 85 85, 55 92 C 25 85, 28 62, 28 62 Z" fill="currentColor" />
          </svg>
        ))}
      </div>

      {/* HEADER */}
      <div className="relative z-10 px-6 pt-12 pb-4">
        <h1 className="text-2xl font-black text-[#0d0f35]">Mi Perfil</h1>
      </div>

      {/* BODY CONFIGURATION */}
      <div className="relative z-10 px-6 flex-1 overflow-y-auto pb-32 pt-2 space-y-4">
        
        {/* Name Card */}
        <div className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center relative">
            <User className="text-slate-400" size={24} />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00D1C6] rounded-full border-2 border-white"></div>
          </div>
          <h2 className="text-lg font-bold text-[#0d0f35] ml-4">
            {profile.firstName} {profile.lastName}
          </h2>
        </div>

        {/* Datos Personales Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-[#0d0f35]">Datos Personales</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</p>
              <p className="text-[#0d0f35] font-medium">{profile.firstName || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Apellido</p>
              <p className="text-[#0d0f35] font-medium">{profile.lastName || '-'}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</p>
            <p className="text-[#0d0f35] font-medium">{profile.phone || '-'}</p>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domicilio</p>
            <p className="text-[#0d0f35] font-medium">
              {profile.address?.street ? `${profile.address.street} ${profile.address.number || ''}, ${profile.address.city || ''}` : '-'}
            </p>
          </div>
        </div>

        {/* Seguridad Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4 relative overflow-hidden">
          <h3 className="font-bold text-[#0d0f35]">Seguridad</h3>
          
          {!editingPin ? (
            <button onClick={() => setEditingPin(true)} className="w-full bg-slate-50 p-4 rounded-xl flex items-center shadow-sm border border-slate-100 active:scale-95 transition-transform text-left">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                <Key size={18} className="text-[#0d0f35]" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-bold text-[#0d0f35]">PIN de Seguridad</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  PIN actual: <span className="font-mono font-bold text-brand-navy">{profile.securityPin || '0000'}</span>. <br/> Haz clic para cambiarlo o restablecerlo.
                </p>
              </div>
              <span className="text-slate-400 font-bold text-xs bg-slate-200 px-3 py-1.5 rounded-lg ml-2">Cambiar</span>
            </button>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="font-bold text-[#0d0f35] text-sm">Cambiar PIN de Seguridad</p>
                <button onClick={() => setEditingPin(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                  Ingresa tu Nuevo PIN (4 dígitos)
                </label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0000"
                  className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-center text-2xl font-mono font-black text-[#0d0f35] tracking-[0.5em] outline-none focus:border-[#00D1C6]"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button 
                  onClick={handleSavePin}
                  disabled={loading || pin.length !== 4}
                  className="w-full bg-[#00D1C6] hover:bg-[#00b8ae] text-[#0d0f35] font-black p-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 text-xs uppercase tracking-wider transition-colors"
                >
                  <Save size={16} />
                  <span>Guardar Nuevo PIN</span>
                </button>

                <button 
                  onClick={handleResetPinToDefault}
                  disabled={loading}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold p-3 rounded-xl flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Restablecer PIN por Defecto (0000)</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 leading-tight">
                Este PIN de 4 dígitos te será solicitado al cambiar el estado de tu mascota a Modo Perdido o Adopción para evitar cambios accidentales.
              </p>
            </div>
          )}
        </div>

        {/* Cerrar Sesión Button */}
        <button 
          onClick={onLogout}
          className="w-full bg-white border border-red-100 p-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm text-red-600 font-bold active:scale-95 transition-transform"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>

      </div>

      {/* BOTTOM NAV BAR */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-2 pb-4 z-20">
        <button onClick={onBackToHome} className="flex flex-col items-center gap-1 text-slate-400">
          <Home size={24} />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Map size={24} />
          <span className="text-[10px] font-medium">Mapa</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Heart size={24} />
          <span className="text-[10px] font-medium">Adopción</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#0d0f35]">
          <User size={24} />
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </div>

    </div>
  );
};
