import React, { useState, useEffect } from 'react';
import { supabase, petService } from '../../services/petService';
import { X, Battery, Wifi, Signal, Home, Map, Heart, User } from 'lucide-react';
import { BetaAuth } from './BetaAuth';
import { BetaOwnerProfile } from './BetaOwnerProfile';
import { BetaDashboard } from './BetaDashboard';
import { BetaAddPet } from './BetaAddPet';
import { BetaUserProfile } from './BetaUserProfile';
import { DocumentView } from './DocumentView';
import { BetaMapView } from './BetaMapView';
import { BetaAdoptionView } from './BetaAdoptionView';
import { BetaVetAIAssistant } from './BetaVetAIAssistant';
import { UserProfile, Pet } from '../../types';

interface MobileSimulatorProps {
  onClose: () => void;
}

type AppState = 'loading' | 'auth' | 'onboarding' | 'dashboard' | 'add_pet' | 'view_pet' | 'view_profile' | 'map' | 'adoption' | 'vet_ai';

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({ onClose }) => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    setAppState('loading');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      setAppState('auth');
      setUserProfile(null);
      return;
    }

    const profile = await petService.getUserProfile(session.user.id);
    setUserProfile(profile);

    if (!profile.phone || profile.phone.trim() === '') {
      setAppState('onboarding');
    } else {
      setAppState('dashboard');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="fixed inset-0 bg-[#0d0f35]/95 backdrop-blur-md flex items-center justify-center z-[200] p-4 lg:p-10 perspective-1000">
      
      {/* CERRAR SIMULADOR */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 lg:top-10 lg:right-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors flex items-center gap-2"
      >
        <X size={24} />
        <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest mr-2">Cerrar Beta</span>
      </button>

      {/* MOBILE DEVICE FRAME */}
      <div className="relative w-full max-w-[375px] h-[812px] max-h-[90vh] bg-black rounded-[50px] shadow-[0_0_80px_rgba(0,209,198,0.15)] ring-8 ring-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* HARDWARE NOTCH & STATUS BAR */}
        <div className="absolute top-0 inset-x-0 h-7 flex items-center justify-between px-6 z-50 text-white/90">
          <span className="text-[10px] font-medium pt-1">9:41</span>
          
          {/* Dynamic Island / Notch Box */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-6 bg-black rounded-b-2xl"></div>
          
          <div className="flex items-center gap-1.5 pt-1">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={13} />
          </div>
        </div>

        {/* SCREEN CONTENT */}
        <div className="flex-1 w-full h-full bg-white relative overflow-hidden flex flex-col">
          {appState === 'loading' && (
            <div className="flex-1 flex items-center justify-center bg-[#0d0f35]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00D1C6]"></div>
            </div>
          )}

          {appState === 'auth' && (
            <BetaAuth onLoginSuccess={() => checkSession()} />
          )}

          {appState === 'onboarding' && userProfile && (
            <BetaOwnerProfile 
              profile={userProfile} 
              onComplete={() => checkSession()} 
              onLogout={handleLogout}
            />
          )}

          {appState === 'dashboard' && userProfile && (
            <BetaDashboard 
              profile={userProfile} 
              onAddPet={() => setAppState('add_pet')}
              onViewPet={(pet) => {
                setSelectedPet(pet);
                setAppState('view_pet');
              }}
              onViewProfile={() => setAppState('view_profile')}
              onViewMap={() => setAppState('map')}
              onViewAdoption={() => setAppState('adoption')}
              onOpenVetAI={() => setAppState('vet_ai')}
            />
          )}

          {appState === 'add_pet' && (
            <BetaAddPet 
              onBack={() => setAppState('dashboard')} 
              onSaved={() => setAppState('dashboard')} 
            />
          )}

          {appState === 'view_pet' && selectedPet && userProfile && (
            <DocumentView 
              pet={selectedPet}
              profile={userProfile}
              onBack={() => {
                setSelectedPet(null);
                setAppState('dashboard');
              }} 
            />
          )}

          {appState === 'view_profile' && userProfile && (
            <BetaUserProfile
              profile={userProfile}
              onBackToHome={() => setAppState('dashboard')}
              onLogout={handleLogout}
            />
          )}

          {appState === 'map' && userProfile && (
            <BetaMapView
              profile={userProfile}
              onGoHome={() => setAppState('dashboard')}
              onViewProfile={() => setAppState('view_profile')}
            />
          )}

          {appState === 'adoption' && (
            <div className="flex-1 flex flex-col relative h-full">
              <BetaAdoptionView 
                onGoHome={() => setAppState('dashboard')} 
              />
              {/* BARRA INFERIOR DE NAVEGACIÓN EN ADOPCIÓN */}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-2 pb-4 z-20">
                <button onClick={() => setAppState('dashboard')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-navy">
                  <Home size={22} />
                  <span className="text-[10px] font-medium">Inicio</span>
                </button>
                <button onClick={() => setAppState('map')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-navy">
                  <Map size={22} />
                  <span className="text-[10px] font-medium">Mapa</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-brand-navy">
                  <Heart size={22} className="text-brand-navy" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold text-brand-navy">Adopción</span>
                </button>
                <button onClick={() => setAppState('view_profile')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-navy">
                  <User size={22} />
                  <span className="text-[10px] font-medium">Perfil</span>
                </button>
              </div>
            </div>
          )}

          {appState === 'vet_ai' && (
            <BetaVetAIAssistant onBack={() => setAppState('dashboard')} />
          )}
          
        </div>
        
        {/* HOMESCREEN INDICATOR BAR */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 mix-blend-difference"></div>
      </div>

    </div>
  );
};
