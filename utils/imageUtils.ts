export const DEFAULT_DOG_PHOTO = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600';
export const DEFAULT_CAT_PHOTO = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600';

/**
 * Retorna la foto por defecto apropiada según la especie ('dog' | 'cat' | 'CANINA' | 'FELINA' | etc.)
 */
export function getDefaultPetPhoto(species?: string): string {
  const s = (species || '').toLowerCase();
  if (s === 'cat' || s === 'gato' || s === 'felina' || s === 'felino') {
    return DEFAULT_CAT_PHOTO;
  }
  return DEFAULT_DOG_PHOTO;
}

/**
 * Garantiza que la imagen de la mascota sea válida y del animal correcto.
 * Si la foto es nula, vacía o es el perro por defecto pero la especie es un gato,
 * retorna la foto por defecto del gato.
 */
export function getPetPhotoUrl(photoUrl?: string | null, species?: string): string {
  const s = (species || '').toLowerCase();
  const isCat = s === 'cat' || s === 'gato' || s === 'felina' || s === 'felino';

  if (!photoUrl || photoUrl.trim() === '') {
    return getDefaultPetPhoto(species);
  }

  // Si la foto guardada era el Beagle generico por defecto pero la mascota es un Gato:
  if (photoUrl.includes('1543466835-00a7907e9de1') && isCat) {
    return DEFAULT_CAT_PHOTO;
  }

  return photoUrl;
}

/**
 * Convierte y comprime cualquier archivo de imagen (incluyendo fotos de Motorola/Xiaomi/Redmi 50MP/108MP, HEIC de iPhone o PNGs)
 * a un DataURL en formato JPEG de resolución optimizada (máx 1000px).
 * Utiliza createImageBitmap para evitar problemas de memoria en dispositivos móviles Motorola/Android.
 */
export async function processImageFile(file: File, maxWidth: number = 1000, quality: number = 0.85): Promise<string> {
  if (!file) throw new Error("No se seleccionó ningún archivo de imagen.");

  // 1. Método preferido para Android (Motorola/Xiaomi/Samsung): createImageBitmap (rendimiento nativo y bajo consumo RAM)
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      let width = bitmap.width || 800;
      let height = bitmap.height || 600;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();
        return canvas.toDataURL('image/jpeg', quality);
      }
    } catch (bitmapErr) {
      console.warn("createImageBitmap no disponible o falló para este formato, probando HTMLImageElement:", bitmapErr);
    }
  }

  // 2. Método estándar fallback con HTMLImageElement & URL.createObjectURL
  return new Promise((resolve, reject) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          let width = img.width || 800;
          let height = img.height || 600;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            fallbackFileReader(file, resolve, reject);
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          URL.revokeObjectURL(objectUrl);
          resolve(jpegDataUrl);
        } catch (canvasErr) {
          console.warn("Error en Canvas resizing, usando fallback FileReader:", canvasErr);
          URL.revokeObjectURL(objectUrl);
          fallbackFileReader(file, resolve, reject);
        }
      };

      img.onerror = (err) => {
        console.warn("Error cargando imageObject, usando fallback FileReader:", err);
        URL.revokeObjectURL(objectUrl);
        fallbackFileReader(file, resolve, reject);
      };

      img.src = objectUrl;
    } catch (e) {
      fallbackFileReader(file, resolve, reject);
    }
  });
}

function fallbackFileReader(file: File, resolve: (val: string) => void, reject: (err: any) => void) {
  const reader = new FileReader();
  reader.onerror = (err) => reject(new Error("No se pudo leer el archivo de la galería."));
  reader.onload = (e) => {
    if (e.target?.result) {
      resolve(e.target.result as string);
    } else {
      reject(new Error("No se obtuvo contenido de la imagen."));
    }
  };
  reader.readAsDataURL(file);
}

/**
 * Convierte un DataURL Base64 a un objeto Blob de manera asíncrona y ultra eficiente para evitar picos de memoria.
 */
export async function dataURLtoBlob(dataUrl: string): Promise<Blob> {
  try {
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch (e) {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}
