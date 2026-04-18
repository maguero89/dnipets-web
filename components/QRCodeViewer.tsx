import React from 'react';
import { Download, Share2, X } from 'lucide-react';

interface QRCodeViewerProps {
  petId: string;
  petName: string;
  onClose: () => void;
}

export const QRCodeViewer: React.FC<QRCodeViewerProps> = ({ petId, petName, onClose }) => {
  const qrUrl = `https://www.dnipets.com/?id=${petId}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${petName}_DNIPETS.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el QR:", error);
      alert("Hubo un error al intentar descargar la imagen.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${petName} en DNIPETS`,
          text: `Mira el perfil de mi mascota ${petName} en DNIPETS.`,
          url: qrUrl,
        });
      } catch (error) {
        console.error("Error compartiendo:", error);
      }
    } else {
      navigator.clipboard.writeText(qrUrl);
      alert("Enlace copiado al portapapeles.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d0f35]/95 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div className="bg-[#1c183d] w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-6 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Código QR</h3>
          <p className="text-[#00d1c6] text-xs font-bold uppercase tracking-widest">{petName}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl mx-auto w-fit shadow-[0_0_40px_rgba(0,209,198,0.2)]">
          <img src={qrImageUrl} alt={`QR de ${petName}`} className="w-48 h-48 rounded-xl object-contain" />
        </div>

        <div className="text-center">
          <p className="text-white/60 text-xs px-4">Escanea el código para acceder al perfil público.</p>
        </div>

        <div className="flex gap-4 pt-4 border-t border-white/10">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-[#00d1c6] hover:bg-[#00b8ae] text-[#0d0f35] p-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-colors"
          >
            <Download size={16} />
            Descargar
          </button>
          
          <button 
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-xs border border-white/10 transition-colors"
          >
            <Share2 size={16} />
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
};
