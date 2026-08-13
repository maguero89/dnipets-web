import React, { useState } from 'react';
import { ArrowLeft, Bot, Send, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface BetaVetAIAssistantProps {
  onBack: () => void;
}

interface ChatMsg {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const BetaVetAIAssistant: React.FC<BetaVetAIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg: ChatMsg = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || '';
      
      if (!apiKey) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: '¡Hola! Soy VetAI. Para respuestas avanzadas de IA en vivo, se requiere la API Key de Gemini configurada. Sin embargo, te sugiero consultar siempre con un profesional veterinario ante cualquier síntoma urgente.'
        }]);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: 'Eres VetAI, el asistente veterinario inteligente de la aplicación DNIPETS. Tu tono es empático, profesional y claro. Ayudas a los dueños con nutrición, vacunación y cuidados básicos para sus perros y gatos. Recuerda aclarar que tus consejos no reemplazan la atención médica veterinaria presencial.'
      });

      const result = await model.generateContent(userText);
      const responseText = result.response.text() || 'No pude procesar tu consulta.';
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
    } catch (err: any) {
      console.error('VetAI Error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Hubo un inconveniente al conectar con VetAI. Inténtalo nuevamente en unos instantes.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 font-sans">
      {/* HEADER */}
      <div className="bg-brand-navy pt-12 pb-4 px-4 flex items-center gap-3 text-white shadow-md z-10">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Bot className="text-primary" size={24} />
          <h2 className="font-black text-lg">VetAI Assistant</h2>
        </div>
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-16 px-6">
            <Sparkles size={48} className="mx-auto mb-3 text-primary/60 animate-pulse" />
            <p className="font-bold text-brand-navy text-lg mb-1">¡Hola! Soy tu asistente VetAI</p>
            <p className="text-xs text-gray-500">Pregúntame sobre salud, vacunación, nutrición o cuidados para tu mascota.</p>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-brand-navy text-white rounded-tr-none shadow-md font-medium' 
                : 'bg-white text-brand-navy shadow-sm rounded-tl-none border border-slate-100 font-normal'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 border border-slate-100">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
          <input
            className="flex-1 bg-transparent text-brand-navy text-sm focus:outline-none placeholder:text-gray-400"
            placeholder="Escribe tu consulta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-full transition-colors disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
