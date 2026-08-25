import React, { useState } from 'react';
import { petService } from '../services/petService';
import { Pet } from '../types';
import { X, Save, ShieldAlert, Upload, Loader2 } from 'lucide-react';

interface AddPetModalProps {
  onClose: () => void;
  onAdded: () => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ onClose, onAdded }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    sex: 'Macho',
    birthDate: '',
    weight: '',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600', // Default placeholder
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await petService.getCurrentUser();
      
      const newPet: Pet = {
        id: crypto.randomUUID(),
        ownerId: user?.uid || '',
        name: formData.name,
        species: formData.species as 'dog' | 'cat',
        breed: formData.breed,
        sex: formData.sex as 'Macho' | 'Hembra',
        birthDate: formData.birthDate,
        weight: parseFloat(formData.weight) || 0,
        ownerName: user ? `${user.firstName} ${user.lastName}`.trim() || 'Dueño' : 'Dueño',
        photoUrl: formData.photoUrl,
        status: 'safe',
      };

      await petService.addPet(newPet);
      onAdded();
    } catch (error: any) {
      alert("Error al agregar la mascota: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d0f35]/95 backdrop-blur-md flex items-center justify-center z-[150] p-4">
      <div className="bg-[#1c183d] w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-8 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div>
          <h2 className="text-3xl font-[900] text-white uppercase tracking-tighter">Registrar Mascota</h2>
          <p className="text-[#00d1c6] text-[10px] font-bold uppercase tracking-widest mt-1">Nuevo Integrante DNIPETS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
            <input 
              type="text" 
              className="w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all" 
              placeholder="Ej. Firulais" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Especie</label>
              <select 
                className="w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all appearance-none"
                value={formData.species}
                onChange={(e) => setFormData({...formData, species: e.target.value})}
              >
                <option value="dog">Perro</option>
                <option value="cat">Gato</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sexo</label>
              <select 
                className="w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all appearance-none"
                value={formData.sex}
                onChange={(e) => setFormData({...formData, sex: e.target.value})}
              >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Raza</label>
            <input 
              type="text" 
              className="w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all" 
              placeholder="Ej. Mestizo" 
              value={formData.breed}
              onChange={(e) => setFormData({...formData, breed: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nacimiento (Aprox)</label>
              <input 
                type="date" 
                className="w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all style-color-scheme-dark origin-left" 
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Peso (Kg)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full bg-[#2a2550] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-[#00d1c6]/50 transition-all" 
                placeholder="Ej. 15.5" 
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Foto de la Mascota</label>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer bg-[#2a2550] border border-[#00d1c6]/30 hover:bg-[#00d1c6]/10 p-4 rounded-2xl text-white flex items-center justify-center gap-2 text-xs font-bold transition-all">
                {uploadingPhoto ? <Loader2 className="animate-spin text-[#00d1c6]" size={18} /> : <Upload size={18} className="text-[#00d1c6]" />}
                <span>{uploadingPhoto ? 'Procesando Foto de iPhone/Galería...' : 'Subir Foto desde Galería / Cámara'}</span>
                <input 
                  type="file" 
                  accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadingPhoto(true);
                      try {
                        const photoUrl = await petService.uploadPetPhoto(file);
                        setFormData(prev => ({ ...prev, photoUrl }));
                      } catch (err: any) {
                        alert("Error al subir foto: " + (err.message || err));
                      } finally {
                        setUploadingPhoto(false);
                      }
                    }
                  }} 
                  className="hidden" 
                  disabled={uploadingPhoto}
                />
              </label>

              <input 
                type="text" 
                className="w-full bg-[#2a2550] border border-white/5 p-3 rounded-xl text-white outline-none focus:border-[#00d1c6]/50 transition-all text-xs placeholder:text-slate-500" 
                placeholder="O pega una URL de imagen (opcional)" 
                value={formData.photoUrl}
                onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] font-black p-5 rounded-2xl shadow-xl shadow-[#00d1c6]/10 transition-all uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-2"
          >
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-[#0d0f35] border-t-transparent rounded-full"></span> : <Save size={18} />}
            {loading ? 'Guardando...' : 'Crear DNI y QR'}
          </button>
          
          <div className="flex items-center gap-2 p-3 bg-indigo-500/10 rounded-xl">
            <ShieldAlert size={14} className="text-indigo-500 shrink-0" />
            <p className="text-[10px] text-indigo-200/60 font-medium">
              Al guardar, se generará un código QR único para tu mascota que se conectará con esta información.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
