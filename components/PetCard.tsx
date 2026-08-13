import React, { useState } from 'react';
import { Pet } from '../types';
import { QrCode, ExternalLink, Activity, Syringe } from 'lucide-react';
import { QRCodeViewer } from './QRCodeViewer';
import { MedicalHistoryModal } from './MedicalHistoryModal';

interface PetCardProps {
  pet: Pet;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const [showQR, setShowQR] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  return (
    <>
      <div className="bg-[#2a2550] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col group hover:border-[#00d1c6]/30 transition-colors">
        <div className="relative h-48 sm:h-56 overflow-hidden bg-[#1c183d]">
          {pet.photoUrl ? (
            <img 
              src={pet.photoUrl} 
              alt={pet.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1c183d]">
              <div className="w-16 h-16 rounded-full bg-[#0d0f35] flex items-center justify-center text-white/20 text-3xl font-black">
                {pet.name.charAt(0)}
              </div>
            </div>
          )}
          
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg ${
              pet.status === 'safe' ? 'bg-[#00d1c6] text-[#0d0f35]' : 
              pet.status === 'lost' ? 'bg-red-500 text-white' : 
              'bg-indigo-500 text-white'
            }`}>
              {pet.status === 'safe' ? 'A Salvo' : pet.status === 'lost' ? 'Perdido' : 'Adopción'}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">{pet.name}</h3>
            <p className="text-slate-400 text-sm font-medium">{pet.breed} • {pet.sex}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowHealthModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#00d1c6]/10 text-[#00d1c6] hover:bg-[#00d1c6] hover:text-[#0d0f35] p-3 rounded-xl transition-all border border-[#00d1c6]/30 font-bold text-xs uppercase tracking-widest"
            >
              <Syringe size={16} />
              Historial Médico y Vacunas
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowQR(true)}
                className="flex items-center justify-center gap-2 bg-[#0d0f35] text-white p-3 rounded-xl hover:bg-[#00d1c6] hover:text-[#0d0f35] transition-colors border border-white/5 font-bold text-xs uppercase tracking-widest"
              >
                <QrCode size={16} />
                Ver QR
              </button>
              <a 
                href={`/?id=${pet.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0d0f35] text-white p-3 rounded-xl hover:bg-white hover:text-[#0d0f35] transition-colors border border-white/5 font-bold text-xs uppercase tracking-widest"
              >
                <ExternalLink size={16} />
                Perfil Web
              </a>
            </div>
          </div>
        </div>
      </div>

      {showQR && (
        <QRCodeViewer 
          petId={pet.id} 
          petName={pet.name} 
          onClose={() => setShowQR(false)} 
        />
      )}

      {showHealthModal && (
        <MedicalHistoryModal
          pet={pet}
          onClose={() => setShowHealthModal(false)}
        />
      )}
    </>
  );
};

