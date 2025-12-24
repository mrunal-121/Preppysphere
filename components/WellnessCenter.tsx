
import React, { useState, useEffect } from 'react';
import { getWellnessTips } from '../services/geminiService';
import { WellnessTip } from '../types';
import { 
  Heart, Activity, Wind, Users, Coffee, Loader2, Sparkles, Search, 
  Smile, Frown, Meh, Thermometer, CheckSquare, Square, CheckCircle2,
  AlertCircle, Zap, ShieldAlert, RefreshCw
} from 'lucide-react';

const STRESS_BUSTER_QUESTIONS = [
  { id: 1, text: "I have difficulty concentrating today.", points: 2 },
  { id: 2, text: "I feel physically exhausted.", points: 2 },
  { id: 3, text: "I'm worried about an upcoming deadline.", points: 3 },
  { id: 4, text: "I haven't slept well in the last 2 days.", points: 2 },
  { id: 5, text: "I feel socially isolated or lonely.", points: 1 },
];

const WellnessCenter: React.FC = () => {
  const [stress, setStress] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [tips, setTips] = useState<WellnessTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBuster, setShowBuster] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const STORAGE_KEY = 'preppysphere_daily_wellness';

  const fetchTips = async (query?: string, forceRefresh = false) => {
    setLoading(true);
    setErrorType(null);
    setIsLive(false);

    // Bypass cache for searches or forced refreshes
    if (!query && !forceRefresh) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { date, data, stressLevel } = JSON.parse(cached);
        if (date === new Date().toISOString().split('T')[0] && data.length > 0) {
          setTips(data);
          setStress(stressLevel || 5);
          setLoading(false);
          setIsLive(true); // Assuming cached data was originally live
          return;
        }
      }
    }

    try {
      const data = await getWellnessTips(stress, query);
      if (data && data.length > 0) {
        const initializedTips = data.map((t: WellnessTip) => ({ ...t, completed: false }));
        setTips(initializedTips);
        setIsLive(true);
        
        if (!query) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            data: initializedTips,
            stressLevel: stress
          }));
        }
      } else {
        throw new Error("EMPTY_DATA");
      }
    } catch (err: any) {
      console.error("Live Wellness API Error:", err.message);
      setErrorType(err.message === 'API_KEY_MISSING' ? 'MISSING_KEY' : 'CONNECTION_FAILED');
      setTips([]); // Clear list so user doesn't see old/stale data
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTips(searchQuery.trim() || undefined, true);
  };

  const toggleTipCompletion = (index: number) => {
    const newTips = [...tips];
    newTips[index].completed = !newTips[index].completed;
    setTips(newTips);
    if (!searchQuery) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.data = newTips;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shadow-sm">
            <Heart size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Wellness Center</h2>
            <p className="text-xs text-slate-400">Pure Gemini AI Intelligence</p>
          </div>
        </div>
        <button 
          onClick={() => setShowBuster(!showBuster)}
          className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-100"
        >
          <Activity size={16} /> Stress Buster
        </button>
      </div>

      {showBuster && (
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300 border-dashed">
          <div className="flex items-center gap-2 text-indigo-600">
            <Activity size={20} className="animate-pulse" />
            <h3 className="font-bold">Rapid Stress Check</h3>
          </div>
          <div className="space-y-3">
            {STRESS_BUSTER_QUESTIONS.map(q => (
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
              const points = checkedItems.reduce((acc, id) => acc + (STRESS_BUSTER_QUESTIONS.find(q => q.id === id)?.points || 0), 0);
              setStress(Math.min(Math.max(Math.round(points), 1), 10));
              setShowBuster(false);
              fetchTips(undefined, true);
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Generate AI Advice
          </button>
        </div>
      )}

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          placeholder="Describe a problem for live AI analysis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 p-5 pl-14 rounded-[2rem] outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-300 transition-all shadow-sm"
        />
        <Search className="absolute left-5 top-5 text-slate-400" size={20} />
        <button type="submit" className="absolute right-3 top-2.5 p-2.5 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-colors shadow-md">
          <Sparkles size={18} />
        </button>
      </form>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-rose-500" />
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stress Level</label>
          </div>
          <div className="flex items-center gap-2">
            {stress <= 3 ? <Smile className="text-green-500" /> : stress <= 7 ? <Meh className="text-amber-500" /> : <Frown className="text-rose-500" />}
            <span className="text-lg font-bold text-slate-800">{stress}/10</span>
          </div>
        </div>
        <input type="range" min="1" max="10" value={stress} onChange={(e) => setStress(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none accent-rose-500" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            {searchQuery ? `AI Analysis: ${searchQuery}` : 'Your Live Wellness Map'}
            {loading && <Loader2 size={14} className="animate-spin" />}
          </h3>
          {isLive && (
            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
              <Zap size={10} /> <span>LIVE AI ACTIVE</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 h-32 animate-pulse" />)
          ) : errorType ? (
            <div className="bg-rose-50 border-2 border-dashed border-rose-200 p-8 rounded-[2.5rem] text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-rose-500">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h4 className="font-bold text-rose-900">
                  {errorType === 'MISSING_KEY' ? 'API Key Not Found' : 'Live Connection Failed'}
                </h4>
                <p className="text-xs text-rose-700 mt-1 max-w-[200px] mx-auto leading-relaxed">
                  {errorType === 'MISSING_KEY' 
                    ? 'Gemini requires an API_KEY in your Netlify Environment Variables to generate tips.' 
                    : 'The AI model is currently unreachable. Please check your network and try again.'}
                </p>
              </div>
              <button 
                onClick={() => fetchTips(searchQuery || undefined, true)}
                className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-2 rounded-xl text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors shadow-sm"
              >
                <RefreshCw size={14} /> Retry Live Call
              </button>
            </div>
          ) : tips.length > 0 ? (
            tips.map((tip, i) => (
              <div key={i} className={`p-6 rounded-3xl border shadow-sm flex gap-4 transition-all duration-500 ${tip.completed ? 'bg-emerald-50 border-emerald-100 opacity-80' : 'bg-white border-slate-100'}`}>
                <div className={`p-4 h-fit rounded-2xl shrink-0 ${tip.completed ? 'bg-emerald-200 text-emerald-700' : tip.category === 'mental' ? 'bg-blue-50 text-blue-600' : tip.category === 'physical' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {tip.completed ? <CheckCircle2 size={20} /> : tip.category === 'mental' ? <Wind size={20} /> : tip.category === 'physical' ? <Activity size={20} /> : <Users size={20} />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest ${tip.completed ? 'text-emerald-600' : 'text-slate-400'}`}>{tip.category} Wellness</h4>
                  <p className={`text-sm font-bold leading-snug ${tip.completed ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>{tip.tip}</p>
                  <div className={`flex items-center justify-between gap-2 mt-3 p-2 rounded-xl border ${tip.completed ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-indigo-600'}`}>
                    <span className="text-xs font-bold">{tip.action}</span>
                    <button onClick={() => toggleTipCompletion(i)} className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${tip.completed ? 'bg-white text-emerald-600' : 'bg-indigo-600 text-white shadow-md'}`}>
                      {tip.completed ? 'Undo' : 'Done'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs italic">Enter a problem above to see AI advice.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessCenter;
