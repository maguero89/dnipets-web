import React from 'react';
import { Heart, Info, ArrowLeft } from 'lucide-react';
import { PawPrintBackground } from '../PawPrintBackground';

interface BetaAdoptionViewProps {
  onGoHome?: () => void;
}

export const BetaAdoptionView: React.FC<BetaAdoptionViewProps> = ({ onGoHome }) => {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col relative animate-in fade-in duration-300 font-sans overflow-hidden">
      <PawPrintBackground />

      <div className="p-6 pb-24 h-full flex flex-col justify-between relative z-10 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-black text-brand-navy mb-1 tracking-tight">Centro de Adopción</h2>
          <p className="text-gray-500 text-xs mb-6 font-medium">Encuentra a tu próximo compañero</p>

          {/* AVISO BETA DE FUNCIÓN NO ACTIVA */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 shadow-sm text-purple-900 space-y-3 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-md">
                <Info size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Prueba Beta
                </span>
                <h3 className="font-black text-base text-purple-950 mt-0.5">Módulo en Desarrollo</h3>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-purple-800 font-medium">
              Esta sección aún no se encuentra activa en la prueba BETA. En la versión oficial podrás publicar mascotas en adopción responsable y contactar directamente con nuevos hogares.
            </p>
          </div>
        </div>

        {/* CONTENIDO ILUSTRATIVO DE PROXIMAMENTE */}
        <div className="flex flex-col items-center justify-center text-center my-8 space-y-4">
          <div className="w-20 h-20 bg-purple-100/80 rounded-full flex items-center justify-center border-4 border-purple-200 shadow-inner">
            <Heart size={40} className="text-purple-600 fill-purple-500 animate-pulse" />
          </div>
          <div className="space-y-1 max-w-xs">
            <h4 className="font-bold text-brand-navy text-lg">¡Próximamente!</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Estamos trabajando para que la experiencia de adopción sea segura, transparente y directa.
            </p>
          </div>
        </div>

        {onGoHome && (
          <button 
            onClick={onGoHome}
            className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </button>
        )}
      </div>
    </div>
  );
};
