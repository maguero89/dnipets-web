import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { HealthRecord, RecordType } from '../../types';

export const RecordModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    type, 
    initialRecord 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSave: (r: Partial<HealthRecord>) => void; 
    type: RecordType; 
    initialRecord?: HealthRecord 
}) => {
    const [record, setRecord] = useState<Partial<HealthRecord>>({ type });

    useEffect(() => {
        if (isOpen) {
            if (initialRecord) setRecord(initialRecord);
            else setRecord({ type, date: new Date().toISOString().split('T')[0] });
        }
    }, [isOpen, initialRecord, type]);

    if (!isOpen) return null;

    const titles: Record<RecordType, string> = { vaccine: 'Vacuna', vet_visit: 'Visita Veterinario', certificate: 'Documento' };
    const modalTitle = initialRecord ? `Editar ${titles[type]}` : `Nueva ${titles[type]}`;

    return (
        <div className="fixed inset-0 bg-brand-navy/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-brand-navy">{modalTitle}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                            {type === 'vaccine' ? 'Nombre de Vacuna' : type === 'vet_visit' ? 'Motivo de Consulta' : 'Título del Documento'}
                        </label>
                        <input 
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium text-brand-navy text-sm focus:outline-none focus:border-primary" 
                            placeholder={type === 'vaccine' ? 'Ej: Antirrábica, Quintuple' : type === 'vet_visit' ? 'Ej: Control anual, Desparasitación' : 'Ej: Certificado de Salud'}
                            value={record.title || ''} 
                            onChange={e => setRecord({ ...record, title: e.target.value })} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Fecha</label>
                            <input 
                                type="date" 
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-medium text-brand-navy focus:outline-none focus:border-primary" 
                                value={record.date || ''} 
                                onChange={e => setRecord({ ...record, date: e.target.value })} 
                            />
                        </div>
                        {type === 'vaccine' && (
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Vencimiento</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-medium text-brand-navy focus:outline-none focus:border-primary" 
                                    value={record.nextDueDate || ''} 
                                    onChange={e => setRecord({ ...record, nextDueDate: e.target.value })} 
                                />
                            </div>
                        )}
                    </div>

                    {type === 'vet_visit' && (
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Veterinario / Clínica</label>
                            <input 
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium text-brand-navy text-sm focus:outline-none focus:border-primary" 
                                placeholder="Ej: Dr. Pérez / Veterinaria San Francisco"
                                value={record.veterinarian || ''} 
                                onChange={e => setRecord({ ...record, veterinarian: e.target.value })} 
                            />
                        </div>
                    )}

                    <button 
                        onClick={() => { 
                            if (record.title && record.date) onSave(record); 
                            else alert("Por favor completa el título y la fecha.");
                        }} 
                        className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg mt-2 transition-transform active:scale-95 text-sm uppercase tracking-wider"
                    >
                        {initialRecord ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
