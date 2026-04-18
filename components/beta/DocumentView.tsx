import React, { useState } from 'react';
import { Pet, UserProfile } from '../../types';
import { ArrowLeft, Settings, AlertTriangle, Heart, ShieldCheck, Download, Share2, X, Lock } from 'lucide-react';
import { petService } from '../../services/petService';

interface DocumentViewProps {
  pet: Pet;
  profile: UserProfile;
  onBack: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ pet: initialPet, profile, onBack }) => {
  const [pet, setPet] = useState<Pet>(initialPet);
  const [loading, setLoading] = useState(false);
  
  // States for PIN modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const qrUrl = `https://www.dnipets.com/?id=${pet.id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`;

  const handleLostToggle = () => {
    if (pet.status !== 'lost') {
      // Intentar poner en Modo Perdido -> Mostrar PIN
      setPinInput('');
      setPinError('');
      setShowPinModal(true);
    } else {
      // Restaurar a Seguro
      executeStatusChange('safe');
    }
  };

  const confirmPinAndReport = () => {
    const requiredPin = profile.securityPin || '0000';
    if (pinInput !== requiredPin) {
      setPinError('El PIN es incorrecto.');
      return;
    }
    setShowPinModal(false);
    executeStatusChange('lost');
  };

  const executeStatusChange = async (newStatus: 'safe' | 'lost') => {
    setLoading(true);
    try {
      await petService.updatePetStatus(pet.id, newStatus);
      setPet({ ...pet, status: newStatus });
    } catch (error: any) {
      alert("Error al actualizar estado: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return '-';
    // Simplified age calculation
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(birthDate.substring(0, 4));
    return currentYear - birthYear > 0 ? `${currentYear - birthYear} años` : 'Cachorro';
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white z-20 shadow-sm relative">
        <button onClick={onBack} className="p-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-[#0d0f35] capitalize">{pet.name}</h2>
        <button className="p-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-6">
        
        {/* DNI CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden ring-1 ring-slate-100">
          
          {/* Faint Background Logo / Gradient Simulation */}
          <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-gradient-to-tr from-[#00D1C6]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex gap-4 relative z-10">
            {/* Foto Left */}
            <div className="w-32 h-40 bg-slate-100 rounded-2xl overflow-hidden shadow-sm shrink-0">
              {pet.photoUrl ? (
                <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <span className="text-4xl font-black">{pet.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Datos Right */}
            <div className="flex-1 flex flex-col relative">
              <h3 className="text-2xl font-black text-[#0d0f35] uppercase leading-none tracking-tight">{pet.name}</h3>
              <div className="bg-[#00D1C6] text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md w-fit uppercase mt-1 mb-3 shadow-[0_2px_10px_rgba(0,209,198,0.3)]">
                ID ANIMAL
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto text-xs">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Especie</p>
                  <p className="font-bold text-[#0d0f35] uppercase">{pet.species === 'cat' ? 'Felina' : 'Canina'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Raza</p>
                  <p className="font-bold text-[#0d0f35] capitalize">{pet.breed || 'Mestiza'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Sexo</p>
                  <p className="font-bold text-[#0d0f35]">{pet.sex === 'Hembra' ? 'H' : 'M'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Peso</p>
                  <p className="font-bold text-[#0d0f35]">{pet.weight} kg</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Fecha Nacimiento</p>
                  <p className="font-bold text-[#0d0f35]">{pet.birthDate || '-'}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 flex items-center justify-center p-0.5">
                <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-5 text-[#00D1C6] font-black tracking-widest text-[10px] opacity-80 border-t border-slate-100/50 pt-3">
            DNIPETS
          </div>
        </div>

        {/* QR ACTIONS (Extra no en la captura pero requeridos en la instruccion 6) */}
        <div className="flex gap-2">
          <a 
            href={qrImageUrl} 
            download={`QR_${pet.name}_Dnipets.png`}
            target="_blank"
            className="flex-1 flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-600 rounded-xl py-3 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Download size={14} /> Descargar QR
          </a>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(qrUrl);
              alert("Enlace copiado");
            }}
            className="flex-1 flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-600 rounded-xl py-3 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Share2 size={14} /> Enlace de Perfil
          </button>
        </div>

        {/* ESTADO Y BOTONES DE ACCIÓN */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Estado Actual</p>
            {pet.status === 'safe' ? (
              <div className="flex items-center gap-2 text-green-600 font-black text-lg tracking-tight uppercase">
                <ShieldCheck className="fill-green-100" size={24} />
                Seguro en Casa
              </div>
            ) : pet.status === 'adoption' ? (
              <div className="flex items-center gap-2 text-indigo-600 font-black text-lg tracking-tight uppercase">
                <Heart className="fill-indigo-100" size={24} />
                En Adopción
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 font-black text-lg tracking-tight uppercase animate-pulse">
                <AlertTriangle className="fill-red-100" size={24} />
                Reportado Perdido
              </div>
            )}
          </div>

          <div className="pt-2">
            <button 
              onClick={handleLostToggle}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all active:scale-95 disabled:opacity-50 ${
                pet.status === 'lost' 
                ? 'bg-slate-100 border-slate-200 text-slate-600' 
                : 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
              }`}
            >
              <AlertTriangle size={20} />
              <span className="font-bold text-sm tracking-wide">
                {pet.status === 'lost' ? 'MARCAR COMO ENCONTRADO' : 'REPORTAR PÉRDIDA'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* PIN CONFIRMATION MODAL */}
      {showPinModal && (
        <div className="absolute inset-0 z-50 bg-[#0d0f35]/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#0d0f35] mb-2 leading-tight">Confirmar Acción</h3>
            <p className="text-sm text-slate-500 mb-6">Ingresa tu PIN de seguridad para reportar a {pet.name} como pérdida. Si no lo has cambiado, el valor por defecto es <span className="font-bold text-[#0d0f35]">0000</span>.</p>
            
            <input 
              type="password"
              maxLength={4}
              placeholder="0000"
              className="w-full bg-slate-50 border border-slate-200 text-center text-[#0d0f35] text-3xl tracking-[0.5em] font-black p-4 rounded-xl outline-none focus:border-red-400 focus:ring-4 focus:ring-red-400/10 transition-all mb-2 placeholder:text-slate-300"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
            />
            {pinError && <p className="text-red-500 text-xs font-bold text-center mb-4">{pinError}</p>}
            
            <button 
              onClick={confirmPinAndReport}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-4 rounded-xl transition-colors mt-4"
            >
              Confirmar Alerta
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
