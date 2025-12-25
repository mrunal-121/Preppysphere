
import React, { useState, useEffect } from 'react';
import { getWellnessTips } from '../services/geminiService';
import { WellnessTip } from '../types';
import { 
  Heart, Activity, Wind, Users, Loader2, Sparkles, Search, 
  Smile, Frown, Meh, Thermometer, CheckSquare, Square, CheckCircle2,
  Zap, ShieldAlert, RefreshCw, AlertTriangle, Lightbulb, Circle
} from 'lucide-react';

// Enhanced mock database for dynamic preview behavior
const MOCK_PREVIEWS: Record<string, WellnessTip[]> = {
  exam: [
    { category: 'mental', tip: 'Use the Pomodoro technique: 25m study, 5m break to prevent mental fatigue.', action: 'Start first timer', completed: false },
    { category: 'physical', tip: 'Stay hydrated! Dehydration can drop concentration by 15%.', action: 'Drink 500ml water', completed: false },
    { category: 'social', tip: 'Post a quick study-buddy request in your course group to share notes.', action: 'Open messaging app', completed: false }
  ],
  sleep: [
    { category: 'mental', tip: 'Write a "Brain Dump" list of all worries before bed to clear cognitive load.', action: 'Grab a notepad', completed: false },
    { category: 'physical', tip: 'Avoid blue light 30 minutes before bed; try a warm shower instead.', action: 'Dim screen now', completed: false },
    { category: 'social', tip: 'Tell a friend you are going offline for rest to avoid late-night notification pings.', action: 'Send "Goodnight"', completed: false }
  ],
  social: [
    { category: 'social', tip: 'Join a campus hobby club or a sports trial to meet people outside your major.', action: 'Check club listings', completed: false },
    { category: 'mental', tip: 'Remember that everyone feels lonely at times; it is a signal for connection, not a flaw.', action: 'Self-compassion pause', completed: false },
    { category: 'physical', tip: 'Go to the campus cafe or library to work; being around others reduces isolation.', action: 'Pack your bag', completed: false },
  ],
  general: [
    { category: 'mental', tip: 'Practice the 4-7-8 breathing technique: Inhale for 4s, hold for 7s, exhale for 8s.', action: 'Try 3 cycles now', completed: false },
    { category: 'physical', tip: 'Reset your physical posture and take a 5-minute brisk walk to oxygenate your brain.', action: 'Set a timer', completed: false },
    { category: 'social', tip: 'Reach out to a peer for a 5-minute non-academic chat to break study isolation.', action: 'Send one message', completed: false }
  ]
};

const WellnessCenter: React.FC = () => {
  const [stress, setStress] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [tips, setTips] = useState<WellnessTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBuster, setShowBuster] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isLiveSession, setIsLiveSession] = useState(false);

  // Helper to get simulated tips based on query keywords
  const getDynamicMockTips = (query?: string): WellnessTip[] => {
    const q = query?.toLowerCase() || '';
    if (q.includes('exam') || q.includes('test') || q.includes('study')) return MOCK_PREVIEWS.exam;
    if (q.includes('sleep') || q.includes('tired') || q.includes('night')) return MOCK_PREVIEWS.sleep;
    if (q.includes('social') || q.includes('lonely') || q.includes('friend')) return MOCK_PREVIEWS.social;
    return MOCK_PREVIEWS.general;
  };

  const fetchTips = async (query?: string) => {
    setLoading(true);
    setErrorStatus(null);
    setIsLiveSession(false);

    try {
      const data = await getWellnessTips(stress, query);
      if (data && data.length > 0) {
        setTips(data.map(t => ({ ...t, completed: false })));
        setIsLiveSession(true);
      } else {
        throw new Error("EMPTY_RESPONSE");
      }
    } catch (err: any) {
      console.error("Live Wellness Error:", err.message);
      if (err.message === 'API_KEY_MISSING') {
        setErrorStatus('AUTH_ERROR');
      } else {
        setErrorStatus('CONNECTION_ERROR');
      }
      const fallbackTips = getDynamicMockTips(query);
      setTips(fallbackTips.map(t => ({ ...t, completed: false })));
    } finally {
      setLoading(false);
    }
  };

  const toggleTipCompletion = (index: number) => {
    setTips(prev => prev.map((tip, i) => 
      i === index ? { ...tip, completed: !tip.completed } : tip
    ));
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTips(searchQuery.trim() || undefined);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shadow-sm">
            <Heart size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Wellness Center</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              {isLiveSession ? 'Pure Gemini Intelligence' : 'Dynamic Preview Active'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowBuster(!showBuster)}
          className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black hover:bg-indigo-100 transition-colors border border-indigo-100 uppercase"
        >
          Check-In
        </button>
      </div>

      {showBuster && (
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300 border-dashed">
          <h3 className="font-bold text-indigo-600 flex items-center gap-2"><Activity size={18}/> Rapid Assessment</h3>
          <div className="space-y-2">
            {[
              { id: 1, text: "Difficulty concentrating today" },
              { id: 2, text: "Feeling physically drained" },
              { id: 3, text: "High anxiety about a deadline" }
            ].map(q => (
              <button 
                key={q.id}
                onClick={() => setCheckedItems(p => p.includes(q.id) ? p.filter(i => i !== q.id) : [...p, q.id])}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                  checkedItems.includes(q.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}
              >
                {checkedItems.includes(q.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                <span className="text-sm font-medium">{q.text}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={() => {
              setStress(checkedItems.length > 2 ? 9 : checkedItems.length > 0 ? 6 : 3);
              setShowBuster(false);
              fetchTips();
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg uppercase"
          >
            Update Advice
          </button>
        </div>
      )}

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          placeholder="Problem for AI analysis (try 'exams' or 'sleep')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 p-5 pl-14 rounded-[2rem] outline-none focus:ring-4 focus:ring-rose-50 transition-all shadow-sm font-medium"
        />
        <Search className="absolute left-5 top-5 text-slate-400" size={20} />
        <button type="submit" className="absolute right-3 top-2.5 p-2.5 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 shadow-md">
          <Sparkles size={18} />
        </button>
      </form>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 px-1">
            <Thermometer size={16} className="text-rose-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stress Level</label>
          </div>
          <div className="flex items-center gap-2">
            {stress <= 3 ? <Smile className="text-green-500" /> : stress <= 7 ? <Meh className="text-amber-500" /> : <Frown className="text-rose-500" />}
            <span className="text-lg font-black text-slate-800">{stress}/10</span>
          </div>
        </div>
        <input type="range" min="1" max="10" value={stress} onChange={(e) => setStress(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none accent-rose-500" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            AI Strategy Feed
            {loading && <Loader2 size={12} className="animate-spin text-indigo-500" />}
          </h3>
          {isLiveSession ? (
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
              <Zap size={10} fill="currentColor" /> <span>STRICT LIVE MODE</span>
            </div>
          ) : !loading && errorStatus && (
            <div className="flex items-center gap-1 text-amber-500 text-[10px] font-black bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
              <Lightbulb size={10} /> <span>SMART FALLBACK ACTIVE</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {errorStatus && !loading && (
             <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-3xl flex items-start gap-4 animate-in fade-in duration-500">
               <div className="p-3 bg-white rounded-2xl text-rose-500 shadow-sm border border-rose-50">
                  <AlertTriangle size={20} />
               </div>
               <div className="flex-1">
                  <h4 className="text-xs font-black text-rose-900 uppercase tracking-tight">Live AI Connection Limited</h4>
                  <p className="text-[10px] text-rose-700 font-bold leading-relaxed mt-1">
                    {errorStatus === 'AUTH_ERROR' 
                      ? 'Environment API_KEY is missing. Providing relevant study strategies from our local expert database.' 
                      : 'Live connection failed. Using smart fallback tips based on your search.'}
                  </p>
                  <button 
                    onClick={() => fetchTips(searchQuery || undefined)}
                    className="mt-3 text-[10px] font-black text-white bg-rose-500 px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-sm uppercase"
                  >
                    <RefreshCw size={12} /> Retry Live Link
                  </button>
               </div>
             </div>
          )}

          {loading ? (
             Array(3).fill(0).map((_, i) => <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 h-32 animate-pulse" />)
          ) : tips.length > 0 ? (
            tips.map((tip, i) => (
              <div 
                key={`${i}-${searchQuery}`} 
                className={`p-6 rounded-3xl border transition-all duration-500 flex gap-4 animate-in fade-in slide-in-from-right-2 duration-300 ${
                  tip.completed 
                    ? 'bg-slate-50 border-emerald-100 opacity-75' 
                    : 'bg-white border-slate-100 shadow-sm'
                } ${!isLiveSession && !tip.completed ? 'border-amber-50/50 shadow-amber-50/20' : ''}`}
              >
                <div className={`p-4 h-fit rounded-2xl shrink-0 transition-all ${
                  tip.completed 
                    ? 'bg-slate-200 text-slate-400' 
                    : tip.category === 'mental' ? 'bg-blue-50 text-blue-600' : tip.category === 'physical' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {tip.category === 'mental' ? <Wind size={20} /> : tip.category === 'physical' ? <Activity size={20} /> : <Users size={20} />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      {tip.category} Insight
                      {!isLiveSession && <Lightbulb size={10} className="text-amber-400" />}
                    </h4>
                    {tip.completed && <CheckCircle2 size={16} className="text-emerald-500 animate-in zoom-in" />}
                  </div>
                  
                  <p className={`text-sm font-bold leading-snug transition-all ${tip.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {tip.tip}
                  </p>
                  
                  <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    tip.completed 
                      ? 'bg-slate-100 border-slate-100' 
                      : 'border-slate-50 bg-slate-50'
                  }`}>
                    <span className={`text-[10px] font-black uppercase tracking-tight ${tip.completed ? 'text-slate-400' : 'text-indigo-600'}`}>
                      {tip.action}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button className={`text-[9px] font-black px-2 py-1 rounded-lg border transition-all ${
                        isLiveSession 
                          ? 'bg-white text-slate-400 border-slate-100' 
                          : 'bg-amber-100 text-amber-600 border-amber-200'
                      }`}>
                        {isLiveSession ? 'AI Task' : 'Dynamic Local'}
                      </button>
                      
                      <button 
                        onClick={() => toggleTipCompletion(i)}
                        className={`p-1.5 rounded-xl transition-all active:scale-90 ${
                          tip.completed 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                            : 'bg-white text-slate-300 border border-slate-100 hover:text-emerald-500'
                        }`}
                      >
                        {tip.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-3">
              <AlertTriangle className="text-slate-200" size={32} />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Awaiting Active Connection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessCenter;
