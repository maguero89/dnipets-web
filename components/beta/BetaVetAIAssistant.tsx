import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bot, Send, Image as ImageIcon, X, Loader2, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { PawPrintBackground } from '../PawPrintBackground';

interface BetaVetAIAssistantProps {
  onBack: () => void;
}

interface ChatMsg {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export const BetaVetAIAssistant: React.FC<BetaVetAIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy tu asistente **VetAI** de DNIPETS 🐾\n\n¿En qué puedo ayudarte hoy? Puedo orientarte sobre salud, vacunación, nutrición o identificar la raza de tu mascota si me envías una foto.',
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  const fileToGenerativePart = (base64Data: string, mimeType: string) => {
    return {
      inlineData: {
        data: base64Data.split(',')[1],
        mimeType
      },
    };
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: 'Historial reiniciado. ¿Qué nueva consulta tienes sobre tu mascota?',
      }
    ]);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping) return;

    const userText = input.trim();
    const currentImage = selectedImage;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      image: currentImage || undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || '';
      
      if (!apiKey) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: '⚠️ Faltan las credenciales de VetAI. Recuerda que ante cualquier síntoma o emergencia debes consultar siempre con un médico veterinario presencial.'
        }]);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: 'Eres VetAI, el asistente veterinario inteligente oficial de la aplicación DNIPETS. Tu tono es cálido, profesional, empático y claro. Ayudas a los dueños con nutrición, vacunación, conducta y cuidados básicos para sus perros y gatos. Identificas razas y analizas posibles síntomas a partir de imágenes. SIEMPRE debes recordar amablemente que tus consejos no reemplazan la atención médica veterinaria presencial.'
      });

      const promptParts: any[] = [];
      if (userText) promptParts.push(userText);
      if (currentImage) {
        const mimeType = currentImage.split(';')[0].split(':')[1] || 'image/jpeg';
        promptParts.push(fileToGenerativePart(currentImage, mimeType));
      }

      const responseId = (Date.now() + 1).toString();
      
      // Streaming response
      const result = await model.generateContentStream(promptParts);
      
      let fullText = '';
      setMessages(prev => [...prev, { id: responseId, role: 'model', text: '...' }]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        setMessages(prev => prev.map(m => m.id === responseId ? { ...m, text: fullText } : m));
      }
    } catch (err: any) {
      console.error('VetAI Error:', err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Ocurrió un inconveniente temporal al conectar con VetAI. Por favor vuelve a intentarlo.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 font-sans relative overflow-hidden">
      <PawPrintBackground />

      {/* HEADER MATCHING ANDROID APP */}
      <div className="bg-[#0d1b40] pt-12 pb-4 px-4 flex items-center justify-between text-white shadow-md z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#00D1C6] border border-white/10 shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight leading-tight">Chat VetAI</h2>
            <p className="text-[11px] text-slate-300 font-normal">Asistente veterinario 24/7</p>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
          title="Borrar conversación"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4 z-10">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5 items-end`}>
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-full bg-[#00D1C6] text-[#0d1b40] flex items-center justify-center shrink-0 mb-1 shadow-xs">
                <Bot size={16} />
              </div>
            )}

            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#0d1b40] text-white rounded-br-xs shadow-md font-medium' 
                : 'bg-white text-slate-800 shadow-sm rounded-bl-xs border border-slate-100 font-normal'
            }`}>
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="Adjunto" 
                  className="w-full max-h-48 object-cover rounded-xl mb-2.5 border border-slate-100" 
                />
              )}
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#00D1C6] text-[#0d1b40] flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white p-3.5 rounded-2xl rounded-bl-xs shadow-sm flex items-center gap-1.5 border border-slate-100">
              <span className="w-2 h-2 bg-[#00D1C6] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#00D1C6] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-[#00D1C6] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR WITH IMAGE UPLOAD */}
      <div className="p-3 bg-white border-t border-slate-200 z-20">
        {selectedImage && (
          <div className="mb-2 relative inline-block">
            <img 
              src={selectedImage} 
              alt="Vista previa" 
              className="h-16 w-16 object-cover rounded-xl border-2 border-[#00D1C6]" 
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#00D1C6]/50 transition-all">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-[#00D1C6] hover:bg-white rounded-full transition-colors"
            title="Adjuntar foto"
          >
            <ImageIcon size={20} />
          </button>

          <input
            className="flex-1 bg-transparent text-brand-navy text-sm focus:outline-none placeholder:text-gray-400 py-1"
            placeholder="Escribe tu consulta o sube una foto..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />

          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isTyping}
            className="bg-[#00D1C6] hover:bg-[#00b8ae] text-[#0d1b40] p-2.5 rounded-full transition-all disabled:opacity-40 shadow-xs"
          >
            {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
