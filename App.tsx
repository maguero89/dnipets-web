import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
// Quitamos Sidebar, ChatInterface, ImageGenerator, etc.
import { Pet, UserProfile } from './types';
import { petService } from './services/petService';
import { PawPrintBackground } from './components/PawPrintBackground';
import { ShieldCheck, AlertTriangle, User as UserIcon, MessageCircle } from 'lucide-react';

// --- COMPONENTE: FICHA PÚBLICA DE MASCOTA (QR) ---
// (Este código se mantiene igual porque es vital para el QR)
const PublicPetProfile = ({ pet, owner }: { pet: Pet, owner: UserProfile }) => {
    const isLost = pet.status === 'lost';
    const isSafe = pet.status === 'safe';
    const phone = owner.phone ? owner.phone.replace(/[^0-9]/g, '') : '';
    const whatsappLink = phone ? `https://wa.me/${phone}?text=Hola, escaneé el código QR de ${pet.name} y quiero ayudar.` : null;

    if (isSafe) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20"><PawPrintBackground /></div>
                <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10 p-6 text-center space-y-6">
                    <div className="relative w-40 h-40 mx-auto">
                        <img src={pet.photoUrl} className="w-full h-full object-cover rounded-full border-4 border-green-500/30 shadow-lg shadow-green-500/20" alt={pet.name} />
                        <div className="absolute bottom-2 right-2 bg-green-500 text-slate-900 p-2 rounded-full border-4 border-slate-900"><ShieldCheck className="w-6 h-6" /></div>
                    </div>
                    <div><h1 className="text-3xl font-black text-white uppercase tracking-wide">{pet.name}</h1><p className="text-slate-400 font-medium">{pet.breed}</p></div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700"><p className="text-green-400 font-bold text-lg mb-1">¡Estoy seguro!</p><p className="text-slate-300 text-sm">Actualmente estoy en casa y cuidado por mi dueño, <span className="font-bold text-white">{owner.firstName}</span>.</p></div>
                    <div className="pt-4 border-t border-slate-800"><p className="text-xs text-slate-600">Identidad verificada por DNI-PETS</p></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"><PawPrintBackground /></div>
            <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10">
                <div className="relative h-72">
                    <img src={pet.photoUrl} className="w-full h-full object-cover" alt={pet.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                        {isLost ? (
                            <span className="bg-red-600 text-white font-bold px-4 py-1 rounded-full animate-pulse shadow-lg shadow-red-900/50 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> PERDIDO</span>
                        ) : (
                            <span className="bg-blue-500 text-white font-bold px-4 py-1 rounded-full shadow-lg shadow-blue-900/50 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> EN ADOPCIÓN</span>
                        )}
                    </div>
                    <div className="absolute bottom-4 left-6 right-6"><h1 className="text-4xl font-black text-white uppercase tracking-wide drop-shadow-md">{pet.name}</h1><p className="text-slate-200 text-lg font-medium drop-shadow-md">{pet.breed} • {pet.sex}</p></div>
                </div>
                <div className="px-6 py-4">
                    {isLost ? (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4"><h3 className="font-bold text-red-500 text-lg mb-1">¡Ayúdame a volver!</h3><p className="text-sm text-red-300">Estoy perdido. Contacta a mi familia urgentemente.</p></div>
                    ) : (
                        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4"><h3 className="font-bold text-blue-400 text-lg mb-1">¡Búscame un hogar!</h3><p className="text-sm text-blue-300">Busco familia. Contáctanos para adoptarme.</p></div>
                    )}
                </div>
                <div className="px-6 pb-8 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-4 border border-slate-700"><div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center shrink-0"><UserIcon className="text-slate-400" /></div><div><p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Responsable</p><p className="text-lg font-bold text-slate-100">{owner.firstName || 'Usuario DNI-PETS'}</p></div></div>
                    {whatsappLink ? (
                        <a href={whatsappLink} target="_blank" rel="noreferrer" className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg ${isLost ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20 text-white' : 'bg-[#25D366] hover:bg-[#128C7E] shadow-green-900/20 text-white'}`}><MessageCircle className="w-6 h-6" /> {isLost ? 'Reportar Hallazgo' : 'Contactar por WhatsApp'}</a>
                    ) : (
                        <div className="text-center text-slate-500 text-sm p-2 bg-slate-800 rounded-lg">Contacto privado</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL SIMPLIFICADA ---

const App: React.FC = () => {
  // Solo necesitamos estados para el QR
  const [loadingQr, setLoadingQr] = useState(true);
  const [scannedPet, setScannedPet] = useState<Pet | null>(null);
  const [scannedOwner, setScannedOwner] = useState<UserProfile | null>(null);

  // DETECCIÓN DE QR (Lógica intacta)
  useEffect(() => {
    const getPetIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('p')) return params.get('p');
        if (params.get('id')) return params.get('id');
        if (window.location.hash.includes('?')) {
            const hashParts = window.location.hash.split('?')[1];
            const hashParams = new URLSearchParams(hashParts);
            if (hashParams.get('p')) return hashParams.get('p');
            if (hashParams.get('id')) return hashParams.get('id');
        }
        return null;
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
            .catch(err => console.error("Error QR:", err))
            .finally(() => setLoadingQr(false));
    } else {
        setLoadingQr(false);
    }
  }, []);

  // 1. CARGANDO (Spinner)
  if (loadingQr) {
      return (
        <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D1C6]"></div>
        </div>
      );
  }

  // 2. MODO QR DETECTADO (Ficha de mascota)
  if (scannedPet && scannedOwner) {
      return <PublicPetProfile pet={scannedPet} owner={scannedOwner} />;
  }

  // 3. MODO NORMAL (Solo Landing Page)
  // Redirigimos al Instagram si alguien intentara "Entrar" a la app desde la landing
  return (
    <LandingPage 
    
    />
  );
};

export default App;