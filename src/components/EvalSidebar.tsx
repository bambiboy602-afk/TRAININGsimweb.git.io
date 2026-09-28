import { Scores, Persona } from '../types';
import { Target, Info, MessageSquareQuote } from 'lucide-react';
import { motion } from 'motion/react';

interface EvalSidebarProps {
  scores: Scores;
  persona: Persona | null;
  feedback: string;
}

export function EvalSidebar({ scores, persona, feedback }: EvalSidebarProps) {
  const categories = [
    { label: 'OARS Techniques', value: scores.oars, color: 'bg-sky-500' },
    { label: 'Active Listening', value: scores.activeListening, color: 'bg-indigo-500' },
    { label: 'CBT/Psych Techniques', value: scores.cbtTechniques, color: 'bg-violet-500' },
    { label: 'De-escalation & Safety', value: scores.deEscalation, color: 'bg-rose-500' },
  ];

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-700 p-6 flex flex-col gap-8 h-full overflow-y-auto">
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
          <Target size={14} />
          Clinical Rubric
        </h2>
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-300">{cat.label}</span>
                <span className="text-xs font-bold text-slate-400">{cat.value}/25</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.value / 25) * 100}%` }}
                  className={`h-full ${cat.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Info size={14} />
          Discovered Symptoms
        </h2>
        <div className="space-y-2">
          {persona?.symptoms.map((s, i) => (
            <div
              key={i}
              className={`text-[11px] p-2.5 rounded-lg border flex items-start gap-2 transition-colors ${
                s.unlocked
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500 italic'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${s.unlocked ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              <span>{s.unlocked ? s.name : 'Hidden Clue'}</span>
            </div>
          )) || <p className="text-[11px] text-slate-500 italic">No persona selected</p>}
        </div>
      </section>

      <section className="flex-1 flex flex-col">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <MessageSquareQuote size={14} />
          Live Feedback
        </h2>
        <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-[13px] text-slate-300 leading-relaxed italic">
          {feedback || "Awaiting your first interaction to generate clinical evaluation."}
        </div>
      </section>
    </aside>
  );
}
