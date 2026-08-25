import React, { useState } from 'react';
import { Pet } from '../../types';
import { petService } from '../../services/petService';
import { X, Camera, Save, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

interface EditPetModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedPet: Pet) => void;
  onDeleted: (petId: string) => void;
}

export const EditPetModal: React.FC<EditPetModalProps> = ({
  pet,
  isOpen,
  onClose,
  onSaved,
  onDeleted
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: pet.name || '',
    species: pet.species || 'dog',
    breed: pet.breed || '',
    sex: pet.sex || 'Macho',
    birthDate: pet.birthDate || '',
    weight: pet.weight ? pet.weight.toString() : '',
    photoUrl: pet.photoUrl || '',
    notes: pet.notes || '',
    chipId: pet.chipId || ''
  });

  if (!isOpen) return null;

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const uploadedUrl = await petService.uploadPetPhoto(file);
      setFormData(prev => ({ ...prev, photoUrl: uploadedUrl }));
    } catch (err: any) {
      alert("Error al subir la foto: " + (err.message || err));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedPet: Pet = {
        ...pet,
        name: formData.name.trim(),
        species: formData.species as 'dog' | 'cat',
        breed: formData.breed.trim(),
        sex: formData.sex as 'Macho' | 'Hembra',
        birthDate: formData.birthDate,
        weight: parseFloat(formData.weight) || 0,
        photoUrl: formData.photoUrl,
        notes: formData.notes,
        chipId: formData.chipId
      };

      await petService.updatePet(updatedPet);
      onSaved(updatedPet);
      onClose();
    } catch (err: any) {
      alert("Error al actualizar la mascota: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar la mascota "${pet.name}"? Esta acción borrará también su historial médico y no se puede deshacer.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await petService.deletePet(pet.id);
      onDeleted(pet.id);
      onClose();
    } catch (err: any) {
      alert("Error al eliminar la mascota: " + (err.message || err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d0f35]/90 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 relative my-8 animate-in slide-in-from-bottom duration-300">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-brand-navy">Editar Perfil de Mascota</h2>
            <p className="text-xs text-slate-500 font-medium">Modifica los datos y la foto de {pet.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* FOTO DE PERFIL DE LA MASCOTA */}
          <div className="flex flex-col items-center space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest self-start">
              Foto de Perfil
            </label>
            <div className="relative group w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border-4 border-slate-100 shadow-md">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Foto previa" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-3xl">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '🐾'}
                </div>
              )}
              
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                  <Loader2 className="animate-spin" size={28} />
                </div>
              )}

              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer gap-1">
                <Camera size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Cambiar Foto</span>
                <input 
                  type="file" 
                  accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp" 
                  onChange={handlePhotoFileChange} 
                  className="hidden" 
                  disabled={uploadingPhoto}
                />
              </label>
            </div>

            <div className="flex gap-2">
              <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <ImageIcon size={16} />
                {uploadingPhoto ? 'Procesando...' : 'Seleccionar Foto / Galería'}
                <input 
                  type="file" 
                  accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp" 
                  onChange={handlePhotoFileChange} 
                  className="hidden" 
                  disabled={uploadingPhoto}
                />
              </label>
            </div>
          </div>

          {/* NOMBRE */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Nombre de la Mascota *
            </label>
            <input 
              type="text" 
              required
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-brand-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* ESPECIE & SEXO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Especie
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, species: 'dog' })}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                    formData.species === 'dog' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-slate-200 text-slate-500 bg-slate-50'
                  }`}
                >
                  Perro
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, species: 'cat' })}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                    formData.species === 'cat' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-slate-200 text-slate-500 bg-slate-50'
                  }`}
                >
                  Gato
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Sexo
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: 'Macho' })}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                    formData.sex === 'Macho' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-slate-200 text-slate-500 bg-slate-50'
                  }`}
                >
                  ♂ Macho
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: 'Hembra' })}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                    formData.sex === 'Hembra' 
                      ? 'border-pink-500 bg-pink-50 text-pink-600' 
                      : 'border-slate-200 text-slate-500 bg-slate-50'
                  }`}
                >
                  ♀ Hembra
                </button>
              </div>
            </div>
          </div>

          {/* RAZA & PESO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Raza
              </label>
              <input 
                type="text" 
                placeholder="Ej: Labrador, Mestizo"
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-brand-navy outline-none focus:border-primary text-sm"
                value={formData.breed}
                onChange={e => setFormData({ ...formData, breed: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Peso (Kg)
              </label>
              <input 
                type="number"
                step="0.1" 
                placeholder="12.5"
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-brand-navy outline-none focus:border-primary text-sm"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          {/* FECHA DE NACIMIENTO */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Fecha de Nacimiento (Aprox)
            </label>
            <input 
              type="date" 
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-brand-navy outline-none focus:border-primary text-xs"
              value={formData.birthDate}
              onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>

          {/* CHIP ID */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Número de Microchip / Chip ID (Opcional)
            </label>
            <input 
              type="text" 
              placeholder="Ej: 985141000123456"
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-brand-navy outline-none focus:border-primary text-sm"
              value={formData.chipId}
              onChange={e => setFormData({ ...formData, chipId: e.target.value })}
            />
          </div>

          {/* BOTONES DE GUARDAR Y ELIMINAR */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button 
              type="submit"
              disabled={loading || uploadingPhoto}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>

            <button 
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100"
            >
              {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              {deleting ? 'Eliminando...' : 'Eliminar Mascota'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
