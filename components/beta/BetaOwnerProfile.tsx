import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { petService } from '../../services/petService';
import { ShieldAlert, LogOut } from 'lucide-react';

interface BetaOwnerProfileProps {
  profile: UserProfile;
  onComplete: () => void;
  onLogout: () => void;
}

export const BetaOwnerProfile: React.FC<BetaOwnerProfileProps> = ({ profile, onComplete, onLogout }) => {
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      alert("El número de teléfono es obligatorio para el Modo Perdido.");
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = {
        ...profile,
        firstName,
        lastName,
        phone
      };
      await petService.updateUserProfile(updatedProfile);
      onComplete();
    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pt-12 p-6 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d0f35] tracking-tight">Completar Perfil</h1>
          <p className="text-slate-500 text-sm mt-1">Antes de continuar, necesitamos algunos datos.</p>
        </div>
        <button onClick={onLogout} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      <div className="bg-orange-100 border border-orange-200 text-orange-800 p-4 rounded-2xl flex items-start gap-3 mb-8">
        <ShieldAlert className="shrink-0 mt-0.5 text-orange-600" size={20} />
        <p className="text-sm font-medium leading-tight">
          El número de teléfono es <span className="font-bold">obligatorio</span> porque es el medio vital de contacto si activas el "Modo Perdido". Se mantendrá privado hasta que actives la alarma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nombre</label>
          <input 
            type="text" 
            placeholder="Ej: Laura" 
            required
            className="w-full bg-white border border-slate-200 text-[#0d0f35] p-4 rounded-2xl outline-none focus:border-[#00D1C6] focus:ring-4 focus:ring-[#00D1C6]/10 transition-all font-medium"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Apellido</label>
          <input 
            type="text" 
            placeholder="Ej: Gonzalez" 
            required
            className="w-full bg-white border border-slate-200 text-[#0d0f35] p-4 rounded-2xl outline-none focus:border-[#00D1C6] focus:ring-4 focus:ring-[#00D1C6]/10 transition-all font-medium"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Teléfono Móvil *</label>
          <input 
            type="tel" 
            placeholder="Ej: +54 9 11 1234-5678" 
            required
            className="w-full bg-white border-2 border-orange-200 text-[#0d0f35] p-4 rounded-2xl outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 transition-all font-medium"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <div className="mt-auto mb-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0d0f35] hover:bg-[#0d0f35]/90 text-white font-bold p-4 rounded-2xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar y Continuar'}
          </button>
        </div>
      </form>
    </div>
  );
};
