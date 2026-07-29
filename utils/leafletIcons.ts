import L from 'leaflet';

// 1. MARCADOR MASCOTA PERDIDA (Círculo rojo sólido con icono de alerta)
export const createLostPetIcon = () => L.divIcon({
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background-color: #dc2626;
      border: 2px solid #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(220,38,38,0.5);
      color: white;
      cursor: pointer;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
  `,
  className: 'custom-map-pin',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

// 2. MARCADOR MASCOTA EN ADOPCIÓN (Círculo violeta sólido con corazón)
export const createAdoptionPetIcon = () => L.divIcon({
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background-color: #a855f7;
      border: 2px solid #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(168,85,247,0.5);
      color: white;
      cursor: pointer;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
  `,
  className: 'custom-map-pin',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

// 3. MARCADOR GENERAL DE MASCOTA (Función Helper)
export const createPetMarkerIcon = (photoUrl: string, status: 'lost' | 'adoption', name: string) => {
  if (status === 'lost') return createLostPetIcon();
  return createAdoptionPetIcon();
};

// 4. MARCADORES DE COMERCIOS (Veterinaria, Petshop, Peluquería)
export const createEstablishmentMarkerIcon = (
  nombre: string,
  rubro: 'veterinaria' | 'petshop' | 'peluqueria' | string
) => {
  let bgColor = '#00d1c6';
  let iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

  if (rubro === 'veterinaria') {
    bgColor = '#dc2626';
    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>';
  } else if (rubro === 'peluqueria') {
    bgColor = '#9333ea';
    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/></svg>';
  }

  return L.divIcon({
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background-color: ${bgColor};
        border: 2px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        color: white;
        cursor: pointer;
      ">
        ${iconSvg}
      </div>
    `,
    className: 'custom-map-pin',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// 5. MARCADOR GPS UBICACIÓN DE USUARIO (Punto azul sólido)
export const homeIcon = L.divIcon({
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background-color: #2563eb;
      border: 2.5px solid #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(37,99,235,0.5);
      cursor: pointer;
    ">
      <div style="width: 7px; height: 7px; background-color: #ffffff; border-radius: 50%;"></div>
    </div>
  `,
  className: 'custom-map-pin',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

export const defaultIcon = createLostPetIcon();

export const getDeterministicOffset = (id: string): [number, number] => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const offsetLat = ((hash % 100) / 20000) - 0.0025;
  const offsetLng = (((hash >> 5) % 100) / 20000) - 0.0025;
  return [offsetLat, offsetLng];
};
