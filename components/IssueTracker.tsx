
import React, { useState, useEffect } from 'react';
import { categorizeIssue } from '../services/geminiService';
import { CommunityIssue, IssueCategory } from '../types';
import { AlertCircle, Plus, Send, Clock, CheckCircle2, Loader2, MapPin, Building2, Tag, Bell, BellRing, History, ChevronRight } from 'lucide-react';

interface IssueTrackerProps {
  issues: CommunityIssue[];
  setIssues: (issues: CommunityIssue[]) => void;
}

const IssueTracker: React.FC<IssueTrackerProps> = ({ issues, setIssues }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter issues for "recent notifications" (simulated: ones that were recently updated or just created)
  const notifications = issues.slice(0, 3);

  const handleSubmit = async () => {
    if (!title || !description) return;
    setSubmitting(true);
    try {
      const { category, routing } = await categorizeIssue(title, description);
      const newIssue: CommunityIssue = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        category: category as IssueCategory,
        routing,
        status: 'pending',
        timestamp: Date.now(),
      };
      setIssues([newIssue, ...issues]);
      setTitle('');
      setDescription('');
      setShowForm(false);
      setShowNotifications(true); // Auto-show notification area when new one is added
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Issue Tracker</h2>
            <p className="text-xs text-slate-400">Campus betterment dashboard</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-3 rounded-2xl transition-all relative ${
              showNotifications ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            <Bell size={24} />
            {issues.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`p-3 rounded-2xl transition-all ${
              showForm ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
            }`}
          >
            {showForm ? <History size={24} /> : <Plus size={24} />}
          </button>
        </div>
      </div>

      {showNotifications && (
        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BellRing size={16} className="text-indigo-600" /> Recent Updates
            </h3>
            <button className="text-[10px] text-indigo-600 font-bold uppercase">Clear All</button>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No new status updates.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="flex gap-3 items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">"{n.title}" has been filed.</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">Route: {n.routing}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-dashed border-indigo-200 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Tag size={18} className="text-indigo-600" /> Report New Issue
          </h3>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Summary of the issue..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm"
            />
            <textarea 
              placeholder="AI will analyze this to route to the correct campus department..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm h-32 resize-none"
            />
          </div>
          <button 
            onClick={handleSubmit}
            disabled={submitting || !title || !description}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            {submitting ? 'Smart Categorizing...' : 'Submit to AI Router'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2">Active Tracker</h3>
        {issues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-slate-100 shadow-inner">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <CheckCircle2 size={40} className="text-slate-200" />
            </div>
            <p className="text-slate-400 text-sm font-medium">All clear! No pending issues.</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm space-y-4 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                  issue.category === IssueCategory.INFRASTRUCTURE ? 'bg-blue-50 text-blue-600' :
                  issue.category === IssueCategory.SAFETY ? 'bg-rose-50 text-rose-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {issue.category}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock size={12} className="animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">{issue.status}</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{issue.title}</h4>
                <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">{issue.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
                  <Building2 size={16} className="text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">Assigned: {issue.routing}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin size={12} />
                  <span className="text-[10px] font-medium tracking-wide">
                    {new Date(issue.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IssueTracker;
