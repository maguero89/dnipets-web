import React, { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { petService } from '../services/petService';

export const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await petService.addContactMessage({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                message: formData.message
            });
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || 'Error al enviar el mensaje');
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (status === 'success') {
        return (
            <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-[#00d1c6]/20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-[#00d1c6]/10 rounded-full flex items-center justify-center mx-auto text-[#00d1c6]">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-black text-[#0d0f35] tracking-tighter uppercase">¡Mensaje Enviado!</h3>
                    <p className="text-[#0d0f35]/60 font-medium leading-relaxed">
                        Gracias por contactarnos. Revisaremos tu petición o recomendación <br /> y nos pondremos en contacto contigo pronto.
                    </p>
                </div>
                <button
                    onClick={() => setStatus('idle')}
                    className="px-8 py-4 bg-[#0d0f35] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#00d1c6]/5 rounded-full blur-3xl group-hover:bg-[#00d1c6]/10 transition-colors duration-1000" />

            <div className="relative z-10 space-y-8">
                <div>
                    <h3 className="text-3xl font-black text-[#0d0f35] tracking-tighter uppercase">Cuéntanos tu idea</h3>
                    <p className="text-[#0d0f35]/50 text-xs font-bold uppercase tracking-widest mt-2">Peticiones, recomendaciones, dudas o solicitud de Beta</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#0d0f35]/40 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0d0f35]/30" />
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Juan Pérez"
                                className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-[#0d0f35] font-medium outline-none focus:border-[#00d1c6]/50 focus:bg-white transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#0d0f35]/40 uppercase tracking-widest ml-1">Email de Contacto</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0d0f35]/30" />
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="juan@ejemplo.com"
                                className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-[#0d0f35] font-medium outline-none focus:border-[#00d1c6]/50 focus:bg-white transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-[#0d0f35]/40 uppercase tracking-widest ml-1">Teléfono (Opcional)</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0d0f35]/30" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+54 9 11 1234 5678"
                                className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-[#0d0f35] font-medium outline-none focus:border-[#00d1c6]/50 focus:bg-white transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-[#0d0f35]/40 uppercase tracking-widest ml-1">Tu Mensaje</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-[#0d0f35]/30" />
                            <textarea
                                required
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="¿En qué podemos ayudarte? Nos encantaría escuchar tus sugerencias para mejorar DNIPETS..."
                                className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-[#0d0f35] font-medium outline-none focus:border-[#00d1c6]/50 focus:bg-white transition-all placeholder:text-slate-300 resize-none"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-2">
                        {status === 'error' && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4" />
                                {errorMessage}
                            </div>
                        )}

                        <button
                            disabled={status === 'submitting'}
                            type="submit"
                            className="w-full bg-[#0d0f35] hover:bg-[#1c183d] text-white font-black p-5 rounded-2xl shadow-xl shadow-[#0d0f35]/10 flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {status === 'submitting' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Enviar Mensaje
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
