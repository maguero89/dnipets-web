import React from 'react';
import { MessageSquare, Zap, Image as ImageIcon, X, Home, Instagram } from 'lucide-react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, isOpen, setIsOpen }) => {
  const navItems = [
    { mode: AppMode.Chat, icon: MessageSquare, label: 'Chat Veterinario' },
    { mode: AppMode.Image, icon: ImageIcon, label: 'Estudio Creativo' },
    { mode: AppMode.Live, icon: Zap, label: 'Consejero de Voz' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0d0f35] border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center space-x-1">
            <BrandPaw className="w-8 h-8" />
            <span className="font-[900] text-xl tracking-tight text-white">DNIPETS</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
           <button
              onClick={() => {
                setMode(AppMode.Landing);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-white/5 hover:text-slate-200 mb-4"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Inicio</span>
            </button>

          <div className="text-xs font-bold text-[#00d1c6]/50 uppercase tracking-[0.2em] px-4 mb-2 mt-6">
            Beta Prototipos
          </div>

          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => {
                setMode(item.mode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                currentMode === item.mode
                  ? 'bg-[#00d1c6] text-[#0d0f35] font-bold shadow-lg shadow-[#00d1c6]/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <a
            href="https://www.instagram.com/DniPets.ok"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-[#00d1c6] hover:bg-[#00d1c6]/10 mt-10"
          >
            <Instagram className="w-5 h-5" />
            <span className="font-bold">@DniPets.ok</span>
          </a>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5">
             <div className="text-[10px] font-black text-[#00d1c6] uppercase tracking-widest mb-1">Status: En Proceso</div>
             <div className="text-[11px] text-slate-500 italic font-medium leading-tight">"A la brevedad estaremos listos"</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;