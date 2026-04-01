import React, { useEffect, useState } from 'react';
import { Pet, UserProfile, HealthRecord } from '../types';
import { petService } from '../services/petService';
import { 
  ShieldCheck, 
  AlertTriangle, 
  MessageCircle, 
  Heart, // Icono para adopción
  BellRing // Icono para llamar la atención en perdido
} from 'lucide-react';

interface Props {
  pet: Pet;
  owner: UserProfile;
}

export const PublicPetView: React.FC<Props> = ({ pet, owner }) => {
  const [vacunas, setVacunas] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos la tabla health_records que me compartiste
    petService.getHealthRecords(pet.id)
      .then(records => {
        // Filtramos para ver si tiene registros de tipo "Vacuna" o simplemente si tiene registros
        setVacunas(records);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pet.id]);

  let vaccineStatus = 'none';
  let vaccineText = 'Sin vacunas registradas';

  if (vacunas.length > 0) {
      const justVaccines = vacunas.filter(r => r.type === 'vaccine' || r.title.toLowerCase().includes('vacuna'));
      const recordsToUse = justVaccines.length > 0 ? justVaccines : vacunas;

      let latestDate: Date | null = null;
      for (const record of recordsToUse) {
          if (record.date) {
              const d = new Date(record.date);
              if (!latestDate || d > latestDate) {
                  latestDate = d;
              }
          }
      }

      if (latestDate) {
          const today = new Date();
          const msDiff = today.getTime() - latestDate.getTime();
          const daysDiff = msDiff / (1000 * 60 * 60 * 24);

          if (daysDiff > 365) {
              vaccineStatus = 'expired';
              vaccineText = 'Vacunas vencidas';
          } else if (daysDiff > 335) { // roughly 11 months
              vaccineStatus = 'expiring-soon';
              vaccineText = 'Próximo a vencerse';
          } else {
              vaccineStatus = 'up-to-date';
              vaccineText = 'Vacunas al día';
          }
      }
  }

  const whatsappLink = owner.phone ? `https://wa.me/${owner.phone.replace(/[^0-9]/g, '')}?text=Hola, escaneé el carnet de ${pet.name}` : null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      
      {/* TARJETA ESTILO DNI (Basada en la foto de Akira) */}
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative">
        
        <div className="flex justify-center pt-8">
          <div className="bg-[#00D1C6] text-white px-6 py-1 rounded-lg font-black text-lg tracking-widest uppercase">
            ID ANIMAL
          </div>
        </div>

        <div className="flex flex-col md:flex-row p-8 gap-8 items-center md:items-start">
          {/* FOTO IZQUIERDA */}
          <div className="w-64 h-64 shrink-0">
            <img 
              src={pet.photoUrl} 
              className="w-full h-full object-cover rounded-[2rem] border-4 border-slate-100 shadow-sm" 
              alt={pet.name} 
            />
          </div>

          {/* DATOS DERECHA */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-5xl font-black text-[#1a2b4b] uppercase tracking-tighter">{pet.name}</h1>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especie</p>
                <p className="text-xl font-black text-[#1a2b4b] uppercase">
                {pet.species?.toLowerCase() === 'dog' ? 'Perro' : 
                pet.species?.toLowerCase() === 'cat' ? 'Gato' : 
                pet.species}
                </p>
                </div>  
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Raza</p>
                <p className="text-xl font-black text-[#1a2b4b] uppercase">{pet.breed}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sexo</p>
                <p className="text-xl font-black text-[#1a2b4b] uppercase">{pet.sex === 'Hembra' ? 'H' : 'M'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peso</p>
                <p className="text-xl font-black text-[#1a2b4b] uppercase">{pet.weight} kg</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Nacimiento</p>
                <p className="text-xl font-black text-[#1a2b4b] uppercase">{pet.birthDate || 'No registrada'}</p>
              </div>
            </div>

            {/* LOGICA DE VACUNAS (Consulta a health_records) */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                {loading ? (
                    <p className="text-xs text-slate-400 animate-pulse">Verificando sistema de salud...</p>
                ) : vaccineStatus === 'up-to-date' ? (
                    <div className="flex items-center gap-2 text-green-600 font-black uppercase text-sm">
                        <ShieldCheck size={20} /> {vaccineText}
                    </div>
                ) : vaccineStatus === 'expiring-soon' ? (
                    <div className="flex items-center gap-2 text-yellow-500 font-black uppercase text-sm">
                        <AlertTriangle size={20} /> {vaccineText}
                    </div>
                ) : vaccineStatus === 'expired' ? (
                    <div className="flex items-center gap-2 text-red-500 font-black uppercase text-sm">
                        <AlertTriangle size={20} /> {vaccineText}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-sm">
                        <AlertTriangle size={20} /> {vaccineText}
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 pb-6">
            <span className="text-[#00D1C6] text-2xl">🐾</span>
            <span className="text-[#1a2b4b] font-black tracking-[0.3em] text-xl">DNIPETS</span>
        </div>

        <div className="h-5 bg-[#1a2b4b] w-full"></div>
      </div>

      {/* SECCIÓN DE ESTADOS DINÁMICOS */}
      <div className="mt-8 w-full max-w-2xl text-center">
        {pet.status === 'safe' ? (
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-blue-200 inline-block px-12 shadow-sm">
                <p className="text-blue-800 font-black uppercase text-xs tracking-widest">Mascota Segura</p>
                <p className="text-slate-600 text-sm">Dueño: {owner.firstName}</p>
            </div>
        ) : pet.status === 'lost' ? (
            /* MODO PERDIDO: Alerta máxima con animación */
            <div className="space-y-6">
                <div className="bg-red-600 text-white p-6 rounded-3xl shadow-2xl border-4 border-white animate-pulse inline-block w-full">
                    <div className="flex items-center justify-center gap-4">
                        <BellRing size={40} className="animate-ring" />
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                            Estoy Perdido ayudame a Volver a Casa
                        </h2>
                        <BellRing size={40} className="animate-ring" />
                    </div>
                </div>
                {whatsappLink && (
                    <a href={whatsappLink} target="_blank" rel="noreferrer" 
                       className="bg-[#25D366] text-white px-12 py-5 rounded-full font-black flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform mx-auto w-fit uppercase text-lg tracking-widest">
                        <MessageCircle size={28} /> Reportar Hallazgo
                    </a>
                )}
            </div>
        ) : (
            /* MODO ADOPCIÓN: Violeta con corazón */
            <div className="space-y-6">
                <div className="bg-violet-100 border-4 border-violet-500 p-6 rounded-3xl shadow-xl inline-block w-full">
                    <div className="flex items-center justify-center gap-3 text-violet-600">
                        <Heart size={32} fill="currentColor" />
                        <h2 className="text-3xl font-black uppercase tracking-widest">
                            ESTOY EN ADOPCION
                        </h2>
                        <Heart size={32} fill="currentColor" />
                    </div>
                </div>
                {whatsappLink && (
                    <a href={whatsappLink} target="_blank" rel="noreferrer" 
                       className="bg-violet-600 text-white px-12 py-5 rounded-full font-black flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform mx-auto w-fit uppercase text-lg tracking-widest">
                        <MessageCircle size={28} /> Quiero Adoptar
                    </a>
                )}
            </div>
        )}
      </div>
    </div>
  );
};