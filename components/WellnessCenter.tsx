
import React, { useState, useEffect } from 'react';
import { getWellnessTips } from '../services/geminiService';
import { WellnessTip } from '../types';
import { 
  Heart, Activity, Wind, Users, Coffee, Loader2, Sparkles, Search, 
  Smile, Frown, Meh, Thermometer, CheckSquare, Square, CheckCircle2,
  Zap, ShieldAlert, RefreshCw, AlertTriangle
} from 'lucide-react';

const CACHE_VERSION = 'v2_pure_live';
const STORAGE_KEY = 'preppysphere_wellness_data';

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
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isLiveSession, setIsLiveSession] = useState(false);

  const fetchTips = async (query?: string, force = false) => {
    setLoading(true);
    setErrorStatus(null);

    // Only use cache for the initial daily load, never for searches
    if (!query && !force) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.version === CACHE_VERSION && parsed.date === new Date().toISOString().split('T')[0]) {
          setTips(parsed.data);
          setStress(parsed.stressLevel || 5);
          setLoading(false);
          setIsLiveSession(true);
          return;
        }
      }
    }

    try {
      const data = await getWellnessTips(stress, query);
      if (data && data.length > 0) {
        const processed = data.map(t => ({ ...t, completed: false }));
        setTips(processed);
        setIsLiveSession(true);
        
        if (!query) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: CACHE_VERSION,
            date: new Date().toISOString().split('T')[0],
            data: processed,
            stressLevel: stress
          }));
        }
      } else {
        throw new Error("EMPTY");
      }
    } catch (err: any) {
      console.error("Gemini Live Error:", err.message);
      setErrorStatus(err.message === 'API_KEY_MISSING' ? 'AUTH_REQUIRED' : 'SERVICE_UNAVAILABLE');
      setTips([]);
      setIsLiveSession(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTips(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTips(searchQuery.trim() || undefined, true);
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
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Live Gemini Analysis</p>
          </div>
        </div>
        <button 
          onClick={() => setShowBuster(!showBuster)}
          className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black hover:bg-indigo-100 transition-colors border border-indigo-100 uppercase"
        >
          Stress Check
        </button>
      </div>

      {showBuster && (
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300 border-dashed">
          <h3 className="font-bold text-indigo-600 flex items-center gap-2"><Activity size={18}/> Stress Assessment</h3>
          <div className="space-y-2">
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
              const pts = checkedItems.reduce((a, id) => a + (STRESS_BUSTER_QUESTIONS.find(q=>q.id===id)?.points||0), 0);
              setStress(Math.min(Math.max(Math.round(pts), 1), 10));
              setShowBuster(false);
              fetchTips(undefined, true);
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg uppercase"
          >
            Update Live Tips
          </button>
        </div>
      )}

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          placeholder="Analyze a specific problem (e.g. Exam anxiety)..."
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
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-rose-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Stress Input</label>
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
            {searchQuery ? `Targeted Analysis` : 'Daily Wellness Strategy'}
            {loading && <Loader2 size={12} className="animate-spin" />}
          </h3>
          {isLiveSession && (
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 animate-pulse">
              <Zap size={10} fill="currentColor" /> <span>LIVE AI ACTIVE</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 h-32 animate-pulse" />)
          ) : errorStatus ? (
            <div className="bg-rose-50 border-2 border-dashed border-rose-200 p-10 rounded-[2.5rem] text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-rose-500 border border-rose-100">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h4 className="font-black text-rose-900 uppercase tracking-tight">
                  {errorStatus === 'AUTH_REQUIRED' ? 'API Configuration Missing' : 'Network Connection Failed'}
                </h4>
                <p className="text-xs text-rose-700 mt-2 max-w-[240px] mx-auto leading-relaxed font-medium">
                  {errorStatus === 'AUTH_REQUIRED' 
                    ? 'The Gemini API_KEY is not defined in your Netlify site environment. Live features are locked.' 
                    : 'We could not reach the Gemini AI model. Check your internet connection or API status.'}
                </p>
              </div>
              <button 
                onClick={() => fetchTips(searchQuery || undefined, true)}
                className="bg-white text-rose-600 px-8 py-3 rounded-2xl text-xs font-black border border-rose-200 hover:bg-rose-100 shadow-sm flex items-center gap-2 mx-auto transition-all"
              >
                <RefreshCw size={14} /> RE-AUTHENTICATE & RETRY
              </button>
            </div>
          ) : tips.length > 0 ? (
            tips.map((tip, i) => (
              <div key={i} className={`p-6 rounded-3xl border shadow-sm flex gap-4 transition-all duration-500 ${tip.completed ? 'bg-emerald-50 border-emerald-100 opacity-80' : 'bg-white border-slate-100'}`}>
                <div className={`p-4 h-fit rounded-2xl shrink-0 ${tip.completed ? 'bg-emerald-200 text-emerald-700' : tip.category === 'mental' ? 'bg-blue-50 text-blue-600' : tip.category === 'physical' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {tip.completed ? <CheckCircle2 size={20} /> : tip.category === 'mental' ? <Wind size={20} /> : tip.category === 'physical' ? <Activity size={20} /> : <Users size={20} />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest ${tip.completed ? 'text-emerald-600' : 'text-slate-400'}`}>{tip.category} Wellness</h4>
                  <p className={`text-sm font-bold leading-snug ${tip.completed ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>{tip.tip}</p>
                  <div className={`flex items-center justify-between gap-2 mt-4 p-3 rounded-2xl border ${tip.completed ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-indigo-600'}`}>
                    <span className="text-[11px] font-black uppercase tracking-tight">{tip.action}</span>
                    <button 
                      onClick={() => {
                        const newTips = [...tips];
                        newTips[i].completed = !newTips[i].completed;
                        setTips(newTips);
                      }} 
                      className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl ${tip.completed ? 'bg-white text-emerald-600' : 'bg-indigo-600 text-white shadow-md'}`}
                    >
                      {tip.completed ? 'Undo' : 'Done'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-3">
              <AlertTriangle className="text-slate-200" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Active Insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessCenter;
