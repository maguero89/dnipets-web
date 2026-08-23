import React, { useEffect, useState } from 'react';
import { UserProfile, Pet } from '../../types';
import { petService } from '../../services/petService';
import { ChevronRight, Home, Map, Heart, User, Loader2, Plus, Bot } from 'lucide-react';
import { PawPrintBackground } from '../PawPrintBackground';

interface BetaDashboardProps {
  profile: UserProfile;
  onAddPet: () => void;
  onViewPet: (pet: Pet) => void;
  onViewProfile: () => void;
  onViewMap?: () => void;
  onViewAdoption?: () => void;
  onOpenVetAI?: () => void;
}

export const BetaDashboard: React.FC<BetaDashboardProps> = ({ 
  profile, 
  onAddPet, 
  onViewPet, 
  onViewProfile, 
  onViewMap,
  onViewAdoption,
  onOpenVetAI
}) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    petService.getPets().then(data => {
      setPets(data);
      setLoading(false);
    });
  }, []);

  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex-1 bg-slate-50 flex flex-col relative animate-in fade-in duration-300 font-sans overflow-hidden">
      <PawPrintBackground />

      {/* HEADER */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight">
            Hola, {profile.firstName || 'Usuario'}
          </h1>
          <p className="text-slate-500 text-xs font-medium">Gestiona la identidad de tus mascotas</p>
        </div>
        <button 
          onClick={onViewProfile} 
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg hover:bg-primary/20 transition-colors shadow-sm"
        >
          {getInitial(profile.firstName || profile.email)}
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="relative z-10 px-6 flex-1 overflow-y-auto pt-6 pb-24 space-y-6">

        {/* VET AI ASSISTANT BANNER */}
        {onOpenVetAI && (
          <div 
            onClick={onOpenVetAI}
            className="bg-gradient-to-r from-[#0d0f35] to-[#1c183d] text-white rounded-2xl p-4 flex items-center justify-between shadow-lg border border-white/10 cursor-pointer hover:border-[#00D1C6]/50 transition-all group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00D1C6]/20 flex items-center justify-center text-[#00D1C6] border border-[#00D1C6]/30">
                <Bot size={26} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight text-white flex items-center gap-2">
                  Asistente VetAI <span className="bg-[#00D1C6] text-[#0d0f35] text-[9px] font-black uppercase px-2 py-0.5 rounded-md">Gemini IA</span>
                </h3>
                <p className="text-xs text-slate-300">Consultas de salud y razas en tiempo real</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#00D1C6] group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {/* PETS LIST SECTION */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-navy">Mis Mascotas</h2>
            <button 
              onClick={onAddPet}
              className="flex items-center gap-1 text-primary font-bold text-xs bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Plus size={16} /> Nueva
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-primary" size={30} />
            </div>
          ) : (
            <div className="space-y-3">
              {pets.map(pet => (
                <div 
                  key={pet.id} 
                  onClick={() => onViewPet(pet)}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md active:scale-95 transition-all"
                >
                  <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                    pet.status === 'lost' ? 'border-red-500' : pet.status === 'adoption' ? 'border-purple-500' : 'border-gray-100'
                  }`}>
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl">
                        {pet.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-brand-navy leading-snug">{pet.name}</h3>
                      {pet.status === 'lost' && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Perdido</span>}
                      {pet.status === 'adoption' && <span className="text-[9px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">En Adopción</span>}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{pet.breed || pet.species} • {pet.sex === 'Hembra' ? 'Hembra' : 'Macho'}</p>
                  </div>

                  <ChevronRight size={20} className="text-gray-300" />
                </div>
              ))}

              {pets.length === 0 && (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-sm">Aún no tienes mascotas registradas.</p>
                  <button onClick={onAddPet} className="mt-3 text-primary font-bold text-xs hover:underline">
                    + Registrar primera mascota
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* BOTTOM NAV BAR 1:1 CON LA APP ORIGINAL */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-2 pb-4 z-20">
        <button className="flex flex-col items-center gap-1 text-brand-navy">
          <Home size={22} className="text-brand-navy" strokeWidth={2.5} />
          <span className="text-[10px] font-bold text-brand-navy">Inicio</span>
        </button>
        <button onClick={onViewMap} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-navy transition-colors">
          <Map size={22} />
          <span className="text-[10px] font-medium">Mapa</span>
        </button>
        <button onClick={onViewAdoption} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-navy transition-colors">
          <Heart size={22} />
          <span className="text-[10px] font-medium">Adopción</span>
        </button>
        <button onClick={onViewProfile} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-navy transition-colors">
          <User size={22} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>

    </div>
  );
};
