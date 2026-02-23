import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Store } from 'lucide-react';
import { supabase } from '../services/petService';

interface Props {
    refreshKey: number;
    onEditRequest: (comercio: any) => void;
}

export const TablaComercios: React.FC<Props> = ({ refreshKey, onEditRequest }) => {
    const [comercios, setComercios] = useState<any[]>([]);

    const fetchComercios = async () => {
        const { data, error } = await supabase.from('comercios').select('*').order('created_at', { ascending: false });
        if (!error) setComercios(data || []);
    };

    const handleDelete = async (id: string, nombre: string) => {
        if (window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
            const { error } = await supabase.from('comercios').delete().eq('id', id);
            if (!error) fetchComercios();
        }
    };

    useEffect(() => { fetchComercios(); }, [refreshKey]);

    return (
        <div className="bg-[#1c183d] rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden min-h-[400px]">
            <div className="bg-[#2a2550] p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-black text-[#00d1c6] uppercase tracking-widest">Establecimientos</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Lista de comercios activos</p>
                </div>
                <div className="bg-[#1c183d] px-3 py-1 rounded-full border border-white/5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{comercios.length} Total</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#2a2550]/30">
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Establecimiento</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Categoría</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Gestión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {comercios.map((comercio) => (
                            <tr key={comercio.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#00d1c6] transition-colors">{comercio.nombre}</p>
                                    <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px] mt-1">{comercio.direccion}</p>
                                </td>
                                <td className="p-6">
                                    <span className="bg-[#00d1c6]/10 text-[#00d1c6] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#00d1c6]/20">
                                        {comercio.rubro}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => onEditRequest(comercio)}
                                            className="p-2.5 bg-white/5 text-slate-400 hover:text-[#00d1c6] hover:bg-[#00d1c6]/10 rounded-xl transition-all border border-white/5 shadow-lg"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comercio.id, comercio.nombre)}
                                            className="p-2.5 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-white/5 shadow-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {comercios.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-[#2a2550] rounded-full flex items-center justify-center mx-auto border border-white/5 opacity-50">
                            <Store size={24} className="text-slate-500" />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">No hay registros</p>
                    </div>
                )}
            </div>
        </div>
    );
};
