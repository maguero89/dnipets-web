import React, { useState, useEffect } from 'react';
import { Pet, HealthRecord, RecordType } from '../types';
import { petService } from '../services/petService';
import { 
  X, Plus, Syringe, Stethoscope, FileText, Calendar, Clock, 
  Upload, File, Download, ExternalLink, Trash2, CheckCircle2, 
  AlertTriangle, Search, Loader2, Paperclip, Eye 
} from 'lucide-react';

interface MedicalHistoryModalProps {
  pet: Pet;
  onClose: () => void;
  onUpdated?: () => void;
}

export const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({ pet, onClose, onUpdated }) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'vaccine' | 'vet_visit' | 'certificate'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    type: RecordType;
    date: string;
    nextDueDate: string;
    veterinarian: string;
    notes: string;
    fileUrl: string;
  }>({
    title: '',
    type: 'vaccine',
    date: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    veterinarian: '',
    notes: '',
    fileUrl: ''
  });

  useEffect(() => {
    loadHealthRecords();
  }, [pet.id]);

  const loadHealthRecords = async () => {
    setLoading(true);
    try {
      const data = await petService.getHealthRecords(pet.id);
      // Sort newest first
      data.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setRecords(data);
    } catch (err) {
      console.error("Error al cargar historial médico:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const url = await petService.uploadFile(file, `pet_${pet.id}`);
      setFormData(prev => ({ ...prev, fileUrl: url }));
    } catch (err: any) {
      alert("Error al subir archivo: " + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Por favor ingresa un título");

    setSubmitting(true);
    try {
      const newRecord: HealthRecord = {
        id: crypto.randomUUID(),
        petId: pet.id,
        title: formData.title,
        type: formData.type,
        date: formData.date,
        nextDueDate: formData.nextDueDate || undefined,
        veterinarian: formData.veterinarian || undefined,
        notes: formData.notes || undefined,
        fileUrl: formData.fileUrl || undefined
      };

      await petService.addHealthRecord(newRecord);
      
      // Reset form
      setFormData({
        title: '',
        type: 'vaccine',
        date: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        veterinarian: '',
        notes: '',
        fileUrl: ''
      });
      setShowAddForm(false);
      await loadHealthRecords();
      if (onUpdated) onUpdated();
    } catch (err: any) {
      alert("Error al guardar registro: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm("¿Estás seguro de eliminar este registro del historial médico?")) return;
    try {
      await petService.deleteHealthRecord(recordId);
      await loadHealthRecords();
      if (onUpdated) onUpdated();
    } catch (err: any) {
      alert("Error al eliminar registro: " + err.message);
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesTab = activeTab === 'all' || r.type === activeTab;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.veterinarian && r.veterinarian.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getRecordIcon = (type: RecordType) => {
    switch (type) {
      case 'vaccine': return <Syringe size={18} className="text-[#00d1c6]" />;
      case 'vet_visit': return <Stethoscope size={18} className="text-indigo-400" />;
      case 'certificate': return <FileText size={18} className="text-amber-400" />;
      default: return <FileText size={18} className="text-slate-400" />;
    }
  };

  const getRecordTypeName = (type: RecordType) => {
    switch (type) {
      case 'vaccine': return 'Vacuna';
      case 'vet_visit': return 'Consulta Veterinaria';
      case 'certificate': return 'Certificado / Estudio';
      default: return 'Registro';
    }
  };

  const getDueDateStatus = (dueDateStr?: string) => {
    if (!dueDateStr) return null;
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return { text: `Vencido hace ${Math.abs(diffDays)} días`, color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    } else if (diffDays <= 30) {
      return { text: `Refuerzo en ${diffDays} días`, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    } else {
      return { text: `Próximo refuerzo: ${dueDateStr}`, color: 'bg-[#00d1c6]/10 text-[#00d1c6] border-[#00d1c6]/20' };
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d0f35]/95 backdrop-blur-md flex items-center justify-center z-[160] p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="bg-[#1c183d] w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181435]">
          <div className="flex items-center gap-4">
            {pet.photoUrl ? (
              <img src={pet.photoUrl} alt={pet.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00d1c6]" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#2a2550] flex items-center justify-center text-white font-black text-2xl">
                {pet.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-[900] text-white uppercase tracking-tighter">Historial Médico</h2>
                <span className="bg-[#00d1c6]/10 text-[#00d1c6] text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg uppercase border border-[#00d1c6]/20">
                  {records.length} {records.length === 1 ? 'Registro' : 'Registros'}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                {pet.name} • {pet.breed}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black px-5 py-3 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#00d1c6]/10 active:scale-95"
            >
              <Plus size={16} />
              {showAddForm ? 'Ver Historial' : 'Nuevo Registro'}
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-[#2a2550] text-slate-400 hover:text-white rounded-xl transition-colors border border-white/5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* ADD RECORD FORM */}
          {showAddForm ? (
            <div className="bg-[#2a2550] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Plus className="text-[#00d1c6]" size={20} />
                  Agregar Registro Médico o Estudio
                </h3>
                <span className="text-xs text-slate-400 font-bold">DNIPETS Health Passport</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* TIPO DE REGISTRO */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Evento</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'vaccine' })}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-bold transition-all ${
                        formData.type === 'vaccine'
                          ? 'bg-[#00d1c6]/20 border-[#00d1c6] text-[#00d1c6]'
                          : 'bg-[#1c183d] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Syringe size={18} />
                      Vacuna
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'vet_visit' })}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-bold transition-all ${
                        formData.type === 'vet_visit'
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                          : 'bg-[#1c183d] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Stethoscope size={18} />
                      Consulta
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'certificate' })}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-bold transition-all ${
                        formData.type === 'certificate'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-[#1c183d] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileText size={18} />
                      Certificado / Estudio
                    </button>
                  </div>
                </div>

                {/* TÍTULO */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título / Nombre del Tratamiento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Vacuna Antirrábica, Ecografía, Desparasitación anual"
                    className="w-full bg-[#1c183d] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6] transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* FECHA Y PRÓXIMA DOSIS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Realización</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-[#1c183d] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6] transition-all style-color-scheme-dark"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Próxima Dosis / Vencimiento (Opcional)</label>
                    <input
                      type="date"
                      className="w-full bg-[#1c183d] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6] transition-all style-color-scheme-dark"
                      value={formData.nextDueDate}
                      onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* VETERINARIO */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Veterinario / Clínica (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Dr. Pérez - Veterinaria Central"
                    className="w-full bg-[#1c183d] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6] transition-all"
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  />
                </div>

                {/* NOTAS */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones / Indicaciones</label>
                  <textarea
                    rows={3}
                    placeholder="Detalles del diagnóstico, posología, peso durante el control, etc."
                    className="w-full bg-[#1c183d] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6] transition-all resize-none text-sm"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                {/* ADJUNTAR ARCHIVO */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Documento / Libreta Adjunta (PDF o Imagen)</label>
                  
                  {formData.fileUrl ? (
                    <div className="flex items-center justify-between bg-[#1c183d] border border-[#00d1c6]/40 p-4 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Paperclip className="text-[#00d1c6]" size={20} />
                        <div>
                          <p className="text-xs font-bold text-white">Archivo adjunto listo</p>
                          <p className="text-[10px] text-slate-400">PDF / Imagen subida exitosamente</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, fileUrl: '' })}
                        className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-white/10 hover:border-[#00d1c6]/50 bg-[#1c183d] rounded-2xl p-6 text-center transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadingFile ? (
                        <div className="flex items-center justify-center gap-3 text-[#00d1c6]">
                          <Loader2 className="animate-spin" size={24} />
                          <span className="text-xs font-bold uppercase tracking-widest">Cargando archivo...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="text-slate-400 group-hover:text-[#00d1c6] transition-colors" size={28} />
                          <p className="text-xs font-bold text-white">Haz clic o arrastra tu comprobante / carnet</p>
                          <p className="text-[10px] text-slate-500 font-medium">Soporta PDF, PNG, JPG (libretas, recetas, análisis clínicos)</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* BOTONES */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || uploadingFile}
                    className="flex-1 bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black p-4 rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00d1c6]/10 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    {submitting ? 'Guardando...' : 'Guardar en Historial'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-[#1c183d] hover:bg-white/5 text-slate-400 font-bold px-6 py-4 rounded-2xl border border-white/5 transition-all text-xs uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* FILTROS Y BÚSQUEDA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* TABS */}
                <div className="flex bg-[#2a2550] p-1.5 rounded-2xl border border-white/5 w-full sm:w-auto overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === 'all' ? 'bg-[#00d1c6] text-[#0d0f35]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos ({records.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('vaccine')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === 'vaccine' ? 'bg-[#00d1c6] text-[#0d0f35]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Vacunas
                  </button>
                  <button
                    onClick={() => setActiveTab('vet_visit')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === 'vet_visit' ? 'bg-[#00d1c6] text-[#0d0f35]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Consultas
                  </button>
                  <button
                    onClick={() => setActiveTab('certificate')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === 'certificate' ? 'bg-[#00d1c6] text-[#0d0f35]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Estudios
                  </button>
                </div>

                {/* SEARCH BAR */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar registros..."
                    className="w-full bg-[#2a2550] border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-[#00d1c6]/50 transition-all placeholder:text-slate-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* LISTA DE REGISTROS */}
              {loading ? (
                <div className="flex flex-col items-center justify-center p-16 space-y-4 text-slate-400">
                  <Loader2 size={36} className="animate-spin text-[#00d1c6]" />
                  <p className="text-xs font-bold uppercase tracking-widest">Cargando historial médico...</p>
                </div>
              ) : filteredRecords.length > 0 ? (
                <div className="space-y-4">
                  {filteredRecords.map((record) => {
                    const dueStatus = getDueDateStatus(record.nextDueDate);
                    return (
                      <div
                        key={record.id}
                        className="bg-[#2a2550] border border-white/5 rounded-2xl p-5 hover:border-[#00d1c6]/30 transition-all space-y-4 group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-[#1c183d] rounded-xl border border-white/5 shrink-0 mt-1">
                              {getRecordIcon(record.type)}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-lg font-black text-white uppercase tracking-tight">{record.title}</h4>
                                <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md bg-[#1c183d] text-slate-400 border border-white/5">
                                  {getRecordTypeName(record.type)}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-medium mt-1">
                                {record.date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={13} className="text-[#00d1c6]" />
                                    {record.date}
                                  </span>
                                )}
                                {record.veterinarian && (
                                  <span className="flex items-center gap-1">
                                    <Stethoscope size={13} className="text-indigo-400" />
                                    {record.veterinarian}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors opacity-60 group-hover:opacity-100"
                            title="Eliminar registro"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* DUE DATE BADGE */}
                        {dueStatus && (
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${dueStatus.color}`}>
                            <Clock size={14} />
                            {dueStatus.text}
                          </div>
                        )}

                        {/* NOTES */}
                        {record.notes && (
                          <div className="bg-[#1c183d] p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed">
                            {record.notes}
                          </div>
                        )}

                        {/* FILE ATTACHMENT ACTION */}
                        {record.fileUrl && (
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                              <Paperclip size={14} className="text-[#00d1c6]" />
                              <span>Documento adjunto</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPreviewFile(record.fileUrl || null)}
                                className="flex items-center gap-1.5 bg-[#1c183d] hover:bg-[#00d1c6] hover:text-[#0d0f35] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/10 uppercase tracking-wider"
                              >
                                <Eye size={13} />
                                Ver
                              </button>
                              <a
                                href={record.fileUrl}
                                download={`DNIPETS_${record.title.replace(/\s+/g, '_')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-[#1c183d] hover:bg-white hover:text-[#0d0f35] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/10 uppercase tracking-wider"
                              >
                                <Download size={13} />
                                Descargar
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#2a2550] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="bg-[#1c183d] p-5 rounded-full text-slate-500">
                    <Syringe size={36} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Sin registros médicos aún</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Agrega las vacunas, libreta de salud o visitas al veterinario de {pet.name} para mantener su historial digital actualizado.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black px-6 py-3 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#00d1c6]/10"
                  >
                    Agregar primer registro
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* PREVIEW FILE MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[170] p-4">
          <div className="relative bg-[#1c183d] max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden flex flex-col border border-white/10">
            <div className="flex items-center justify-between p-4 bg-[#0d0f35] border-b border-white/10">
              <h4 className="text-sm font-bold text-white">Previsualización de Documento</h4>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-black/50">
              {previewFile.startsWith('data:application/pdf') || previewFile.endsWith('.pdf') ? (
                <iframe src={previewFile} className="w-full h-[60vh] rounded-lg" title="Document Preview" />
              ) : (
                <img src={previewFile} alt="Document Preview" className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
