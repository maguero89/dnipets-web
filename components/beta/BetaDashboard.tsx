import React, { useEffect, useState } from 'react';
import { UserProfile, Pet } from '../../types';
import { petService } from '../../services/petService';
import { ChevronRight, Home, Map, Heart, User, Loader2 } from 'lucide-react';

interface BetaDashboardProps {
  profile: UserProfile;
  onAddPet: () => void;
  onViewPet: (pet: Pet) => void;
  onViewProfile: () => void;
}

export const BetaDashboard: React.FC<BetaDashboardProps> = ({ profile, onAddPet, onViewPet, onViewProfile }) => {
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
    <div className="flex-1 bg-slate-50 flex flex-col relative animate-in fade-in duration-300">
      
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
      <div className="relative z-10 px-6 pt-12 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#0d0f35] flex items-center gap-2">
            Hola, {profile.firstName || 'Dueño'}
          </h1>
          <p className="text-slate-500 text-sm">Gestiona la identidad de tus mascotas</p>
        </div>
        <button onClick={onViewProfile} className="w-12 h-12 rounded-full bg-[#00D1C6]/10 flex items-center justify-center text-[#00D1C6] font-bold text-xl hover:bg-[#00D1C6]/20 transition-colors">
          {getInitial(profile.firstName || profile.email)}
        </button>
      </div>

      {/* PETS LIST SECTION */}
      <div className="relative z-10 px-6 flex-1 overflow-y-auto pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0d0f35]">Mis Mascotas</h2>
          <button 
            onClick={onAddPet}
            className="flex items-center gap-1 bg-[#00D1C6]/10 text-[#00D1C6] px-4 py-2 rounded-xl font-bold text-sm"
          >
            + Nueva
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#00D1C6]" size={30} />
          </div>
        ) : (
          <div className="space-y-4">
            {pets.map(pet => (
              <div 
                key={pet.id} 
                onClick={() => onViewPet(pet)}
                className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform"
              >
                {/* FOTO */}
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl">
                    {pet.name.charAt(0)}
                  </div>
                )}
                
                {/* DETALLES */}
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-[#0d0f35] leading-tight">{pet.name}</h3>
                  <p className="text-sm text-slate-500">{pet.breed || pet.species} • {pet.sex === 'Hembra' ? 'H' : 'M'}</p>
                </div>

                <div className="text-slate-300">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}

            {pets.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Aún no tienes mascotas registradas.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV BAR */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-2 pb-4 z-20">
        <button className="flex flex-col items-center gap-1 text-[#0d0f35]">
          <Home size={24} />
          <span className="text-[10px] font-bold">Inicio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Map size={24} />
          <span className="text-[10px] font-medium">Mapa</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Heart size={24} />
          <span className="text-[10px] font-medium">Adopción</span>
        </button>
        <button onClick={onViewProfile} className="flex flex-col items-center gap-1 text-slate-400">
          <User size={24} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>

    </div>
  );
};
