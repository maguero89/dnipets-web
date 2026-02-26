import React from 'react';
import {
  Instagram,
  ShieldAlert,
  Heart,
  MapPin,
  QrCode,
  Bot,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  Search,
  ShieldCheck,
  Navigation,
  ScanLine,
  Users,
  MessageCircle
} from 'lucide-react';

import { ContactForm } from './ContactForm';

const BrandPaw = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="20" cy="38" r="12" fill="#00D1C6" />
    <circle cx="42" cy="22" r="12" fill="#00D1C6" />
    <circle cx="68" cy="25" r="12" fill="#00D1C6" />
    <circle cx="88" cy="45" r="12" fill="#00D1C6" />
    <g>
      <path d="M28 62 C 28 62, 40 45, 55 45 C 70 45, 82 62, 82 62 C 82 62, 85 85, 55 92 C 25 85, 28 62, 28 62 Z" fill="#00D1C6" />
      <path d="M40 65 Q 55 55 70 65" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M36 72 Q 55 60 74 72" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M42 80 Q 55 72 68 80" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M50 86 L 50 88" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
    </g>
  </svg>
);

interface LandingPageProps {
  onAdminLogin?: () => void;
  onLogout?: () => void;
  user?: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAdminLogin, onLogout, user }) => {
  const instagramUrl = "https://www.instagram.com/DniPets.ok";

  // Rutas relativas a la carpeta public
  const mockupDashboard = "/mockups/home.png";
  const mockupProfile = "/mockups/profile.png";
  const mockupMap = "/mockups/map.png";
  const mockupAdoption = "/mockups/adoption.png";
  const mockupLostPublic = "/mockups/lost_public.png";
  const mockupLostOwner = "/mockups/lost_owner.png";

  const handleCTA = () => window.open(instagramUrl, '_blank');

  const handleLogoutClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen bg-white text-[#0d0f35] font-sans selection:bg-[#00d1c6] selection:text-[#0d0f35] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-6 gap-20 p-10 rotate-12">
          {[...Array(24)].map((_, i) => <BrandPaw key={i} className="w-16 h-16 text-[#0d0f35]" />)}
        </div>
      </div>

      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-[#0d0f35]/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bg-[#0d0f35] p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-[#0d0f35]/20">
            <BrandPaw className="w-6 h-6 text-[#00d1c6]" />
          </div>
          <span className="text-xl font-black tracking-tighter text-[#0d0f35]">DNIPETS</span>
        </div>
        <div className="flex items-center gap-6">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0d0f35]/60 hover:text-[#0d0f35] transition-colors">
            <Instagram className="w-4 h-4" /> Instagram
          </a>
          {!user && (
            <button
              onClick={handleCTA}
              className="bg-[#0d0f35] text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-[#0d0f35]/20 hover:scale-105 active:scale-95 transition-all"
            >
              Contacto
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 pt-32">
        {/* EMOTIONAL HERO SECTION */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00d1c6]/10 rounded-full text-[#0d0f35] text-xs font-bold border border-[#00d1c6]/20 shadow-sm">
                <Heart className="w-3 h-3 text-[#00d1c6] fill-[#00d1c6]" />
                SU BIENESTAR ES TU TRANQUILIDAD
              </div>
              <h1 className="text-4xl lg:text-5xl font-black leading-[0.9] tracking-tighter text-[#0d0f35]">
                Porque son <br />
                <span className="text-[#00d1c6]">
                  más que familia
                </span>
              </h1>
              <p className="text-base text-[#0d0f35]/70 max-w-xl leading-relaxed font-medium">
                Hoy en día, el cuidado de nuestras mascotas es una prioridad emocional. DNIPETS nace para digitalizar su mundo: desde su identidad hasta su historial médico, asegurando que siempre estén protegidos y conectados contigo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCTA}
                  className="flex-1 sm:flex-none px-8 py-5 bg-[#0d0f35] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-2xl shadow-[#0d0f35]/30 hover:-translate-y-1 transition-all group"
                >
                  Conoce el Proyecto
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#00d1c6]" />
                </button>
              </div>
            </div>

            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1c6]/20 to-transparent rounded-[3rem] blur-3xl opacity-50 transition-opacity" />
              <div className="relative bg-white p-4 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(13,15,53,0.15)] border-8 border-white overflow-hidden">
                <img
                  src={mockupDashboard}
                  alt="DNIPETS Ecosistema Digital"
                  className="rounded-[2rem] w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* RECENT INFO SECTION - USES */}
        <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#00d1c6]">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0d0f35]">Identidad Inteligente</h3>
              <p className="text-[#0d0f35]/60 leading-relaxed">DNI digital centralizado con toda la información clave, accesible mediante un escaneo seguro del collar.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#00d1c6]">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0d0f35]">Mapa Informativo</h3>
              <p className="text-[#0d0f35]/60 leading-relaxed">Visualiza en tiempo real mascotas extraviadas en tu zona y servicios esenciales cercanos.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#00d1c6]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0d0f35]">Adopción Directa</h3>
              <p className="text-[#0d0f35]/60 leading-relaxed">Conectamos de forma transparente a familias con mascotas que buscan un hogar responsable.</p>
            </div>
          </div>
        </section>

        {/* LOST MODE: FINDER TO OWNER CONNECTION */}
        <section className="py-32 relative overflow-hidden bg-[#0d0f35]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-red-500/10 rounded-full border border-red-500/20 text-red-500 text-sm font-black tracking-wider uppercase">
                <ShieldAlert className="w-4 h-4" />
                SEGURIDAD ANTE EXTRAVÍOS
              </div>
              <h2 className="text-2xl lg:text-4xl font-black text-white leading-[0.9] tracking-tighter">
                La conexión <br />
                <span className="text-[#00d1c6]">que salva vidas.</span>
              </h2>
              <p className="text-base text-white/60 leading-relaxed">
                Sabemos la angustia que genera la pérdida de un compañero. Por eso, DNIPETS facilita el vínculo inmediato: quien encuentra a tu mascota puede escanear su placa y contactarte al instante por WhatsApp o llamada, sin procesos complicados.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[#00d1c6] p-1 rounded-full text-[#0d0f35]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Contacto One-Touch</h4>
                    <p className="text-white/40 text-sm">El buscador solo tiene que tocar un botón para avisarte.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[#00d1c6] p-1 rounded-full text-[#0d0f35]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Ubicación Compartida</h4>
                    <p className="text-white/40 text-sm">Recibe el punto exacto donde se realizó el escaneo.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src={mockupLostPublic} alt="Vista Pública" className="rounded-[2rem] border-4 border-white/5 shadow-2xl" />
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-[10px] text-[#00d1c6] font-black tracking-widest uppercase">Vista del Escaneo</p>
                </div>
              </div>
              <div className="space-y-4 pt-10">
                <img src={mockupLostOwner} alt="Panel Dueño" className="rounded-[2rem] border-4 border-white/5 shadow-2xl" />
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-[10px] text-[#00d1c6] font-black tracking-widest uppercase">Panel del Dueño</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAP & ADOPTION INFORMATION */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-32">
            {/* Map Section */}
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 order-2 lg:order-1">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-[#00d1c6]/10 rounded-[3rem] blur-[60px] opacity-50" />
                  <div className="relative bg-[#0d0f35] p-2 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white">
                    <img src={mockupMap} alt="Mapa DNIPETS" className="w-full opacity-90 saturate-50 hover:saturate-100 transition-all duration-700" />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-8 order-1 lg:order-2">
                <div className="w-12 h-12 bg-[#0d0f35] rounded-xl flex items-center justify-center text-[#00d1c6]">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-[#0d0f35] tracking-tighter leading-none">
                  Tu zona, <br />
                  <span className="text-[#00d1c6]">siempre informada.</span>
                </h2>
                <p className="text-base text-[#0d0f35]/60 leading-relaxed font-medium">
                  El mapa interactivo de DNIPETS no solo sirve para emergencias. Es una herramienta comunitaria para ver alertas de extravío recientes y perfiles de mascotas que buscan hogar cerca de ti.
                </p>
              </div>
            </div>

            {/* Adoption Section */}
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-8">
                <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-[#0d0f35] tracking-tighter leading-none">
                  Conecta y <br />
                  <span className="text-[#6366f1]">da una oportunidad.</span>
                </h2>
                <p className="text-base text-[#0d0f35]/60 leading-relaxed font-medium">
                  Facilitamos el contacto directo entre dueños responsables y familias interesadas. Sin intermediarios complejos, solo personas conectando con un fin común: el amor por los animales.
                </p>
              </div>
              <div className="flex-1">
                <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-[60px]" />
                  <div className="relative bg-white p-3 rounded-[3rem] shadow-2xl border-4 border-slate-50">
                    <img src={mockupAdoption} alt="Adopción Responsable" className="rounded-[2rem] w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT & SUGGESTIONS SECTION */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white to-slate-50 pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <ContactForm />
          </div>
        </section>

      </main>

      <footer className="bg-[#0d0f35] py-20 px-6 text-white border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <BrandPaw className="w-10 h-10 text-[#00d1c6]" />
              <span className="text-xl font-black tracking-tighter uppercase">DNIPETS</span>
            </div>
            <p className="text-white/40 max-w-sm font-medium leading-relaxed text-xs">
              Tecnología y corazón al servicio de los que no tienen voz. Porque ellos también merecen una identidad segura.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-[#00d1c6] uppercase tracking-widest text-sm">Explora</h4>
            <ul className="space-y-4 text-white/60 font-medium text-sm">
              <li className="hover:text-[#00d1c6] cursor-pointer transition-colors" onClick={handleCTA}>Historial Salud</li>
              <li className="hover:text-[#00d1c6] cursor-pointer transition-colors" onClick={handleCTA}>Modo Perdido</li>
              <li className="hover:text-[#00d1c6] cursor-pointer transition-colors" onClick={handleCTA}>Adopción</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-[#00d1c6] uppercase tracking-widest text-sm">Redes</h4>
            <ul className="text-white/60 font-bold uppercase tracking-widest text-xs">
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00d1c6] flex items-center gap-2 transition-colors">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex justify-between items-center">
          <p className="text-white/10 text-[10px] font-black tracking-widest uppercase">
            &copy; {new Date().getFullYear()} DNIPETS.
          </p>
          {!user ? (
            <button
              onClick={onAdminLogin}
              className="text-white/[0.02] hover:text-[#00d1c6]/20 transition-colors text-[8px] font-bold uppercase tracking-[0.5em] select-none"
            >
              STAFF
            </button>
          ) : (
            <button onClick={handleLogoutClick} className="text-red-500/20 hover:text-red-500 transition-colors text-[8px] font-bold uppercase tracking-widest">SALIR</button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;