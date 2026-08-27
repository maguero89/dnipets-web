import React, { useState, useEffect } from 'react';
import { Store, Navigation, XCircle } from 'lucide-react';
import { supabase } from '../services/petService';

interface Props {
    onComercioGuardado: () => void;
    comercioAEditar: any | null;
    onCancelarEdicion: () => void;
}

export const FormularioComercio: React.FC<Props> = ({
    onComercioGuardado,
    comercioAEditar,
    onCancelarEdicion
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        rubro: 'veterinaria',
        direccion: '',
        lat: '',
        lng: '',
        telefono: '',
        resena: ''
    });

    useEffect(() => {
        if (comercioAEditar) {
            setFormData({
                nombre: comercioAEditar.nombre || '',
                rubro: comercioAEditar.rubro || 'veterinaria',
                direccion: comercioAEditar.direccion || '',
                lat: comercioAEditar.lat?.toString() || '',
                lng: comercioAEditar.lng?.toString() || '',
                telefono: comercioAEditar.telefono || '',
                resena: comercioAEditar.resena || ''
            });
        } else {
            setFormData({ nombre: '', rubro: 'veterinaria', direccion: '', lat: '', lng: '', telefono: '', resena: '' });
        }
    }, [comercioAEditar]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nombre: formData.nombre,
            rubro: formData.rubro,
            direccion: formData.direccion,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            telefono: formData.telefono,
            resena: formData.resena
        };

        if (comercioAEditar) {
            const { data, error } = await supabase
                .from('comercios')
                .update(payload)
                .eq('id', comercioAEditar.id)
                .select();

            if (error) {
                alert("Error al actualizar: " + error.message);
            } else if (!data || data.length === 0) {
                alert("⚠️ Atención: No se pudo actualizar el comercio en Supabase. Recuerda ejecutar la política RLS de UPDATE en tu consola de Supabase.");
            } else {
                alert("Comercio actualizado correctamente");
                onCancelarEdicion();
                onComercioGuardado();
            }
        } else {
            const { data, error } = await supabase
                .from('comercios')
                .insert([payload])
                .select();

            if (error) {
                alert("Error al guardar: " + error.message);
            } else if (!data || data.length === 0) {
                alert("⚠️ Atención: No se pudo guardar el comercio. Verifica las políticas RLS en Supabase.");
            } else {
                alert("¡Comercio registrado con éxito!");
                setFormData({ nombre: '', rubro: 'veterinaria', direccion: '', lat: '', lng: '', telefono: '', resena: '' });
                onComercioGuardado();
            }
        }
    };

    const inputStyle = "w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all placeholder:text-slate-500 mb-5 text-sm font-medium";
    const labelStyle = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 flex items-center gap-1.5";

    return (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${comercioAEditar ? 'bg-[#1c183d] border-orange-500/50 shadow-2xl shadow-orange-950/20' : 'bg-[#1c183d] border-white/5 shadow-xl'}`}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h4 className="text-xl font-[900] text-white uppercase tracking-tighter flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${comercioAEditar ? 'bg-orange-500/10 text-orange-500' : 'bg-[#00d1c6]/10 text-[#00d1c6]'}`}>
                            <Store size={20} />
                        </div>
                        {comercioAEditar ? 'Editando Comercio' : 'Registrar Nuevo'}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 ml-11">Formulario de establecimiento</p>
                </div>

                {comercioAEditar && (
                    <button onClick={onCancelarEdicion} className="bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 p-2 rounded-xl transition-all border border-white/5 group">
                        <XCircle size={20} className="transition-transform group-hover:rotate-90" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div>
                    <label className={labelStyle}>Nombre del lugar</label>
                    <input type="text" className={inputStyle} placeholder="Ej: Veterinaria Akira" required
                        value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                </div>
                <div>
                    <label className={labelStyle}>Rubro</label>
                    <select className={inputStyle} value={formData.rubro} onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}>
                        <option value="veterinaria">Veterinaria</option>
                        <option value="petshop">Petshop</option>
                        <option value="peluqueria">Peluquería</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className={labelStyle}>Dirección</label>
                    <input type="text" className={inputStyle} placeholder="Calle, Número, Localidad" required
                        value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
                </div>
                <div>
                    <label className={labelStyle}><Navigation size={12} /> Latitud</label>
                    <input type="number" step="any" className={inputStyle} placeholder="-32.1234" required
                        value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} />
                </div>
                <div>
                    <label className={labelStyle}><Navigation size={12} /> Longitud</label>
                    <input type="number" step="any" className={inputStyle} placeholder="-68.1234" required
                        value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} />
                </div>
                <div>
                    <label className={labelStyle}>Teléfono / WhatsApp</label>
                    <input type="tel" className={inputStyle} placeholder="+54 9..."
                        value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelStyle}>Pequeña Reseña</label>
                    <textarea rows={2} className={inputStyle} placeholder="Breve descripción de los servicios..."
                        value={formData.resena} onChange={(e) => setFormData({ ...formData, resena: e.target.value })} />
                </div>
                <button type="submit" className={`md:col-span-2 w-full font-black p-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-sm mt-4 hover:scale-[1.02] active:scale-95 ${comercioAEditar
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-900/10'
                    : 'bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] shadow-[#00d1c6]/10'
                    }`}>
                    {comercioAEditar ? 'Actualizar Cambios' : 'Guardar Comercio'}
                </button>
            </form>
        </div>
    );
};
