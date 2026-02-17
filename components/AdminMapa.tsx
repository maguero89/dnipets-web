import React, { useState } from 'react';
import { supabase } from '../services/petService';

export const AdminMapa = () => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('veterinaria');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [mensaje, setMensaje] = useState('');

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('Guardando...');

    const { error } = await supabase
      .from('establecimientos')
      .insert([{ 
        nombre, 
        tipo, 
        latitud: parseFloat(latitud), 
        longitud: parseFloat(longitud),
        activo: true 
      }]);

    if (error) setMensaje('Error: ' + error.message);
    else {
      setMensaje('¡Cargado con éxito! 🎉');
      setNombre(''); setLatitud(''); setLongitud('');
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-gray-800">Admin DNI-PETS</h2>
      <form onSubmit={guardar} className="flex flex-col gap-4">
        <input 
          className="border p-2 rounded" 
          placeholder="Nombre del lugar" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
        <select className="border p-2 rounded" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="veterinaria">Veterinaria</option>
          <option value="peluqueria">Peluquería</option>
          <option value="petshop">Petshop</option>
        </select>
        <input className="border p-2 rounded" placeholder="Latitud" value={latitud} onChange={(e) => setLatitud(e.target.value)} required />
        <input className="border p-2 rounded" placeholder="Longitud" value={longitud} onChange={(e) => setLongitud(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Guardar Comercio</button>
      </form>
      {mensaje && <p className="text-center font-bold text-blue-600">{mensaje}</p>}
    </div>
  );
};