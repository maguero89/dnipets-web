import React, { useEffect, useState } from 'react';
import { Pet, UserProfile } from '../types';
import { petService } from '../services/petService';
import { PetCard } from './PetCard';
import { AddPetModal } from './AddPetModal';
import { Plus, User, AlertCircle, Loader2 } from 'lucide-react';

interface UserDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const myPets = await petService.getPets();
        setPets(myPets);
      } catch (error) {
        console.error("Error cargando mascotas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [refreshKey]);

  return (
    <div className="bg-[#1c183d] min-h-screen pt-24 pb-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl lg:text-5xl font-[900] text-white uppercase tracking-tighter">Mi Panel</h2>
            <p className="text-[#00d1c6] text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <User size={14} />
              Bienvenid@, {user.firstName || user.email.split('@')[0]}
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black px-6 py-4 rounded-2xl shadow-xl shadow-[#00d1c6]/10 transition-all uppercase tracking-widest text-xs"
          >
            <Plus size={16} />
            Nueva Mascota
          </button>
        </div>

        {/* PETS LIST */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-white/50 space-y-4">
              <Loader2 size={40} className="animate-spin text-[#00d1c6]" />
              <p className="text-xs font-bold uppercase tracking-widest">Cargando tus mascotas...</p>
            </div>
          ) : pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="bg-[#2a2550] border border-white/5 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-6">
              <div className="bg-[#0d0f35] p-6 rounded-full text-white/20">
                <AlertCircle size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Aún no tienes mascotas</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto">
                  Registra a tu primera mascota para obtener su DNI digital y su propio código QR de protección.
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-xl transition-all text-xs tracking-widest uppercase"
              >
                Agregar Mascota
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddPetModal 
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};
