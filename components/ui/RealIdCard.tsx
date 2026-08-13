import React from 'react';
import { Maximize2 } from 'lucide-react';
import { Pet } from '../../types';
import { DniPetsLogo } from './DniPetsLogo';
import { PawPrintBackground } from '../PawPrintBackground';

export const RealIdCard = ({ pet, onQrClick }: { pet: Pet, onQrClick?: () => void }) => {
    const isLost = pet.status === 'lost';
    const isAdoption = pet.status === 'adoption';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dnipets.com';
    const qrData = `${origin}/?p=${pet.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    return (
        <div className={`relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 bg-white ${isLost ? 'ring-4 ring-red-600' : isAdoption ? 'ring-4 ring-purple-500' : 'ring-1 ring-gray-200'}`}>
            <div className="absolute inset-0 bg-white z-0">
                {pet.photoUrl && (
                    <img src={pet.photoUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm scale-110" alt="" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/40" />
                <div className="absolute right-[-15%] bottom-[-15%] w-[60%] opacity-[0.08] rotate-12 pointer-events-none">
                    <DniPetsLogo className="w-full h-full" />
                </div>
                <PawPrintBackground />
            </div>
            <div className="relative p-4 h-full flex flex-row gap-3 z-10">
                <div className="w-[32%] h-full flex flex-col justify-center">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-white shadow-md bg-gray-100">
                        {pet.photoUrl ? (
                            <img src={pet.photoUrl} className="w-full h-full object-cover" alt={pet.name} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold text-xs">
                                Sin foto
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-[68%] flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start pr-1">
                            <div>
                                <h2 className="text-lg font-black text-brand-navy leading-none tracking-tight mb-0.5">{pet.name.toUpperCase()}</h2>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[8px] font-bold text-white bg-primary px-1 rounded-sm uppercase tracking-wider">ID ANIMAL</span>
                                    {isLost && <span className="text-[8px] font-bold text-white bg-red-600 px-1 rounded-sm uppercase tracking-wider animate-pulse">PERDIDO</span>}
                                    {isAdoption && <span className="text-[8px] font-bold text-white bg-purple-600 px-1 rounded-sm uppercase tracking-wider">EN ADOPCIÓN</span>}
                                </div>
                            </div>
                            <button onClick={onQrClick} className="w-10 h-10 bg-white p-0.5 rounded shadow-sm border border-gray-100 relative group cursor-pointer active:scale-95 transition-transform flex-shrink-0">
                                <img src={qrUrl} className="w-full h-full" alt="QR Code" />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                    <Maximize2 size={16} className="text-white drop-shadow-md" />
                                </div>
                            </button>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-y-1 gap-x-2">
                            <div>
                                <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">Especie</p>
                                <p className="text-[10px] font-bold text-brand-navy leading-tight">{pet.species === 'dog' ? 'CANINA' : pet.species === 'cat' ? 'FELINA' : 'MASCOTA'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">Raza</p>
                                <p className="text-[10px] font-bold text-brand-navy truncate leading-tight">{pet.breed}</p>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">Sexo</p>
                                <p className="text-[10px] font-bold text-brand-navy leading-tight">{pet.sex === 'Macho' ? 'M' : 'H'}</p>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">Peso</p>
                                <p className="text-[10px] font-bold text-brand-navy leading-tight">{pet.weight} kg</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">Fecha Nacimiento</p>
                                <p className="text-[10px] font-bold text-brand-navy leading-tight">{pet.birthDate || 'No registrada'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-1 opacity-80">
                            <DniPetsLogo className="w-4 h-4" />
                            <span className="text-[8px] font-bold text-brand-navy tracking-widest">DNIPETS</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1.5 ${isLost ? 'bg-red-600' : isAdoption ? 'bg-purple-600' : 'bg-brand-navy'}`} />
        </div>
    );
};
