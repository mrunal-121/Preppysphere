
import React, { useState, useRef, useEffect } from 'react';
import { solveDoubt } from '../services/geminiService';
import { Send, User, Sparkles, Loader2, BrainCircuit, Lightbulb, Copy, Info } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DoubtAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your AI Tutor. Stuck on a concept? Just ask!' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await solveDoubt(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to tutor service." }]);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();
      // Handle simple dashes or numbered lists without using symbols like *
      if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        return (
          <div key={i} className="flex gap-2 ml-2 mb-1 text-slate-700">
            <span className="text-indigo-400">•</span>
            <span>{trimmed.replace(/^- /, '')}</span>
          </div>
        );
      }
      if (trimmed === '') return <div key={i} className="h-2" />;
      return <p key={i} className="mb-2 text-slate-700 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-sm">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">AI Tutor</h2>
          <p className="text-xs text-slate-400">Concise, simple explanations.</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-y-auto p-5 space-y-6 mb-4 scroll-smooth"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center border-2 border-white shadow-md ${
                 m.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
               }`}>
                 {m.role === 'assistant' ? <Lightbulb size={18} /> : <User size={18} />}
               </div>
               <div className={`p-5 rounded-3xl shadow-sm border border-slate-50 ${
                 m.role === 'user' 
                   ? 'bg-blue-600 text-white rounded-tr-none' 
                   : 'bg-white text-slate-700 rounded-tl-none'
               }`}>
                 <div className="text-sm">
                   {formatContent(m.content)}
                 </div>
               </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-pulse shadow-md">
                <Sparkles size={18} />
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl rounded-tl-none flex items-center gap-3 border border-slate-100 shadow-inner">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500 font-medium italic">Gemini is simplifying the answer...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Ask me any question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full bg-white border-2 border-slate-100 p-5 pr-16 rounded-[2rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-xl shadow-slate-200/50"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="absolute right-3 top-3 p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-[10px] text-center text-slate-400 mt-2 font-medium flex items-center justify-center gap-1">
        <Info size={10} /> Explanations are easy and plain-text for better focus.
      </p>
    </div>
  );
};

export default DoubtAssistant;
