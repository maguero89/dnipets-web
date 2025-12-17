import React from 'react';
import { Instagram, ExternalLink, Info, Clock, ShieldAlert } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const BrandPaw = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="20" cy="38" r="12" fill="#00D1C6"/>
    <circle cx="42" cy="22" r="12" fill="#00D1C6"/>
    <circle cx="68" cy="25" r="12" fill="#00D1C6"/>
    <circle cx="88" cy="45" r="12" fill="#00D1C6"/>
    <g>
        <path d="M28 62 C 28 62, 40 45, 55 45 C 70 45, 82 62, 82 62 C 82 62, 85 85, 55 92 C 25 85, 28 62, 28 62 Z" fill="#00D1C6"/>
        <path d="M40 65 Q 55 55 70 65" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M36 72 Q 55 60 74 72" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M42 80 Q 55 72 68 80" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M50 86 L 50 88" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
    </g>
  </svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const instagramUrl = "https://www.instagram.com/DniPets.ok";

  return (
    <div className="min-h-screen bg-[#0d0f35] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full flex flex-col items-center gap-10">
        
        {/* Official Logo Section */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
            <div className="flex items-center gap-1">
                <BrandPaw className="w-20 h-20" />
                <h1 className="text-5xl font-[900] tracking-[-0.05em] text-white">DNIPETS</h1>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="px-3 py-1 bg-[#00d1c6]/10 border border-[#00d1c6]/20 rounded-full">
                    <span className="text-[#00d1c6] text-[10px] uppercase font-bold tracking-widest">Versión Beta</span>
                </div>
                <p className="text-[#00d1c6] text-[11px] font-medium tracking-wide flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Aplicación en desarrollo
                </p>
            </div>
        </div>

        {/* Welcome Box (Darker Purple Surface) */}
        <div className="w-full bg-[#1c183d] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d1c6]/5 blur-3xl rounded-full" />
          
          <div className="flex flex-col items-center gap-6 relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">¡Bienvenido!</h2>
            
            <div className="w-full space-y-4">
              <div className="p-4 bg-[#2a2550] rounded-2xl border border-white/5 flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#00d1c6] shrink-0 mt-1" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  Estamos trabajando en el desarrollo de la plataforma. <span className="font-semibold text-white italic">"En la brevedad estaremos listos"</span>.
                </p>
              </div>

              <div className="p-4 bg-[#2a2550] rounded-2xl border border-white/5 flex items-start gap-3">
                <MessageCircleIcon className="w-5 h-5 text-[#00d1c6] shrink-0 mt-1" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  Puedes escribirnos para hacernos consultas, ver avances o solicitar acceso a la prueba.
                </p>
              </div>
            </div>

            <a 
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black py-4 rounded-2xl text-center transition-all shadow-lg shadow-[#00d1c6]/20 flex items-center justify-center gap-2"
            >
              <Instagram className="w-5 h-5 transition-transform group-hover:scale-110" />
              Ingresar / Consultar
            </a>

            <p className="text-[#00d1c6] text-xs font-black tracking-widest uppercase opacity-80">
              @DniPets.ok
            </p>
          </div>
        </div>

        {/* Access Button (Secondary) */}
        <button 
          onClick={onEnterApp}
          className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-50 hover:opacity-100"
        >
          Explorar prototipo preliminar <ExternalLink className="w-3 h-3" />
        </button>

        {/* Footer */}
        <footer className="mt-4 text-center">
            <p className="text-slate-700 text-[9px] uppercase tracking-[0.2em] font-black">
                DNIPETS Digital Identity &copy; 2024
            </p>
        </footer>
      </div>
    </div>
  );
};

const MessageCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
);

export default LandingPage;