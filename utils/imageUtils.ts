/**
 * Convierte y comprime cualquier archivo de imagen (incluyendo HEIC / fotos de iPhone o PNGs pesados)
 * a un DataURL en formato JPEG de resolución optimizada (máx 1000px).
 */
export async function processImageFile(file: File, maxWidth: number = 1000, quality: number = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si el archivo no es de tipo imagen, intentar leerlo normalmente
    if (file && !file.type.startsWith('image/') && !file.name.match(/\.(heic|heif|png|jpg|jpeg|webp)$/i)) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = (err) => {
        // Fallback: Si no se puede renderizar en canvas, devolver resultado base64 directo
        resolve(e.target?.result as string);
      };
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

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
            resolve(e.target?.result as string);
            return;
          }

          // Fondo blanco por si la imagen tiene transparencia
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Exportar como JPEG comprimido
          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegDataUrl);
        } catch (err) {
          resolve(e.target?.result as string);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
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
