/**
 * Convierte y comprime cualquier archivo de imagen (incluyendo fotos pesadas de Xiaomi/Redmi/Poco 50MP/108MP, HEIC de iPhone o PNGs)
 * a un DataURL en formato JPEG de resolución optimizada (máx 1000px).
 * Usa URL.createObjectURL para evitar picos de memoria en navegadores móviles.
 */
export async function processImageFile(file: File, maxWidth: number = 1000, quality: number = 0.85): Promise<string> {
  if (!file) throw new Error("No se seleccionó ningún archivo de imagen.");

  return new Promise((resolve, reject) => {
    // 1. Método preferido de bajo consumo de memoria: URL.createObjectURL
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          let width = img.width || 800;
          let height = img.height || 600;

          // Redimensionar manteniendo aspecto si supera el ancho máximo
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

          // Fondo blanco por si la imagen tiene transparencia
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Exportar como JPEG comprimido
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
 * Convierte un DataURL Base64 a un objeto Blob de JavaScript para subidas a Supabase Storage.
 */
export function dataURLtoBlob(dataUrl: string): Blob {
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
