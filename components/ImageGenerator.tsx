import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Image as ImageIcon, Sparkles, Download, AlertCircle } from 'lucide-react';
import { ImageGenerationResult } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt + " style of a high quality pet portrait, cute, friendly" }] // Append some context
        }
      });

      let foundImage = false;
      
      if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  const base64Str = part.inlineData.data;
                  const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64Str}`;
                  setResult({
                      url: imageUrl,
                      prompt: prompt,
                      timestamp: Date.now()
                  });
                  foundImage = true;
                  break;
              }
          }
      }

      if (!foundImage) {
        const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
        if (textPart && textPart.text) {
             setError(textPart.text);
        } else {
             setError("No se pudo generar la imagen. Intenta describir a tu mascota de otra forma.");
        }
      }

    } catch (err: any) {
      console.error("Image gen error", err);
      setError(err.message || "Error al generar la imagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
                Estudio Creativo de Mascotas
            </h2>
            <p className="text-slate-400">
                Crea retratos artísticos de tu mascota para su identificación o redes sociales.
            </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe a tu mascota... (ej: Golden Retriever con pañuelo rojo en el espacio)"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none text-white placeholder-slate-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        isGenerating || !prompt
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-600 to-rose-600 hover:opacity-90 text-white shadow-lg shadow-orange-600/20'
                    }`}
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generar
                        </>
                    )}
                </button>
            </div>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}

        {result && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="relative group">
                    <img 
                        src={result.url} 
                        alt={result.prompt} 
                        className="w-full h-auto max-h-[600px] object-contain bg-black/50" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <a 
                            href={result.url} 
                            download={`dnipets-art-${Date.now()}.png`}
                            className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Descargar
                        </a>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-800">
                    <p className="text-sm text-slate-400 font-mono line-clamp-2">Prompt: {result.prompt}</p>
                </div>
            </div>
        )}

        {!result && !isGenerating && !error && (
             <div className="flex flex-col items-center justify-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <p>Visualiza a tu mascota como nunca antes.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;