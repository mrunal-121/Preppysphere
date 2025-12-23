
import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlan } from '../types';
import { Calendar, Clock, Book, CheckCircle, Loader2, Play } from 'lucide-react';

const StudyPlanner: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('2 hours');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const generated = await generateStudyPlan(subject, time);
      setPlan(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">AI Study Planner</h2>
          <p className="text-xs text-slate-400">Strategic plans for your goals</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Subject / Topic</label>
          <input 
            type="text" 
            placeholder="e.g. Organic Chemistry, Microeconomics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Study Duration</label>
          <div className="flex gap-2">
            {['1 hour', '2 hours', '4 hours', 'Full Day'].map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${
                  time === t 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !subject}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
          {loading ? 'Consulting Gemini...' : 'Generate Plan'}
        </button>
      </div>

      {plan && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h3 className="font-bold text-slate-800">{plan.subject} Plan</h3>
            <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-bold">
              {plan.duration}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks & Milestones</h4>
            {plan.tasks.map((task, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <CheckCircle size={18} className="text-slate-200 group-hover:text-purple-500 transition-colors shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">{task}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 p-4 rounded-2xl">
            <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">Gemini's Expert Tip</h4>
            <p className="text-sm text-indigo-800 italic">"{plan.tips}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
