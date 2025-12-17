import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, Volume2, Video, VideoOff } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { arrayBufferToBase64, decodeAudioData } from '../utils/audio';

// Constants for audio processing
const AUDIO_INPUT_SAMPLE_RATE = 16000;
const AUDIO_OUTPUT_SAMPLE_RATE = 24000;
const FRAME_RATE = 1; 
const JPEG_QUALITY = 0.5;

const LiveInterface: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [volume, setVolume] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const nextStartTimeRef = useRef<number>(0);
  const outputContextRef = useRef<AudioContext | null>(null);
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const cleanup = async () => {
    setIsActive(false);
    setStatus('disconnected');

    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (inputSourceRef.current) {
        inputSourceRef.current.disconnect();
        inputSourceRef.current = null;
    }
    if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
        await audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if (outputContextRef.current) {
        await outputContextRef.current.close();
        outputContextRef.current = null;
    }
    
    if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
    }
    if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
        videoStreamRef.current = null;
    }
    sessionPromiseRef.current = null;
  };

  useEffect(() => {
    return () => {
        cleanup();
    };
  }, []);

  const toggleSession = async () => {
    if (isActive) {
        await cleanup();
        return;
    }

    try {
        setStatus('connecting');
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: AUDIO_INPUT_SAMPLE_RATE
        });
        
        inputSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: AUDIO_OUTPUT_SAMPLE_RATE
        });
        nextStartTimeRef.current = outputContextRef.current.currentTime;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setStatus('connected');
                    setIsActive(true);
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && outputContextRef.current) {
                        try {
                            const audioData = base64ToUint8Array(base64Audio);
                            const audioBuffer = await decodeAudioData(
                                audioData, 
                                outputContextRef.current,
                                AUDIO_OUTPUT_SAMPLE_RATE
                            );
                            
                            const source = outputContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputContextRef.current.destination);
                            
                            const now = outputContextRef.current.currentTime;
                            const startTime = Math.max(now, nextStartTimeRef.current);
                            source.start(startTime);
                            nextStartTimeRef.current = startTime + audioBuffer.duration;
                        } catch (e) {
                            console.error("Error decoding audio", e);
                        }
                    }
                    if (base64Audio) setVolume(Math.random() * 100);
                    else setTimeout(() => setVolume(0), 200);
                },
                onclose: () => {
                    cleanup();
                },
                onerror: (err) => {
                    console.error("Live API Error:", err);
                    cleanup();
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                },
                systemInstruction: "Eres un asistente de voz experto en mascotas para DNIPETS. Eres amigable y breve. Ayudas a los dueños con consejos mientras pasean o juegan."
            }
        });

        sessionPromiseRef.current = sessionPromise;

        processorRef.current.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            const uint8 = new Uint8Array(pcm16.buffer);
            const base64Data = arrayBufferToBase64(uint8.buffer);
            
            sessionPromise.then(session => {
                session.sendRealtimeInput({
                    media: {
                        mimeType: 'audio/pcm;rate=16000',
                        data: base64Data
                    }
                });
            });
        };

        inputSourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);

    } catch (error) {
        console.error("Failed to start session:", error);
        cleanup();
    }
  };

  const toggleVideo = async () => {
    if (!isActive) return;

    if (isVideoEnabled) {
        if (videoStreamRef.current) {
            videoStreamRef.current.getTracks().forEach(t => t.stop());
            videoStreamRef.current = null;
        }
        if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
        }
        setIsVideoEnabled(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoStreamRef.current = stream;
            if (videoElementRef.current) {
                videoElementRef.current.srcObject = stream;
                videoElementRef.current.play();
            }
            setIsVideoEnabled(true);
            
            const canvas = canvasElementRef.current;
            const video = videoElementRef.current;
            const ctx = canvas?.getContext('2d');
            
            if (canvas && video && ctx) {
                frameIntervalRef.current = window.setInterval(() => {
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        ctx.drawImage(video, 0, 0);
                        const base64Image = canvas.toDataURL('image/jpeg', JPEG_QUALITY).split(',')[1];
                        
                        sessionPromiseRef.current?.then(session => {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: 'image/jpeg',
                                    data: base64Image
                                }
                            });
                        });
                    }
                }, 1000 / FRAME_RATE);
            }
        } catch (e) {
            console.error("Video error:", e);
        }
    }
  };

  function base64ToUint8Array(base64: string): Uint8Array {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      {/* Background Pulse */}
      {status === 'connected' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ transform: `scale(${1 + volume / 100})` }}></div>
        </div>
      )}

      {/* Main Control Hub */}
      <div className="z-10 flex flex-col items-center gap-8">
        
        {/* Status Indicator */}
        <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all ${
            status === 'connected' 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                : status === 'connecting'
                ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}>
            <div className={`w-2 h-2 rounded-full ${
                status === 'connected' ? 'bg-emerald-500 animate-pulse' : 
                status === 'connecting' ? 'bg-yellow-500 animate-bounce' : 'bg-slate-500'
            }`} />
            <span className="font-medium text-sm uppercase tracking-wide">
                {status === 'connected' ? 'Consejero en Vivo Activo' : status === 'connecting' ? 'Conectando...' : 'Consejero en Vivo'}
            </span>
        </div>

        {/* Video Preview */}
        <video ref={videoElementRef} className={`w-64 h-48 rounded-xl bg-black object-cover border-2 border-slate-700 shadow-2xl transition-all duration-500 ${isVideoEnabled ? 'opacity-100 scale-100' : 'opacity-0 scale-90 h-0 w-0'}`} muted playsInline />
        <canvas ref={canvasElementRef} className="hidden" />

        {/* Central Button */}
        <button
            onClick={toggleSession}
            disabled={status === 'connecting'}
            className={`relative group w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                isActive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                : 'bg-gradient-to-r from-orange-500 to-rose-500 hover:scale-105 shadow-orange-500/30'
            }`}
        >
            <div className={`absolute inset-0 rounded-full border-2 border-white/20 scale-110 group-hover:scale-125 transition-transform duration-700 ${isActive ? 'animate-ping opacity-20' : 'opacity-0'}`} />
            
            {isActive ? (
                <MicOff className="w-10 h-10 text-white" />
            ) : (
                <Mic className="w-10 h-10 text-white" />
            )}
        </button>

        {/* Instructions */}
        <p className="text-slate-400 text-center max-w-md">
            {isActive 
                ? "Te escucho. Pregúntame sobre el comportamiento de tu mascota." 
                : "Toca el micrófono para hablar con el experto IA en tiempo real."}
        </p>

        {/* Controls */}
        {isActive && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                 <button 
                    onClick={toggleVideo}
                    className={`p-4 rounded-full border transition-all ${
                        isVideoEnabled 
                        ? 'bg-white text-indigo-900 border-white hover:bg-slate-200' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                 >
                    {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                 </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LiveInterface;