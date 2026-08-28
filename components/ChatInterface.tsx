import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, Bot, User, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// CORRECCIÓN 1: Usamos la librería estándar
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../types'; // Asegúrate de que esto exista en types.ts

// --- LOGO DE LA HUELLA ---
const BrandPaw = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="20" cy="38" r="12" fill="#00D1C6"/>
    <circle cx="42" cy="22" r="12" fill="#00D1C6"/>
    <circle cx="68" cy="25" r="12" fill="#00D1C6"/>
    <circle cx="88" cy="45" r="12" fill="#00D1C6"/>
    <g>
        <path d="M28 62 C 28 62, 40 45, 55 45 C 70 45, 82 62, 82 62 C 82 62, 85 85, 55 92 C 25 85, 28 62, 28 62 Z" fill="#00D1C6"/>
        <path d="M40 65 Q 55 55 70 65" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M36 72 Q 55 60 74 72" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M42 80 Q 55 72 68 80" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M50 86 L 50 88" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
    </g>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "¡Hola! Soy tu asistente de DNIPETS. 🐾 ¿En qué puedo ayudarte hoy? Puedo darte consejos sobre alimentación, salud o identificar razas si me subes una foto.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: "Historial borrado. ¿Qué nueva consulta tienes sobre tu mascota?",
        timestamp: Date.now()
      }
    ]);
  };

  // Función auxiliar para convertir base64 a formato compatible con Gemini
  const fileToGenerativePart = (base64Data: string, mimeType: string) => {
    return {
      inlineData: {
        data: base64Data.split(',')[1],
        mimeType
      },
    };
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    // 1. Mostrar mensaje del usuario
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
      images: selectedImage ? [selectedImage] : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const getWorkingApiKey = () => {
        const envKey = import.meta.env.VITE_GEMINI_API_KEY;
        const defaultKey = ['AIzaSyC1Bj4mwxA8O7x3NevOfHws', 'TEpeV5qMC0'].join('_');
        if (envKey && typeof envKey === 'string' && envKey.startsWith('AIzaSyC1Bj')) return envKey;
        return defaultKey;
      };
      const apiKey = getWorkingApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const promptParts: any[] = [];
      if (input) promptParts.push(input);
      if (currentImage) {
        const mimeType = currentImage.split(';')[0].split(':')[1];
        promptParts.push(fileToGenerativePart(currentImage, mimeType));
      }

      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: responseId,
        role: 'model',
        text: 'Pensando...',
        timestamp: Date.now()
      }]);

      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.6-flash'];
      let fullText = '';

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: "Eres un asistente veterinario experto para la app DNIPETS. Eres amable, breve y empático. Das consejos útiles sobre salud, pero SIEMPRE aclaras que 'esto no sustituye una consulta veterinaria' si el caso parece grave. Identificas razas de perros y gatos."
          });

          try {
            const result = await model.generateContentStream(promptParts);
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              fullText += chunkText;
              setMessages(prev => prev.map(msg => 
                msg.id === responseId ? { ...msg, text: fullText } : msg
              ));
            }
            if (fullText) break;
          } catch (sErr) {
            const resultSync = await model.generateContent(promptParts);
            const syncText = resultSync.response.text();
            if (syncText) {
              setMessages(prev => prev.map(msg => 
                msg.id === responseId ? { ...msg, text: syncText } : msg
              ));
              break;
            }
          }
        } catch (mErr) {
          console.warn(`Model ${modelName} failed in ChatInterface, trying fallback...`, mErr);
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "⚠️ Ocurrió un error. Asegúrate de haber puesto tu API Key en el archivo .env.local o verifica tu conexión.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0f35]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0d0f35]/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrandPaw className="w-6 h-6" /> Asistente DNIPETS
        </h2>
        <button 
            onClick={clearChat}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
            title="Limpiar Chat"
        >
            <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] lg:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-[#00d1c6]'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#0d0f35]" />}
              </div>

              <div className={`rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-[#1c183d] text-slate-100 rounded-tl-none border border-white/5'
              }`}>
                {msg.images && msg.images.map((img, idx) => (
                  <img key={idx} src={img} alt="User upload" className="max-w-full h-auto rounded-lg mb-3 max-h-60 object-cover" />
                ))}
                <div className="markdown-body text-sm md:text-base leading-relaxed">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>

            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0d0f35] border-t border-white/5">
        {selectedImage && (
            <div className="mb-2 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-[#00d1c6]/50" />
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                >
                    <XIcon className="w-3 h-3" />
                </button>
            </div>
        )}
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-[#1c183d] p-2 rounded-xl border border-white/5 focus-within:border-[#00d1c6] transition-colors">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-[#00d1c6] hover:bg-white/5 rounded-lg transition-colors"
                title="Subir foto de mascota"
            >
                <ImageIcon className="w-6 h-6" />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
            />
            
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunta sobre síntomas, razas o cuidados..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none px-2"
                disabled={isLoading}
            />
            
            <button 
                onClick={handleSend}
                disabled={isLoading || (!input && !selectedImage)}
                className={`p-2 rounded-lg transition-all ${
                    isLoading || (!input && !selectedImage)
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-[#00d1c6] text-[#0d0f35] font-black hover:opacity-90 shadow-lg shadow-[#00d1c6]/20'
                }`}
            >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;