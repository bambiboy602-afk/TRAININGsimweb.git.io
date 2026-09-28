import { Persona } from '../types';
import { PERSONAS } from '../personas';
import { Brain, UserCircle } from 'lucide-react';

interface SidebarProps {
  activeId?: string;
  onSelect: (persona: Persona) => void;
}

export function Sidebar({ activeId, onSelect }: SidebarProps) {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <UserCircle size={14} />
          Clinical Dossiers
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className={`w-full text-left p-4 rounded-xl border transition-all group flex gap-3 ${
              activeId === p.id
                ? 'bg-sky-500/10 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:translate-y-[-2px]'
            }`}
          >
            {p.imageUrl && (
              <img 
                src={p.imageUrl} 
                alt={p.name} 
                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <span className={`font-semibold text-sm truncate ${activeId === p.id ? 'text-sky-400' : 'text-slate-100'}`}>
                  {p.name}, {p.age}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-1">{p.diagnosis}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
