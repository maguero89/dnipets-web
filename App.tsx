import React, { useState, useEffect } from 'react';
// Tus componentes existentes
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import LiveInterface from './components/LiveInterface';
import LandingPage from './components/LandingPage';
// Iconos y Tipos
import { Menu, User as UserIcon, AlertTriangle, ShieldCheck, MessageCircle } from 'lucide-react';
import { AppMode, Pet, UserProfile } from './types'; 
import { petService } from './services/petService';
import { PawPrintBackground } from './components/PawPrintBackground';

// --- COMPONENTE: FICHA PÚBLICA DE MASCOTA (QR) ---
const PublicPetProfile = ({ pet, owner }: { pet: Pet, owner: UserProfile }) => {
    const isLost = pet.status === 'lost';
    const phone = owner.phone ? owner.phone.replace(/[^0-9]/g, '') : '';
    const whatsappLink = phone ? `https://wa.me/${phone}?text=Hola, escaneé el código QR de ${pet.name}.` : null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <PawPrintBackground />
            </div>
            
            <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10">
                {/* Foto Header */}
                <div className="relative h-72">
                    <img src={pet.photoUrl} className="w-full h-full object-cover" alt={pet.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6">
                        <h1 className="text-4xl font-black text-white uppercase tracking-wide drop-shadow-md">{pet.name}</h1>
                        <p className="text-slate-200 text-lg font-medium drop-shadow-md">{pet.breed} • {pet.sex}</p>
                    </div>
                </div>

                {/* Estado de Alerta */}
                <div className="px-6 py-4">
                    {isLost ? (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-4 animate-pulse">
                            <AlertTriangle className="text-red-500 w-8 h-8 shrink-0" />
                            <div>
                                <h3 className="font-bold text-red-500 text-lg">¡ESTOY PERDIDO!</h3>
                                <p className="text-sm text-red-400">Por favor ayuda a contactar a mi familia.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#00D1C6]/10 border border-[#00D1C6]/50 rounded-xl p-4 flex items-center gap-4">
                            <ShieldCheck className="text-[#00D1C6] w-8 h-8 shrink-0" />
                            <div>
                                <h3 className="font-bold text-[#00D1C6] text-lg">Identidad Verificada</h3>
                                <p className="text-sm text-[#00D1C6]/80">Mascota registrada en DNI-PETS.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Datos de Contacto */}
                <div className="px-6 pb-8 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-4 border border-slate-700">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                            <UserIcon className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Propietario</p>
                            <p className="text-lg font-bold text-slate-100">{owner.firstName || 'Usuario DNI-PETS'}</p>
                        </div>
                    </div>

                    {whatsappLink ? (
                        <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-900/20">
                            <MessageCircle className="w-6 h-6" /> Contactar por WhatsApp
                        </a>
                    ) : (
                        <div className="text-center text-slate-500 text-sm p-2 bg-slate-800 rounded-lg">Contacto privado</div>
                    )}
                </div>
                
                <div className="bg-slate-950 p-4 text-center border-t border-slate-800">
                    <p className="text-xs text-slate-600 font-mono">ID: {pet.id.slice(0,8).toUpperCase()} • DNI-PETS APP</p>
                </div>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---

const App: React.FC = () => {
  // Estados de tu diseño original
  const [currentMode, setMode] = useState<AppMode>(AppMode.Landing);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estados nuevos para QR
  const [loadingQr, setLoadingQr] = useState(true);
  const [scannedPet, setScannedPet] = useState<Pet | null>(null);
  const [scannedOwner, setScannedOwner] = useState<UserProfile | null>(null);

  // 1. EFECTO: Detectar QR al iniciar (MODIFICADO PARA LEER 'p')
  useEffect(() => {
    const getPetIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        
        // A. Intenta leer "p" (lo que manda tu App Android)
        if (params.get('p')) return params.get('p');

        // B. Intenta leer "id" (formato web antiguo)
        if (params.get('id')) return params.get('id');

        // C. Intenta leer hash (por si acaso)
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
        console.log("Detectando mascota:", petId);
        // Si hay ID, buscamos en Supabase
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

  // 2. RENDERIZADO DEL CONTENIDO INTERNO
  const renderContent = () => {
    switch (currentMode) {
      case AppMode.Chat:
        return <ChatInterface />;
      case AppMode.Image:
        return <ImageGenerator />;
      case AppMode.Live:
        return <LiveInterface />;
      default:
        return <ChatInterface />;
    }
  };

  // --- CONTROL DE VISTAS ---

  // CASO A: Cargando QR...
  if (loadingQr) {
      return (
        <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D1C6]"></div>
        </div>
      );
  }

  // CASO B: ¡QR DETECTADO! -> Mostramos ficha
  if (scannedPet && scannedOwner) {
      return <PublicPetProfile pet={scannedPet} owner={scannedOwner} />;
  }

  // CASO C: Usuario normal -> Landing Page
  if (currentMode === AppMode.Landing) {
    return <LandingPage onEnterApp={() => setMode(AppMode.Chat)} />;
  }

  // CASO D: Usuario dentro de la App
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar 
        currentMode={currentMode} 
        setMode={setMode} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full relative">
        <div className="md:hidden absolute top-4 left-4 z-50">
          {!isSidebarOpen && (
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-slate-800 rounded-lg text-white shadow-lg border border-slate-700"
            >
                <Menu className="w-6 h-6" />
            </button>
          )}
        </div>

        <main className="flex-1 h-full overflow-hidden relative">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;