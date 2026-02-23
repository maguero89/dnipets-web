import React from 'react';
import { ShieldCheck, AlertTriangle, User as UserIcon, MessageCircle } from 'lucide-react';
import { Pet, UserProfile } from '../types';
import { PawPrintBackground } from './PawPrintBackground';

interface Props {
    pet: Pet;
    owner: UserProfile;
}

export const PublicPetProfile: React.FC<Props> = ({ pet, owner }) => {
    const isLost = pet.status === 'lost';
    const isSafe = pet.status === 'safe';
    const phone = owner.phone ? owner.phone.replace(/[^0-9]/g, '') : '';
    const whatsappLink = phone ? `https://wa.me/${phone}?text=Hola, escaneé el código QR de ${pet.name} y quiero ayudar.` : null;

    if (isSafe) {
        return (
            <div className="min-h-screen bg-[#0d0f35] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-10"><PawPrintBackground /></div>
                <div className="w-full max-w-sm bg-[#1c183d] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative z-10 p-8 text-center space-y-6">
                    <div className="relative w-40 h-40 mx-auto">
                        <img src={pet.photoUrl} className="w-full h-full object-cover rounded-full border-4 border-[#00D1C6]/30 shadow-lg shadow-[#00D1C6]/20" alt={pet.name} />
                        <div className="absolute bottom-2 right-2 bg-[#00D1C6] text-[#0d0f35] p-2 rounded-full border-4 border-[#1c183d]"><ShieldCheck className="w-6 h-6" /></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-[900] text-white uppercase tracking-tight">{pet.name}</h1>
                        <p className="text-[#00D1C6] font-bold uppercase text-xs tracking-widest mt-1">{pet.breed}</p>
                    </div>
                    <div className="bg-[#2a2550] p-5 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[#00D1C6] font-black text-lg mb-1 uppercase tracking-tighter">¡Estoy seguro!</p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Actualmente estoy en casa y cuidado por mi dueño, <span className="font-bold text-white uppercase">{owner.firstName}</span>.
                        </p>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Identidad verificada por DNI-PETS</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0f35] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10"><PawPrintBackground /></div>
            <div className="w-full max-w-md bg-[#1c183d] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative z-10">
                <div className="relative h-80">
                    <img src={pet.photoUrl} className="w-full h-full object-cover" alt={pet.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c183d] via-transparent to-transparent" />
                    <div className="absolute top-6 right-6">
                        {isLost ? (
                            <span className="bg-red-500 text-white font-black px-6 py-2 rounded-full animate-pulse shadow-xl shadow-red-900/50 flex items-center gap-2 text-sm uppercase tracking-widest border-2 border-white/20">
                                <AlertTriangle className="w-4 h-4" /> PERDIDO
                            </span>
                        ) : (
                            <span className="bg-[#00D1C6] text-[#0d0f35] font-black px-6 py-2 rounded-full shadow-xl shadow-[#00D1C6]/20 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" /> EN ADOPCIÓN
                            </span>
                        )}
                    </div>
                    <div className="absolute bottom-6 left-8 right-8">
                        <h1 className="text-5xl font-[900] text-white uppercase tracking-tighter drop-shadow-2xl leading-none">{pet.name}</h1>
                        <p className="text-[#00D1C6] text-lg font-bold uppercase tracking-widest mt-2">{pet.breed} • {pet.sex}</p>
                    </div>
                </div>
                <div className="px-8 py-6">
                    {isLost ? (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 shadow-inner">
                            <h3 className="font-black text-red-500 text-xl mb-1 uppercase tracking-tighter italic">¡Ayúdame a volver!</h3>
                            <p className="text-sm text-red-300/80 font-medium">Estoy perdido. Por favor, contacta a mi familia urgentemente.</p>
                        </div>
                    ) : (
                        <div className="bg-[#00D1C6]/10 border border-[#00D1C6]/30 rounded-2xl p-5 shadow-inner">
                            <h3 className="font-black text-[#00D1C6] text-xl mb-1 uppercase tracking-tighter italic">¡Búscame un hogar!</h3>
                            <p className="text-sm text-[#00D1C6]/80 font-medium">Busco una familia que me quiera. Contáctanos para adoptarme.</p>
                        </div>
                    )}
                </div>
                <div className="px-8 pb-10 space-y-5">
                    <div className="bg-[#2a2550] p-5 rounded-2xl flex items-center gap-5 border border-white/5 shadow-inner">
                        <div className="w-14 h-14 rounded-2xl bg-[#1c183d] flex items-center justify-center shrink-0 border border-white/5">
                            <UserIcon className="text-[#00D1C6] w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#00D1C6] uppercase tracking-[0.2em] font-black opacity-60">Responsable</p>
                            <p className="text-xl font-black text-white uppercase tracking-tight">{owner.firstName || 'Usuario DNI-PETS'}</p>
                        </div>
                    </div>
                    {whatsappLink ? (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className={`group w-full py-5 font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl uppercase tracking-widest text-lg ${isLost
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20 text-white'
                                    : 'bg-[#00D1C6] hover:bg-[#00b8ae] shadow-[#00D1C6]/20 text-[#0d0f35]'
                                }`}
                        >
                            <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
                            {isLost ? 'Reportar Hallazgo' : 'Consultar'}
                        </a>
                    ) : (
                        <div className="text-center text-slate-500 text-xs font-black uppercase tracking-widest p-4 bg-[#2a2550] rounded-2xl border border-white/5">
                            Contacto privado
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
