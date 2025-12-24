
import React, { useState, useEffect } from 'react';
import { getWellnessTips } from '../services/geminiService';
import { WellnessTip } from '../types';
import { 
  Heart, 
  Activity, 
  Wind, 
  Users, 
  Coffee, 
  Loader2, 
  Sparkles, 
  Search, 
  Smile, 
  Frown, 
  Meh, 
  Thermometer, 
  CheckSquare, 
  Square, 
  CheckCircle2,
  AlertCircle,
  Zap
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
  const [error, setError] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const STORAGE_KEY = 'preppysphere_daily_wellness';

  const fetchTips = async (query?: string, forceRefresh = false) => {
    // 1. Reset states for fresh attempt
    setLoading(true);
    setError(false);
    setIsLive(false);

    // 2. Cache Check: Only if NO query and NOT forced
    if (!query && !forceRefresh) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { date, data, stressLevel } = JSON.parse(cached);
        const today = new Date().toISOString().split('T')[0];
        
        if (date === today && data.length > 0) {
          setTips(data);
          setStress(stressLevel || 5);
          setLoading(false);
          return;
        }
      }
    }

    // 3. Live API Call
    try {
      const data = await getWellnessTips(stress, query);
      if (data && data.length > 0) {
        const initializedTips = data.map((t: WellnessTip) => ({ ...t, completed: false }));
        setTips(initializedTips);
        setIsLive(true);
        
        // Only cache daily general tips (not search results)
        if (!query) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            data: initializedTips,
            stressLevel: stress
          }));
        }
      } else {
        throw new Error("Empty or malformed response from Gemini");
      }
    } catch (err) {
      console.error("Failed to fetch wellness tips:", err);
      setError(true);
      setIsLive(false);
      
      // Fallback presets
      const fallback: WellnessTip[] = [
        { category: 'mental', tip: 'Practice the 4-7-8 breathing technique.', action: 'Focus on breath for 3 minutes', completed: false },
        { category: 'physical', tip: 'Take a brief walk outside for fresh air.', action: '5-minute outdoor break', completed: false },
        { category: 'social', tip: 'Reach out to a classmate about something non-academic.', action: 'Brief social chat', completed: false }
      ];
      setTips(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchTips(searchQuery, true);
    } else {
      fetchTips(); // Reset to default daily tips
    }
  };

  const toggleTipCompletion = (index: number) => {
    const newTips = [...tips];
    newTips[index].completed = !newTips[index].completed;
    setTips(newTips);
    
    // Update daily cache if applicable
    if (!searchQuery) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.data = newTips;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    }
  };

  const toggleStressItem = (id: number) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const calculateStressFromBuster = () => {
    const points = checkedItems.reduce((acc, id) => {
      const q = STRESS_BUSTER_QUESTIONS.find(item => item.id === id);
      return acc + (q?.points || 0);
    }, 0);
    const calculatedStress = Math.min(Math.max(Math.round(points), 1), 10);
    setStress(calculatedStress);
    setShowBuster(false);
    fetchTips(undefined, true);
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
            <p className="text-xs text-slate-400">AI-powered support for your mind</p>
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
          <p className="text-xs text-slate-500">Check the items that apply to you right now:</p>
          <div className="space-y-3">
            {STRESS_BUSTER_QUESTIONS.map(q => (
              <button 
                key={q.id}
                onClick={() => toggleStressItem(q.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                  checkedItems.includes(q.id) 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {checkedItems.includes(q.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                <span className="text-sm font-medium">{q.text}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={calculateStressFromBuster}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Analyze & Update Stress Level
          </button>
        </div>
      )}

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          placeholder="Describe a problem (e.g. exam anxiety)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 p-5 pl-14 rounded-[2rem] outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-300 transition-all shadow-sm"
        />
        <Search className="absolute left-5 top-5 text-slate-400" size={20} />
        <button 
          type="submit"
          className="absolute right-3 top-2.5 p-2.5 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-colors shadow-md"
        >
          <Sparkles size={18} />
        </button>
      </form>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className="text-rose-500" />
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stress Level Indicator</label>
            </div>
            <div className="flex items-center gap-2">
              {stress <= 3 ? <Smile className="text-green-500" /> : stress <= 7 ? <Meh className="text-amber-500" /> : <Frown className="text-rose-500" />}
              <span className={`text-lg font-bold ${stress > 7 ? 'text-rose-600' : stress > 3 ? 'text-amber-600' : 'text-green-600'}`}>
                {stress}/10
              </span>
            </div>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={stress}
            onChange={(e) => setStress(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            {searchQuery ? `Tips for "${searchQuery}"` : 'Your Daily Wellness Map'}
            {loading && <Loader2 size={14} className="animate-spin" />}
          </h3>
          <div className="flex items-center gap-3">
             {isLive && (
               <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                 <Zap size={10} />
                 <span>AI Live</span>
               </div>
             )}
             {error && !loading && (
               <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                 <AlertCircle size={12} />
                 <span>Offline - Presets</span>
               </div>
             )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 h-32 animate-pulse"></div>
             ))
          ) : (
            tips.map((tip, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-3xl border shadow-sm flex gap-4 transition-all duration-500 ${
                  tip.completed 
                    ? 'bg-emerald-50 border-emerald-100 opacity-80' 
                    : 'bg-white border-slate-100'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`p-4 h-fit rounded-2xl shrink-0 transition-colors ${
                  tip.completed ? 'bg-emerald-200 text-emerald-700' :
                  tip.category === 'mental' ? 'bg-blue-50 text-blue-600' :
                  tip.category === 'physical' ? 'bg-orange-50 text-orange-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {tip.completed ? <CheckCircle2 size={20} /> :
                   tip.category === 'mental' ? <Wind size={20} /> : 
                   tip.category === 'physical' ? <Activity size={20} /> : <Users size={20} />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest ${tip.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {tip.category} Wellness {tip.completed && '• Completed'}
                  </h4>
                  <p className={`text-sm font-bold leading-snug ${tip.completed ? 'text-emerald-800 line-through decoration-emerald-300' : 'text-slate-800'}`}>
                    {tip.tip}
                  </p>
                  <div className={`flex items-center justify-between gap-2 mt-3 p-2 rounded-xl border transition-colors ${
                    tip.completed ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-indigo-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} />
                      <span className="text-xs font-bold leading-tight">{tip.action}</span>
                    </div>
                    <button 
                      onClick={() => toggleTipCompletion(i)}
                      className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-md transition-all ${
                        tip.completed ? 'bg-white text-emerald-600 shadow-sm' : 'bg-indigo-600 text-white shadow-md active:scale-95'
                      }`}
                    >
                      {tip.completed ? 'Undo' : 'Done'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-7 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-lg">
            <Coffee size={20} className="text-amber-400" /> Deep Work Zone
          </h3>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            {stress > 6 
              ? "Your stress is high. Try a 5-minute breathing exercise before starting your focus session."
              : "Stress is low. Perfect time for a 50-minute deep work sprint."}
          </p>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all shadow-lg active:scale-95">
            Begin Focus Session
          </button>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-500/10 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 blur-3xl"></div>
      </div>
    </div>
  );
};

export default WellnessCenter;
