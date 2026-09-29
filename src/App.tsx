import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { EvalSidebar } from './components/EvalSidebar';
import { VoiceControls } from './components/VoiceControls';
import { PersonaGrid } from './components/PersonaGrid';
import { Persona, Message, Scores, EvalResponse } from './types';
import { initAuth, googleSignIn, logout } from './lib/auth';
import { exportToDocs, logToSheets } from './lib/workspace';
import { LogOut, FileText, Table, User as UserIcon, LayoutGrid, ChevronLeft } from 'lucide-react';
import { User } from 'firebase/auth';

export default function App() {
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [scores, setScores] = useState<Scores>({
    oars: 0,
    activeListening: 0,
    cbtTechniques: 0,
    deEscalation: 0
  });
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleSelectPersona = useCallback(async (persona: Persona) => {
    setActivePersona(persona);
    setMessages([{ role: 'assistant', content: persona.initialPrompt }]);
    setScores({ oars: 0, activeListening: 0, cbtTechniques: 0, deEscalation: 0 });
    setFeedback('Session initialized. Apply OARS, active listening, or CBT tools to uncover hidden symptoms and de-escalate.');

    if (!persona.imageUrl) {
      try {
        const res = await fetch('/api/generate-persona-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona }),
        });
        const data = await res.json();
        if (data.imageUrl) {
          setActivePersona(prev => prev?.id === persona.id ? { ...prev, imageUrl: data.imageUrl } : prev);
        }
      } catch (err) {
        console.error('Failed to generate image:', err);
      }
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!activePersona) return;

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, persona: activePersona }),
      });
      const chatData = await chatRes.json();
      
      const assistantMessage: Message = { role: 'assistant', content: chatData.content };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      const evalRes = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: finalMessages, 
          persona: activePersona,
          currentScores: scores 
        }),
      });
      const evalData: EvalResponse = await evalRes.json();

      setScores(evalData.scores);
      setFeedback(evalData.feedback);

      if (evalData.unlockedSymptoms.length > 0) {
        setActivePersona(prev => {
          if (!prev) return null;
          return {
            ...prev,
            symptoms: prev.symptoms.map(s => ({
              ...s,
              unlocked: s.unlocked || evalData.unlockedSymptoms.some(name => 
                name.toLowerCase().includes(s.name.toLowerCase()) || 
                s.name.toLowerCase().includes(name.toLowerCase())
              )
            }))
          };
        });
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      setFeedback('Error: Failed to connect to clinical engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDoc = async () => {
    if (!accessToken || !activePersona) return;
    try {
      const content = `Session Report: ${activePersona.name}\nDate: ${new Date().toLocaleString()}\n\nScores:\nOARS: ${scores.oars}\nActive Listening: ${scores.activeListening}\nCBT: ${scores.cbtTechniques}\nDe-escalation: ${scores.deEscalation}\n\nFeedback:\n${feedback}\n\nConversation:\n${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}`;
      const url = await exportToDocs(accessToken, `Report - ${activePersona.name} - ${new Date().toLocaleDateString()}`, content);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleLogSheet = async () => {
    if (!accessToken || !activePersona) return;
    try {
      const data = [
        new Date().toLocaleString(),
        activePersona.name,
        scores.oars,
        scores.activeListening,
        scores.cbtTechniques,
        scores.deEscalation
      ];
      const newId = await logToSheets(accessToken, spreadsheetId, data);
      setSpreadsheetId(newId);
      alert('Session logged to Google Sheets successfully!');
    } catch (err) {
      console.error('Logging failed:', err);
    }
  };

  if (needsAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-200 p-6 text-center">
        <BotIcon size={64} className="text-sky-500 mb-6" />
        <h1 className="text-3xl font-bold mb-2">Clinical Training Simulator</h1>
        <p className="text-slate-400 mb-8 max-w-md">Connect your Google account to access clinical personas, track your progress, and export training reports.</p>
        <button 
          onClick={handleLogin}
          className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-200 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      <div className="flex flex-col border-r border-slate-700">
        <Sidebar activeId={activePersona?.id} onSelect={handleSelectPersona} />
        <div className="p-4 bg-slate-900 border-t border-slate-700 space-y-2">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-500 overflow-hidden">
              {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <UserIcon size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.displayName}</p>
              <button onClick={logout} className="text-[10px] text-slate-500 hover:text-rose-400 flex items-center gap-1">
                <LogOut size={10} /> Logout
              </button>
            </div>
          </div>
          <button 
            onClick={() => setActivePersona(null)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-sky-400 hover:text-white hover:bg-sky-500/10 rounded-lg transition-colors border border-sky-500/20 mb-2"
          >
            <LayoutGrid size={14} /> Browse Cases
          </button>
          <button 
            disabled={!activePersona}
            onClick={handleExportDoc}
            className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30"
          >
            <FileText size={14} /> Export Report (Docs)
          </button>
          <button 
            disabled={!activePersona}
            onClick={handleLogSheet}
            className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30"
          >
            <Table size={14} /> Log Progress (Sheets)
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {activePersona ? (
          <>
            <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActivePersona(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Return to Case Selection"
                >
                  <ChevronLeft size={20} />
                </button>
                <VoiceControls 
                  onTranscribe={(text) => handleSendMessage(text)}
                  lastPersonaResponse={messages.length > 0 && messages[messages.length-1].role === 'assistant' ? messages[messages.length-1].content : undefined}
                  isLiveMode={isLiveMode}
                  onToggleLive={() => setIsLiveMode(!isLiveMode)}
                />
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Training Session Active
              </div>
            </div>
            <ChatArea 
              activePersona={activePersona} 
              messages={messages} 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <PersonaGrid onSelect={handleSelectPersona} />
        )}
      </div>
      <EvalSidebar scores={scores} persona={activePersona} feedback={feedback} />
    </div>
  );
}

function BotIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}


