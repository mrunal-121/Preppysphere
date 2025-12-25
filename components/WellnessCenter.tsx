
import React, { useState, useEffect } from 'react';
import { getWellnessTips } from '../services/geminiService';
import { WellnessTip } from '../types';
import { Heart, Activity, Wind, Users, Coffee, Loader2, Sparkles, RefreshCcw, Search, Smile, Frown, Meh, Thermometer, CheckSquare, Square } from 'lucide-react';

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

  const fetchTips = async (query?: string) => {
    setLoading(true);
    try {
      const data = await getWellnessTips(stress, query);
      setTips(data);
    } catch (err) {
      console.error(err);
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
      fetchTips(searchQuery);
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
    // Normalize to 1-10
    const calculatedStress = Math.min(Math.max(Math.round(points), 1), 10);
    setStress(calculatedStress);
    setShowBuster(false);
    fetchTips();
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

      {/* Stress Buster Modal/Overlay */}
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

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          placeholder="Describe a problem (e.g. exam anxiety, procrastination)..."
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
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Calm</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Severe</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
          {searchQuery ? `Tips for "${searchQuery}"` : 'Your Daily Wellness Map'}
          {loading && <Loader2 size={14} className="animate-spin" />}
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 h-32 animate-pulse"></div>
             ))
          ) : (
            tips.map((tip, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`p-4 h-fit rounded-2xl shrink-0 ${
                  tip.category === 'mental' ? 'bg-blue-50 text-blue-600' :
                  tip.category === 'physical' ? 'bg-orange-50 text-orange-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {tip.category === 'mental' ? <Wind size={20} /> : 
                   tip.category === 'physical' ? <Activity size={20} /> : <Users size={20} />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tip.category} Wellness</h4>
                  <p className="text-sm font-bold text-slate-800 leading-snug">{tip.tip}</p>
                  <div className="flex items-center gap-2 mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-indigo-600">
                    <Sparkles size={12} />
                    <span className="text-xs font-bold leading-tight">{tip.action}</span>
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
