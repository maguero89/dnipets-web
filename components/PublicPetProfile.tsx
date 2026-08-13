import React, { useEffect, useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Heart, CheckCircle, Lock, Syringe, AlertTriangle, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Pet, UserProfile, HealthRecord } from '../types';
import { DniPetsLogo } from './ui/DniPetsLogo';
import { RealIdCard } from './ui/RealIdCard';
import { petService } from '../services/petService';

export const PublicPetProfile = ({ pet, owner, onClose, isExternal = false }: { pet: Pet, owner: UserProfile, onClose?: () => void, isExternal?: boolean }) => {
    const isLost = pet.status === 'lost';
    const isAdoption = pet.status === 'adoption';

    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
    const [loadingHealth, setLoadingHealth] = useState(true);

    useEffect(() => {
        petService.getHealthRecords(pet.id)
            .then(records => {
                setHealthRecords(records || []);
                setLoadingHealth(false);
            })
            .catch(() => setLoadingHealth(false));
    }, [pet.id]);

    const handleWhatsApp = () => {
        if (!owner.phone) return;
        const cleanPhone = owner.phone.replace(/[^0-9]/g, '');
        const message = isLost
            ? `¡Hola! Acabo de escanear el QR de ${pet.name} y parece que se ha perdido. Lo tengo conmigo.`
            : `¡Hola! Estoy interesado en adoptar a ${pet.name}. Lo vi en DNIPETS.`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleBack = () => {
        if (onClose) onClose();
        else window.location.href = '/';
    };

    // LÓGICA DE ESTADO DE VACUNAS
    const vaccineRecords = healthRecords.filter(r => r.type === 'vaccine' || r.title.toLowerCase().includes('vacuna'));
    
    let vaccineStatus: 'no_records' | 'expired' | 'expiring_soon' | 'up_to_date' = 'no_records';
    let vaccineTitle = 'Sin vacunas cargadas';
    let vaccineDesc = 'Esta mascota no tiene vacunas registradas en su DNI digital.';
    let vaccineStyle = 'bg-slate-50 border-slate-200 text-slate-700';
    let VaccineIcon = Syringe;
    let iconColor = 'text-slate-400';

    if (vaccineRecords.length > 0) {
        const today = new Date();
        let hasExpired = false;
        let hasExpiringSoon = false;

        for (const v of vaccineRecords) {
            if (v.nextDueDate) {
                const due = new Date(v.nextDueDate);
                const diffTime = due.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 0) hasExpired = true;
                else if (diffDays <= 30) hasExpiringSoon = true;
            } else if (v.date) {
                const done = new Date(v.date);
                const diffTime = today.getTime() - done.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 365) hasExpired = true;
            }
        }

        if (hasExpired) {
            vaccineStatus = 'expired';
            vaccineTitle = 'Vacunas vencidas';
            vaccineDesc = 'Presenta registros de vacunación con fecha de vencimiento cumplida.';
            vaccineStyle = 'bg-red-50 border-red-200 text-red-900';
            VaccineIcon = AlertTriangle;
            iconColor = 'text-red-600';
        } else if (hasExpiringSoon) {
            vaccineStatus = 'expiring_soon';
            vaccineTitle = 'Vacunas próximas a vencer';
            vaccineDesc = 'Tiene vacunas con vencimiento en los próximos 30 días.';
            vaccineStyle = 'bg-amber-50 border-amber-200 text-amber-900';
            VaccineIcon = AlertCircle;
            iconColor = 'text-amber-600';
        } else {
            vaccineStatus = 'up_to_date';
            vaccineTitle = 'Vacunas al día';
            vaccineDesc = 'Carnet de vacunación al día y registrado correctamente.';
            vaccineStyle = 'bg-emerald-50 border-emerald-200 text-emerald-900';
            VaccineIcon = CheckCircle2;
            iconColor = 'text-emerald-600';
        }
    }

    const renderVaccineBadge = () => (
        <div className={`p-4 rounded-2xl border ${vaccineStyle} flex items-start gap-3 text-left transition-all shadow-sm my-4`}>
            <div className={`p-2 rounded-xl bg-white/80 shrink-0 ${iconColor} shadow-xs mt-0.5`}>
                {loadingHealth ? <Loader2 className="animate-spin" size={20} /> : <VaccineIcon size={20} />}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estado de Vacunación</p>
                <h4 className="font-black text-sm tracking-tight">{loadingHealth ? 'Verificando vacunas...' : vaccineTitle}</h4>
                <p className="text-xs opacity-80 mt-0.5 leading-snug">{loadingHealth ? 'Cargando registros médicos de la mascota...' : vaccineDesc}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <div className="bg-brand-navy pt-12 pb-4 px-4 text-center sticky top-0 z-20 shadow-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <DniPetsLogo className="w-8 h-8" />
                    <span className="text-white font-black tracking-tighter text-xl">DNIPETS</span>
                </div>
                <button onClick={handleBack} className="text-white/80 text-xs font-bold border border-white/30 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={14} /> Volver
                </button>
            </div>
            <div className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
                {isLost ? (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl mb-6 border-4 border-red-600 animate-slide-up">
                        <div className="bg-red-600 p-4 text-center">
                            <h1 className="text-3xl font-black text-white tracking-widest uppercase">¡SE BUSCA!</h1>
                            <p className="text-white/90 text-sm font-bold uppercase mt-1">Ayúdanos a encontrarlo</p>
                        </div>
                        <div className="aspect-square relative bg-gray-100">
                            {pet.photoUrl && <img src={pet.photoUrl} className="w-full h-full object-cover" alt={pet.name} />}
                        </div>
                        <div className="p-6 text-center">
                            <h2 className="text-4xl font-black text-brand-navy mb-2 uppercase tracking-tight">{pet.name}</h2>
                            <div className="flex justify-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 uppercase">{pet.breed}</span>
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 uppercase">{pet.sex}</span>
                            </div>

                            {/* ESTADO DE VACUNAS EN PERDIDO */}
                            {renderVaccineBadge()}

                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-6">
                                <p className="text-red-800 font-bold text-sm uppercase tracking-wider mb-2">Información del Propietario</p>
                                <h3 className="text-xl font-black text-brand-navy mb-1">{owner.firstName} {owner.lastName || ''}</h3>
                                <p className="text-lg font-bold text-red-600 flex items-center justify-center gap-2 mb-4">
                                    <Phone size={18} /> {owner.phone || 'Teléfono no disponible'}
                                </p>
                                <button onClick={handleWhatsApp} disabled={!owner.phone} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg transition-transform active:scale-95 disabled:opacity-50">
                                    <MessageCircle size={24} /> Contactar por WhatsApp
                                </button>
                            </div>

                            {owner.address && (owner.address.street || owner.address.city) && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                                    <p className="text-gray-500 font-bold text-xs uppercase mb-1">📍 Zona habitual</p>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {owner.address.street} {owner.address.number}, {owner.address.city}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : isAdoption ? (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl mb-6 border-4 border-purple-500 animate-slide-up">
                        <div className="bg-purple-600 p-4 text-center">
                            <h1 className="text-2xl font-black text-white tracking-wide uppercase">¡BUSCO UN HOGAR!</h1>
                            <p className="text-white/90 text-sm font-bold uppercase mt-1">Adopción Responsable</p>
                        </div>
                        <div className="aspect-square relative bg-gray-100">
                            {pet.photoUrl && <img src={pet.photoUrl} className="w-full h-full object-cover" alt={pet.name} />}
                            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
                                <Heart className="text-purple-600 fill-purple-600 animate-pulse" size={32} />
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <h2 className="text-4xl font-black text-brand-navy mb-2 uppercase tracking-tight">{pet.name}</h2>
                            <p className="text-gray-500 italic mb-4">"{pet.notes || 'Soy muy cariñoso y busco una familia que me quiera mucho.'}"</p>

                            {/* ESTADO DE VACUNAS EN ADOPCIÓN */}
                            {renderVaccineBadge()}

                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-6">
                                <p className="text-purple-800 font-bold text-sm uppercase tracking-wider mb-2">Contacto para Adopción</p>
                                <h3 className="text-xl font-black text-brand-navy mb-1">{owner.firstName} {owner.lastName || ''}</h3>
                                <p className="text-lg font-bold text-purple-600 flex items-center justify-center gap-2 mb-4">
                                    <Phone size={18} /> {owner.phone || 'Teléfono no disponible'}
                                </p>
                                <button onClick={handleWhatsApp} disabled={!owner.phone} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg transition-transform active:scale-95 disabled:opacity-50">
                                    <MessageCircle size={24} /> Contactar por WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-slide-up">
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-center text-sm font-bold shadow-sm flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Identidad Verificada
                        </div>
                        <RealIdCard pet={pet} />

                        {/* ESTADO DE VACUNAS EN VISTA PÚBLICA SEGURO */}
                        {renderVaccineBadge()}

                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
                            <Lock size={48} className="mx-auto text-primary/20 mb-4" />
                            <h3 className="text-lg font-bold text-brand-navy">Perfil Privado Protegido</h3>
                            <p className="text-gray-500 text-sm mt-2">La información de contacto del propietario está protegida por seguridad mientras la mascota esté marcada como segura.</p>
                        </div>
                    </div>
                )}
            </div>
            {isExternal && (
                <div className="p-6 text-center">
                    <button onClick={handleBack} className="text-primary font-bold hover:underline">Ir a la App DNIPETS</button>
                </div>
            )}
            <div className="p-4 text-center text-gray-400 text-xs">DNIPETS © 2026 - Sistema de Identidad Animal</div>
        </div>
    );
};
