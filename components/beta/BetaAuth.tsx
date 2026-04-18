import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { petService } from '../../services/petService';

interface BetaAuthProps {
  onLoginSuccess: () => void;
}

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

export const BetaAuth: React.FC<BetaAuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' && email !== confirmEmail) {
      alert("Los correos electrónicos no coinciden. Por favor, revísalos.");
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await petService.signInWithEmail(email, password);
        onLoginSuccess();
      } else {
        await petService.signUpWithEmail(email, password);
        onLoginSuccess();
      }
    } catch (error: any) {
      if (error.message === "CONFIRM_EMAIL_SENT") {
        alert("Cuenta creada con éxito. (Si no apagaste la confirmación en Supabase, te enviamos un enlace al correo).");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = () => {
    if (!email) return alert("Ingresa tu correo en el campo de arriba para poder enviarte el enlace.");
    petService.recoverPassword(email)
      .then(() => alert("El enlace de recuperación fue enviado a tu correo."))
      .catch(e => alert(e.message));
  };

  return (
    <div className="flex-1 bg-[#0d0f35] flex flex-col items-center justify-center px-6">
      
      {/* LOGO */}
      <div className="flex items-center justify-center gap-3 mb-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <BrandPaw className="w-14 h-14" />
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mt-2">DNIPETS</h1>
      </div>

      {/* LOGIN CARD */}
      <div className="bg-[#1c183d] w-full p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-500 delay-100 relative">
        {/* TABS */}
        <div className="flex justify-between mb-8 pb-2 border-b border-white/10 relative">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 text-center font-bold pb-2 transition-colors ${mode === 'login' ? 'text-[#00D1C6]' : 'text-slate-500'}`}
          >
            Ingresar
          </button>
          <button 
            onClick={() => setMode('register')}
            className={`flex-1 text-center font-bold pb-2 transition-colors ${mode === 'register' ? 'text-[#00D1C6]' : 'text-slate-500'}`}
          >
            Registrarse
          </button>
          {/* Active indicator */}
          <div className={`absolute bottom-0 h-0.5 bg-[#00D1C6] w-1/2 transition-transform duration-300 ${mode === 'login' ? 'translate-x-0' : 'translate-x-full'}`} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder={mode === 'register' ? "Ingresa tu Email" : "Email"}
              required
              className="w-full bg-[#e2e8f0] text-[#0d0f35] p-4 rounded-xl outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <input 
                type="email" 
                placeholder="Confirma tu Email" 
                required
                className="w-full bg-[#e2e8f0] text-[#0d0f35] p-4 rounded-xl outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                value={confirmEmail}
                onChange={e => setConfirmEmail(e.target.value)}
              />
            </div>
          )}

          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña" 
              required
              className="w-full bg-[#e2e8f0] text-[#0d0f35] p-4 pr-12 rounded-xl outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#0d0f35] focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                onClick={handleRecover}
                className="text-[10px] text-slate-400 hover:text-white transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#00D1C6] hover:bg-[#00b8ae] text-white font-bold p-4 rounded-xl mt-4 transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
          </button>
        </form>
      </div>

    </div>
  );
};
