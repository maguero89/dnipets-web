import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Home,
  Map as MapIcon,
  User,
  Heart,
  MessageCircle,
  Phone,
  Syringe,
  ShoppingBag,
  Scissors,
  Loader2,
  Navigation,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Pet, Establishment, UserProfile } from '../../types';
import { petService } from '../../services/petService';
import {
  defaultIcon,
  homeIcon,
  createPetMarkerIcon,
  createEstablishmentMarkerIcon,
  getDeterministicOffset
} from '../../utils/leafletIcons';

// Config default icon
L.Marker.prototype.options.icon = defaultIcon;

interface BetaMapViewProps {
  profile: UserProfile;
  onGoHome: () => void;
  onViewProfile: () => void;
  onOpenPublicPet?: (petId: string) => void;
}

// Component to dynamically re-center map when location is found
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const BetaMapView: React.FC<BetaMapViewProps> = ({
  profile,
  onGoHome,
  onViewProfile,
  onOpenPublicPet
}) => {
  const [location, setLocation] = useState<[number, number]>([-34.6037, -58.3816]); // Default BsAs/Mendoza default
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [communityPets, setCommunityPets] = useState<Pet[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Get user GPS position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
        setLoadingLoc(false);
      },
      (err) => {
        console.warn("Geo error:", err);
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true }
    );

    // Fetch lost pets and establishments
    Promise.all([
      petService.getCommunityPets(),
      petService.getEstablishments()
    ]).then(([pets, ests]) => {
      setCommunityPets(pets);
      setEstablishments(ests);
      setLoadingData(false);
    }).catch(err => {
      console.error("Error loading map data:", err);
      setLoadingData(false);
    });
  }, []);

  return (
    <div className="flex-1 bg-slate-100 flex flex-col relative h-full w-full overflow-hidden animate-in fade-in duration-300">
      
      {/* HEADER OVERLAY */}
      <div className="absolute top-8 left-4 right-4 z-[999] bg-[#0d0f35]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#00d1c6]/20 rounded-xl text-[#00d1c6]">
            <MapIcon size={18} />
          </div>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-wider">Mapa Comunitario</h2>
            <p className="text-[9px] text-[#00d1c6] font-bold uppercase tracking-widest">Mascotas & Servicios</p>
          </div>
        </div>

        {loadingLoc && (
          <div className="flex items-center gap-1 text-[10px] text-[#00d1c6] font-bold animate-pulse">
            <Navigation size={12} className="animate-spin" />
            <span>Obteniendo GPS...</span>
          </div>
        )}
      </div>

      {/* LEYENDA DEL MAPA */}
      <div className="absolute top-24 right-4 z-[999] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200 text-[10px] space-y-2 max-w-[160px]">
        <div className="font-black text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-widest text-[9px]">Leyenda</div>
        
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <div className="w-4 h-4 rounded-full bg-[#dc2626] border border-white shadow-sm flex items-center justify-center text-white flex-shrink-0">
            <Plus size={10} strokeWidth={3.5} />
          </div>
          <span className="text-[10px]">Veterinarias</span>
        </div>

        <div className="flex items-center gap-2 font-bold text-slate-700">
          <div className="w-4 h-4 rounded-full bg-[#00d1c6] border border-white shadow-sm flex items-center justify-center text-white flex-shrink-0">
            <ShoppingBag size={9} strokeWidth={2.5} />
          </div>
          <span className="text-[10px]">Petshops</span>
        </div>

        <div className="flex items-center gap-2 font-bold text-slate-700">
          <div className="w-4 h-4 rounded-full bg-[#9333ea] border border-white shadow-sm flex items-center justify-center text-white flex-shrink-0">
            <Scissors size={9} strokeWidth={2.5} />
          </div>
          <span className="text-[10px]">Peluquerías</span>
        </div>

        <div className="flex items-center gap-2 font-bold text-slate-700">
          <div className="w-4 h-4 rounded-full bg-[#dc2626] border border-white shadow-sm flex items-center justify-center text-white flex-shrink-0">
            <AlertTriangle size={9} strokeWidth={2.5} />
          </div>
          <span className="text-[10px]">Perdidas</span>
        </div>

        <div className="flex items-center gap-2 font-bold text-slate-700">
          <div className="w-4 h-4 rounded-full bg-[#a855f7] border border-white shadow-sm flex items-center justify-center text-white flex-shrink-0">
            <Heart size={9} fill="currentColor" />
          </div>
          <span className="text-[10px]">En Adopción</span>
        </div>
      </div>

      {/* MAPA MAIN CONTAINER */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={location}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          <MapUpdater center={location} />

          {/* USER LOCATION MARKER */}
          <Marker position={location} icon={homeIcon}>
            <Popup>
              <div className="text-center font-bold text-xs p-1 text-[#0d0f35]">
                📍 Tu ubicación actual
              </div>
            </Popup>
          </Marker>

          {/* PETS MARKERS (Perdidos / Adopción) */}
          {communityPets.map(pet => {
            let position: [number, number];
            if (pet.lastLat && pet.lastLng) {
              position = [pet.lastLat, pet.lastLng];
            } else {
              const [offLat, offLng] = getDeterministicOffset(pet.id);
              position = [location[0] + offLat, location[1] + offLng];
            }

            const iconToUse = createPetMarkerIcon(pet.photoUrl, pet.status, pet.name);

            return (
              <Marker key={pet.id} position={position} icon={iconToUse}>
                <Popup>
                  <div className="text-center text-slate-900 p-1 min-w-[140px]">
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={pet.name} className="w-12 h-12 rounded-2xl object-cover mx-auto mb-2 shadow-sm border border-slate-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-400 mx-auto mb-2">
                        {pet.name.charAt(0)}
                      </div>
                    )}
                    <strong className="block text-sm font-black text-[#0d0f35] leading-tight">{pet.name}</strong>
                    <span className={`inline-block my-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      pet.status === 'lost' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {pet.status === 'lost' ? '⚠️ ¡PERDIDO!' : '💜 EN ADOPCIÓN'}
                    </span>
                    
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Hola, vi la publicación de ${pet.name} en el mapa de DNI-PETS.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-transform active:scale-95 shadow-sm text-decoration-none"
                    >
                      <MessageCircle size={12} /> Contactar Dueño
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* ESTABLECIMIENTOS / COMERCIOS MARKERS */}
          {establishments.map(est => {
            const iconToUse = createEstablishmentMarkerIcon(est.nombre, est.rubro);

            return (
              <Marker key={est.id} position={[est.lat, est.lng]} icon={iconToUse}>
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <div className="flex items-center gap-2 mb-1">
                      {est.rubro === 'veterinaria' && <div className="text-red-600"><Syringe size={16} /></div>}
                      {est.rubro === 'petshop' && <div className="text-[#00d1c6]"><ShoppingBag size={16} /></div>}
                      {est.rubro === 'peluqueria' && <div className="text-purple-600"><Scissors size={16} /></div>}
                      <h4 className="font-black text-[#0d0f35] text-xs leading-tight uppercase">{est.nombre}</h4>
                    </div>
                    {est.direccion && <p className="text-[10px] text-slate-500 font-medium mb-1">{est.direccion}</p>}
                    {est.resena && <p className="text-[10px] text-slate-400 italic mb-2">"{est.resena}"</p>}
                    {est.telefono && (
                      <a
                        href={`tel:${est.telefono}`}
                        className="flex items-center justify-center gap-1 bg-[#0d0f35] hover:bg-[#1c183d] text-white p-2 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                      >
                        <Phone size={12} className="text-[#00d1c6]" /> Llamar ahora
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* BOTTOM NAV BAR */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-2 pb-4 z-[999]">
        <button onClick={onGoHome} className="flex flex-col items-center gap-1 text-slate-400">
          <Home size={24} />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#0d0f35]">
          <MapIcon size={24} className="text-[#00d1c6]" />
          <span className="text-[10px] font-black text-[#0d0f35]">Mapa</span>
        </button>
        <button onClick={onGoHome} className="flex flex-col items-center gap-1 text-slate-400">
          <Heart size={24} />
          <span className="text-[10px] font-medium">Adopción</span>
        </button>
        <button onClick={onViewProfile} className="flex flex-col items-center gap-1 text-slate-400">
          <User size={24} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>

    </div>
  );
};
