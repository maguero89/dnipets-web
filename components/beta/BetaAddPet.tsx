import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { Pet } from '../../types';
import { petService } from '../../services/petService';

interface BetaAddPetProps {
  onBack: () => void;
  onSaved: () => void;
}

export const BetaAddPet: React.FC<BetaAddPetProps> = ({ onBack, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    sex: 'Macho',
    breed: '',
    weight: '',
    birthDate: '',
    photoUrl: '' // In a real app this would handle the file upload
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Fake processing for Beta (using a fake object URL or relying on user not uploading real image for now)
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, photoUrl: objectUrl });
    }
  };

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
        photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
        status: 'safe',
      };

      await petService.addPet(newPet);
      onSaved();
    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0d0f35] flex flex-col pt-12 animate-in slide-in-from-bottom duration-300 z-50">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pb-6 text-white">
        <h2 className="text-2xl font-bold">Nueva Mascota</h2>
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* BODY FORM */}
      <div className="flex-1 bg-white rounded-t-3xl p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
          
          {/* FOTO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Foto</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                disabled
                className="border-2 border-dashed border-[#00D1C6]/30 bg-[#00D1C6]/5 text-[#00D1C6] rounded-2xl py-6 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed"
              >
                <Camera size={24} />
                <span className="text-xs font-bold">Usar Cámara</span>
              </button>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`border-2 border-dashed rounded-2xl py-6 flex flex-col items-center gap-2 transition-colors ${
                  formData.photoUrl ? 'border-[#00D1C6] text-[#00D1C6] bg-[#00D1C6]/5' : 'border-slate-300 text-slate-500 hover:bg-slate-50'
                }`}>
                  <ImageIcon size={24} />
                  <span className="text-xs font-bold">{formData.photoUrl ? 'Foto Cargada' : 'Abrir Galería'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NOMBRE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nombre</label>
            <input 
              type="text" 
              placeholder="Ej: Thor" 
              required
              className="w-full bg-slate-50 text-[#0d0f35] p-4 rounded-xl outline-none focus:border-[#00D1C6] focus:ring-2 focus:ring-[#00D1C6]/20 font-bold placeholder:font-normal placeholder:text-slate-400"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* ESPECIE & SEXO */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Especie</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, species: 'dog'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
                    formData.species === 'dog' 
                      ? 'border-[#00D1C6] text-[#00D1C6] bg-[#00D1C6]/5' 
                      : 'border-slate-200 text-slate-400 bg-white'
                  }`}
                >
                  Perro
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, species: 'cat'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
                    formData.species === 'cat' 
                      ? 'border-[#00D1C6] text-[#00D1C6] bg-[#00D1C6]/5' 
                      : 'border-slate-200 text-slate-400 bg-white'
                  }`}
                >
                  Gato
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Sexo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, sex: 'Macho'})}
                  className={`flex-1 flex items-center justify-center text-xl pb-1 rounded-xl border-2 transition-all font-bold ${
                    formData.sex === 'Macho' 
                      ? 'border-blue-500 text-blue-500 bg-blue-50' 
                      : 'border-slate-200 text-slate-400 bg-white'
                  }`}
                >
                  ♂
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, sex: 'Hembra'})}
                  className={`flex-1 flex items-center justify-center text-xl pb-1 rounded-xl border-2 transition-all font-bold ${
                    formData.sex === 'Hembra' 
                      ? 'border-pink-500 text-pink-500 bg-pink-50' 
                      : 'border-slate-200 text-slate-400 bg-white'
                  }`}
                >
                  ♀
                </button>
              </div>
            </div>
          </div>

          {/* RAZA */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Raza</label>
            <input 
              type="text" 
              placeholder="Ej: Golden Retriever"
              className="w-full bg-slate-50 text-[#0d0f35] p-4 rounded-xl outline-none focus:border-[#00D1C6] focus:ring-2 focus:ring-[#00D1C6]/20 font-bold placeholder:font-normal placeholder:text-slate-400"
              value={formData.breed}
              onChange={e => setFormData({...formData, breed: e.target.value})}
            />
          </div>

          {/* PESO & NACIMIENTO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Peso (KG)</label>
              <input 
                type="number"
                step="0.1"
                className="w-full bg-slate-50 text-[#0d0f35] p-4 rounded-xl outline-none focus:border-[#00D1C6] focus:ring-2 focus:ring-[#00D1C6]/20 font-bold"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nacimiento</label>
              <input 
                type="date"
                className="w-full bg-slate-50 text-[#0d0f35] p-3.5 rounded-xl outline-none focus:border-[#00D1C6] focus:ring-2 focus:ring-[#00D1C6]/20 font-bold text-sm style-color-scheme-light"
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-auto pt-6 pb-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00D1C6] hover:bg-[#00b8ae] text-white font-bold p-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Mascota'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
