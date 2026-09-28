import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface VoiceControlsProps {
  onTranscribe: (text: string) => void;
  lastPersonaResponse?: string;
  isLiveMode: boolean;
  onToggleLive: () => void;
}

export function VoiceControls({ onTranscribe, lastPersonaResponse, isLiveMode, onToggleLive }: VoiceControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64Audio }),
            });
            const data = await res.json();
            if (data.text) onTranscribe(data.text);
          } catch (err) {
            console.error('Transcription error:', err);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access error:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const speakResponse = async () => {
    if (!lastPersonaResponse || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lastPersonaResponse }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-2 rounded-lg transition-colors ${
          isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'
        }`}
        title={isRecording ? 'Stop Recording' : 'Transcribe Mic Input'}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
      </button>

      <button
        onClick={speakResponse}
        disabled={!lastPersonaResponse || isSpeaking}
        className={`p-2 rounded-lg transition-colors ${
          isSpeaking ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30'
        }`}
        title="Hear Response (TTS)"
      >
        {isSpeaking ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
      </button>

      <button
        onClick={onToggleLive}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
          isLiveMode ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
        }`}
      >
        {isLiveMode ? 'LIVE ACTIVE' : 'ENABLE LIVE'}
      </button>
    </div>
  );
}
