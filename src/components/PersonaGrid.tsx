import { PERSONAS } from '../personas';
import { Persona } from '../types';
import { motion } from 'motion/react';
import { UserCircle, AlertCircle, Zap, ShieldAlert, Bot } from 'lucide-react';

interface PersonaGridProps {
  onSelect: (persona: Persona) => void;
}

export function PersonaGrid({ onSelect }: PersonaGridProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Bot size={12} />
            Clinical Training Module
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Select Training Case</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose a clinical dossier to begin your peer support simulation. Each case presents unique challenges in de-escalation, active listening, and evidence-based techniques.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERSONAS.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => onSelect(persona)}
                className="group relative w-full h-full text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all hover:border-sky-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] hover:translate-y-[-4px] flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-sky-400 group-hover:border-sky-500/50 transition-colors">
                    {persona.difficulty === 'Crisis' ? <ShieldAlert size={24} className="text-rose-400" /> : 
                     persona.difficulty === 'Acute' ? <Zap size={24} className="text-amber-400" /> : 
                     <UserCircle size={24} className="text-emerald-400" />}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    persona.difficulty === 'Crisis' ? 'bg-rose-500/20 text-rose-400' :
                    persona.difficulty === 'Acute' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {persona.difficulty}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">
                    {persona.name}, {persona.age}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-tighter">
                    {persona.diagnosis}
                  </p>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {persona.initialPrompt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-auto flex items-center justify-between group-hover:border-sky-500/20">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Case Dossier #{persona.id.padStart(3, '0')}</span>
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                    <AlertCircle size={14} />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
