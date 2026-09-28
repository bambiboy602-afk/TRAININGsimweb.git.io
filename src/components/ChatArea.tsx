import { Message, Persona } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatAreaProps {
  activePersona: Persona | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export function ChatArea({ activePersona, messages, onSendMessage, isLoading }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputRef.current?.value.trim() || isLoading) return;
    onSendMessage(inputRef.current.value);
    inputRef.current.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!activePersona) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500">
        <Bot size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Select a clinical profile to begin training</p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Dossier Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex gap-6 items-center">
        {activePersona.imageUrl ? (
          <img 
            src={activePersona.imageUrl} 
            alt={activePersona.name} 
            className="w-16 h-16 rounded-lg object-cover border border-slate-700 shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center animate-pulse">
            <Bot size={24} className="text-slate-600" />
          </div>
        )}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tight">Name / Age</span>
            <span className="text-sm font-semibold text-slate-200">{activePersona.name}, {activePersona.age}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tight">Primary Diagnosis</span>
            <span className="text-sm font-semibold text-slate-200">{activePersona.diagnosis}</span>
          </div>
          <div className="hidden md:block">
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tight">Demographics</span>
            <span className="text-sm font-semibold text-slate-200 line-clamp-1">{activePersona.demographics}</span>
          </div>
          <div className="hidden md:block">
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tight">Family History</span>
            <span className="text-sm font-semibold text-slate-200 line-clamp-1">{activePersona.familyHistory}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-sky-600' : 'bg-slate-800'
                }`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-sky-400" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-sky-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-sky-400" />
              <span className="text-xs text-slate-400">Persona is responding...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Type your clinical response or technique..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none h-12"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:hover:bg-sky-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </main>
  );
}
