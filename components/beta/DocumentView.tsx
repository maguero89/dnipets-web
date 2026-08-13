import React, { useState, useEffect } from 'react';
import { Pet, UserProfile, HealthRecord, RecordType } from '../../types';
import { 
  ArrowLeft, 
  Settings, 
  AlertTriangle, 
  Heart, 
  ShieldCheck, 
  Download, 
  Share2, 
  X, 
  Lock, 
  Syringe, 
  Calendar, 
  FileText, 
  Edit2, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { petService } from '../../services/petService';
import { RealIdCard } from '../ui/RealIdCard';
import { RecordModal } from '../modals/RecordModal';

interface DocumentViewProps {
  pet: Pet;
  profile: UserProfile;
  onBack: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ pet: initialPet, profile, onBack }) => {
  const [pet, setPet] = useState<Pet>(initialPet);
  const [loading, setLoading] = useState(false);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  // Modal de Historial Médico
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordTypeToAdd, setRecordTypeToAdd] = useState<RecordType>('vaccine');
  const [editingRecord, setEditingRecord] = useState<HealthRecord | undefined>(undefined);

  // States for PIN modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [targetStatus, setTargetStatus] = useState<'lost' | 'adoption' | 'safe'>('lost');

  const isOwner = pet.ownerId === profile.uid || true;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dnipets.com';
  const qrDataUrl = `${origin}/?p=${pet.id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrDataUrl)}`;

  useEffect(() => {
    petService.getHealthRecords(pet.id)
      .then(setHealthRecords)
      .catch(() => setHealthRecords([]));
  }, [pet.id]);

  const requestStatusChange = (newStatus: 'lost' | 'adoption' | 'safe') => {
    if (newStatus === pet.status) return;
    setTargetStatus(newStatus);
    setPinInput('');
    setPinError('');
    setShowPinModal(true);
  };

  // CAPTURA Y FIJACIÓN ESTÁTICA DE COORDENADAS GPS AL REPORTAR PÉRDIDA O ADOPCIÓN
  const confirmPinAndExecute = async () => {
    const requiredPin = profile.securityPin || '0000';
    if (pinInput !== requiredPin) {
      setPinError('El PIN ingresado es incorrecto.');
      return;
    }
    setShowPinModal(false);
    setLoading(true);

    try {
      if (targetStatus === 'lost' || targetStatus === 'adoption') {
        // Capturar posición estática exacta en el momento del reporte
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const lat = pos.coords.latitude;
              const lng = pos.coords.longitude;
              await petService.updatePetStatus(pet.id, targetStatus, lat, lng);
              setPet({ ...pet, status: targetStatus, lastLat: lat, lastLng: lng });
              setLoading(false);
            },
            async (err) => {
              console.warn("Ubicación no disponible, usando coordenadas fijas de referencia:", err);
              const defaultLat = -34.6037;
              const defaultLng = -58.3816;
              await petService.updatePetStatus(pet.id, targetStatus, defaultLat, defaultLng);
              setPet({ ...pet, status: targetStatus, lastLat: defaultLat, lastLng: defaultLng });
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 6000 }
          );
        } else {
          await petService.updatePetStatus(pet.id, targetStatus, -34.6037, -58.3816);
          setPet({ ...pet, status: targetStatus });
          setLoading(false);
        }
      } else {
        // Al volver a estar seguro en casa, se limpian las coordenadas
        await petService.updatePetStatus(pet.id, 'safe', null, null);
        setPet({ ...pet, status: 'safe', lastLat: undefined, lastLng: undefined });
        setLoading(false);
      }
    } catch (error: any) {
      alert("Error al actualizar el estado: " + error.message);
      setLoading(false);
    }
  };

  const handleSaveRecord = async (recordData: Partial<HealthRecord>) => {
    try {
      if (editingRecord) {
        const updatedRec = { ...editingRecord, ...recordData } as HealthRecord;
        await petService.updateHealthRecord(updatedRec);
        setHealthRecords(prev => prev.map(h => h.id === updatedRec.id ? updatedRec : h));
      } else {
        const newRec = {
          ...recordData,
          id: Date.now().toString(),
          petId: pet.id
        } as HealthRecord;
        await petService.addHealthRecord(newRec);
        setHealthRecords(prev => [...prev, newRec]);
      }
      setIsRecordModalOpen(false);
      setEditingRecord(undefined);
    } catch (e: any) {
      alert("Error al guardar registro médico: " + e.message);
    }
  };

  const handleDeleteRecord = async (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("¿Deseas eliminar este registro médico?")) {
      try {
        await petService.deleteHealthRecord(recordId);
        setHealthRecords(prev => prev.filter(r => r.id !== recordId));
      } catch (err: any) {
        alert("Error al eliminar: " + (err.message || err));
      }
    }
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_${pet.name}_DNI_PETS.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      window.open(qrImageUrl, '_blank');
    }
  };

  const getExpirationStatus = (nextDueDate?: string) => {
    if (!nextDueDate) return null;
    const today = new Date();
    const due = new Date(nextDueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'urgent';
    return 'ok';
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full animate-in slide-in-from-right duration-300 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white z-20 shadow-sm relative border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <span className="text-brand-navy font-bold text-lg">{pet.name}</span>
        <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-6">
        
        {/* REAL ID CARD COMPONENT */}
        <div className="mb-2">
          <RealIdCard pet={pet} />
        </div>

        {/* BOTONES DE ACCIÓN DE QR */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleDownloadQr}
            className="flex justify-center items-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-xl py-3 text-xs font-bold transition-all active:scale-95 shadow-md"
          >
            <Download size={16} /> Descargar QR
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(qrDataUrl);
              alert("Enlace de perfil copiado al portapapeles");
            }}
            className="flex justify-center items-center gap-2 bg-white border border-slate-200 text-brand-navy hover:bg-slate-50 rounded-xl py-3 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Share2 size={16} /> Copiar Enlace
          </button>
        </div>

        {/* CONTROLES DE ESTADO ACTUAL */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado Actual</p>
              <p className={`font-bold text-sm ${
                pet.status === 'lost' ? 'text-red-600' : pet.status === 'adoption' ? 'text-purple-600' : 'text-green-600'
              }`}>
                {pet.status === 'lost' ? '⚠️ PERDIDO' : pet.status === 'adoption' ? '💜 EN ADOPCIÓN' : '✅ SEGURO EN CASA'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => requestStatusChange(pet.status === 'lost' ? 'safe' : 'lost')}
              disabled={loading || pet.status === 'adoption'}
              className={`px-3 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                pet.status === 'lost' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600 border border-red-100'
              }`}
            >
              {pet.status === 'lost' ? 'Marcar Encontrado' : <><AlertTriangle size={15} /> Reportar Pérdida</>}
            </button>
            <button 
              onClick={() => requestStatusChange(pet.status === 'adoption' ? 'safe' : 'adoption')}
              disabled={loading || pet.status === 'lost'}
              className={`px-3 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                pet.status === 'adoption' ? 'bg-gray-100 text-gray-700' : 'bg-purple-50 text-purple-600 border border-purple-100'
              }`}
            >
              {pet.status === 'adoption' ? 'Cancelar Adopción' : <><Heart size={15} /> Dar en Adopción</>}
            </button>
          </div>
        </div>

        {/* HISTORIAL MÉDICO 1:1 CON LA APLICACIÓN ORIGINAL */}
        <div className="space-y-4">
          <h3 className="font-bold text-brand-navy text-lg">Historial Médico</h3>

          {/* 1. SECCIÓN VACUNAS */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <Syringe size={18} className="text-primary" /> Vacunas
              </div>
              {isOwner && (
                <button 
                  onClick={() => { setEditingRecord(undefined); setRecordTypeToAdd('vaccine'); setIsRecordModalOpen(true); }} 
                  className="text-primary text-xs font-bold bg-primary/10 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> Agregar
                </button>
              )}
            </div>
            <div className="space-y-2">
              {healthRecords.filter(r => r.type === 'vaccine').length === 0 ? (
                <p className="text-xs text-gray-400 italic">No hay vacunas registradas</p>
              ) : (
                healthRecords.filter(r => r.type === 'vaccine').map(r => { 
                  const expirationStatus = getExpirationStatus(r.nextDueDate); 
                  return (
                    <div key={r.id} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-brand-navy">{r.title}</p>
                        <p className="text-gray-600 text-xs">{r.date}</p>
                        {r.nextDueDate && (
                          <div className={`mt-1 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            expirationStatus === 'urgent' ? 'bg-red-100 text-red-700 border border-red-200' : expirationStatus === 'expired' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {expirationStatus === 'urgent' && <AlertTriangle size={10} />}
                            {expirationStatus === 'expired' ? 'VENCIDA' : `Vence: ${r.nextDueDate}`}
                          </div>
                        )}
                      </div>
                      {isOwner && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditingRecord(r); setRecordTypeToAdd('vaccine'); setIsRecordModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-primary bg-gray-50 rounded-lg">
                            <Edit2 size={14} />
                          </button>
                          <button type="button" onClick={(e) => handleDeleteRecord(r.id, e)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. SECCIÓN AGENDA / VISITAS */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <Calendar size={18} className="text-primary" /> Agenda / Visitas
              </div>
              {isOwner && (
                <button 
                  onClick={() => { setEditingRecord(undefined); setRecordTypeToAdd('vet_visit'); setIsRecordModalOpen(true); }} 
                  className="text-primary text-xs font-bold bg-primary/10 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> Agregar
                </button>
              )}
            </div>
            <div className="space-y-2">
              {healthRecords.filter(r => r.type === 'vet_visit').length === 0 ? (
                <p className="text-xs text-gray-400 italic">No hay visitas registradas</p>
              ) : (
                healthRecords.filter(r => r.type === 'vet_visit').map(r => (
                  <div key={r.id} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-brand-navy">{r.title}</p>
                      {r.veterinarian && <p className="text-gray-600 text-xs">{r.veterinarian}</p>}
                      <span className="text-xs text-gray-500 block mt-0.5">{r.date}</span>
                    </div>
                    {isOwner && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingRecord(r); setRecordTypeToAdd('vet_visit'); setIsRecordModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-primary bg-gray-50 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                        <button type="button" onClick={(e) => handleDeleteRecord(r.id, e)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. SECCIÓN DOCUMENTOS */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <FileText size={18} className="text-primary" /> Documentos
              </div>
              {isOwner && (
                <button 
                  onClick={() => { setEditingRecord(undefined); setRecordTypeToAdd('certificate'); setIsRecordModalOpen(true); }} 
                  className="text-primary text-xs font-bold bg-primary/10 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> Agregar
                </button>
              )}
            </div>
            <div className="space-y-2">
              {healthRecords.filter(r => r.type === 'certificate').length === 0 ? (
                <p className="text-xs text-gray-400 italic">No hay documentos</p>
              ) : (
                healthRecords.filter(r => r.type === 'certificate').map(r => (
                  <div key={r.id} className="flex items-center gap-3 text-sm border-b border-gray-50 last:border-0 pb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                      {r.fileUrl ? <img src={r.fileUrl} className="w-full h-full object-cover" alt="" /> : <FileText size={14} className="text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-brand-navy">{r.title}</p>
                      <p className="text-gray-600 text-xs">{r.date}</p>
                    </div>
                    {isOwner && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingRecord(r); setRecordTypeToAdd('certificate'); setIsRecordModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-primary bg-gray-50 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                        <button type="button" onClick={(e) => handleDeleteRecord(r.id, e)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => { setIsRecordModalOpen(false); setEditingRecord(undefined); }}
        type={recordTypeToAdd}
        initialRecord={editingRecord}
        onSave={handleSaveRecord}
      />

      {/* PIN CONFIRMATION MODAL */}
      {showPinModal && (
        <div className="absolute inset-0 z-50 bg-brand-navy/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2 leading-tight">PIN de Seguridad</h3>
            <p className="text-xs text-slate-500 mb-4">Ingresa tu PIN para cambiar el estado de {pet.name}. El PIN por defecto es <span className="font-bold text-brand-navy">0000</span>.</p>
            
            <input 
              type="password"
              maxLength={4}
              placeholder="0000"
              className="w-full bg-slate-50 border border-slate-200 text-center text-brand-navy text-3xl tracking-[0.5em] font-black p-4 rounded-xl outline-none focus:border-primary transition-all mb-2"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
            />
            {pinError && <p className="text-red-500 text-xs font-bold text-center mb-2">{pinError}</p>}
            
            <button 
              onClick={confirmPinAndExecute}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold p-4 rounded-xl transition-colors mt-2"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
