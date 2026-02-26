import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Calendar, User, Phone, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { petService } from '../services/petService';
import { ContactMessage } from '../types';

export const AdminMessages: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        const data = await petService.getContactMessages();
        setMessages(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) return;

        // Guardamos el estado anterior por si falla la eliminación
        const previousMessages = [...messages];

        // Actualización optimista: lo quitamos de la lista inmediatamente
        setMessages(messages.filter(m => m.id !== id));
        if (expandedId === id) setExpandedId(null);

        try {
            await petService.deleteContactMessage(id);
            // No hace falta llamar a fetchMessages() si fue exitoso, ya lo quitamos optimísticamente
        } catch (err) {
            console.error('Error al eliminar mensaje:', err);
            alert('No se pudo eliminar el mensaje. Por favor, verifica que hayas aplicado los permisos SQL en Supabase.');
            // Revertimos el cambio si falla
            setMessages(previousMessages);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-[#1c183d] rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
            <div className="bg-[#2a2550] p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-black text-[#00d1c6] uppercase tracking-widest">Mensajes Recibidos</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sugerencias y peticiones de usuarios</p>
                </div>
                <div className="bg-[#1c183d] px-3 py-1 rounded-full border border-white/5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{messages.length} Total</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="w-8 h-8 border-2 border-[#00d1c6]/30 border-t-[#00d1c6] rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="p-20 text-center space-y-4 opacity-50">
                        <div className="w-16 h-16 bg-[#2a2550] rounded-full flex items-center justify-center mx-auto border border-white/5">
                            <Mail size={24} className="text-slate-500" />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">No hay mensajes nuevos</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`transition-all duration-300 ${expandedId === msg.id ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}>
                                <div
                                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                                    className="p-6 cursor-pointer flex items-center justify-between gap-4"
                                >
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-white uppercase tracking-tight truncate">{msg.name}</span>
                                            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap hidden sm:inline">({msg.email})</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#00d1c6]/50" /> {formatDate(msg.created_at)}</span>
                                            {msg.phone && <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#00d1c6]/50" /> {msg.phone}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                            className="p-2.5 bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-white/5"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="p-2.5 text-slate-600">
                                            {expandedId === msg.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>
                                </div>

                                {expandedId === msg.id && (
                                    <div className="px-6 pb-8 animate-in slide-in-from-top-2 duration-300">
                                        <div className="bg-[#2a2550]/50 rounded-2xl p-6 border border-white/5">
                                            <div className="flex items-start gap-3">
                                                <MessageSquare size={16} className="text-[#00d1c6] shrink-0 mt-1" />
                                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.message}</p>
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Nombre</p>
                                                    <p className="text-xs text-white font-bold">{msg.name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Email</p>
                                                    <a href={`mailto:${msg.email}`} className="text-xs text-[#00d1c6] font-bold hover:underline">{msg.email}</a>
                                                </div>
                                                {msg.phone && (
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Teléfono</p>
                                                        <a href={`tel:${msg.phone}`} className="text-xs text-slate-300 font-bold hover:text-white transition-colors">{msg.phone}</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
