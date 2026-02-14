
import React from 'react';
import { 
  X, 
  Bell, 
  Zap, 
  Calendar, 
  Target, 
  Heart, 
  ArrowRight, 
  Clock,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { SmartNotification, ViewState } from '../types';

interface SmartNotificationCenterProps {
  notifications: SmartNotification[];
  onClose: () => void;
  onClear: () => void;
  onAction: (view: ViewState) => void;
  onMarkRead: (id: string) => void;
}

const SmartNotificationCenter: React.FC<SmartNotificationCenterProps> = ({ 
  notifications, 
  onClose, 
  onClear,
  onAction,
  onMarkRead
}) => {
  const getIcon = (type: SmartNotification['type']) => {
    switch (type) {
      case 'deadline': return <Calendar size={18} className="text-amber-500" />;
      case 'productivity': return <Target size={18} className="text-blue-500" />;
      case 'stress': return <Heart size={18} className="text-rose-500" />;
      case 'motivation': return <Zap size={18} className="text-indigo-500" />;
    }
  };

  const getPriorityColor = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-rose-50 border-rose-100 text-rose-700';
      case 'medium': return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'low': return 'bg-indigo-50 border-indigo-100 text-indigo-700';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Gemini Insights</h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Awareness Hub</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">You're all caught up!</p>
                <p className="text-[11px] text-slate-400">Gemini hasn't detected any urgent patterns yet.</p>
              </div>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                className={`p-5 rounded-3xl border transition-all ${getPriorityColor(n.priority)} ${n.isRead ? 'opacity-60' : 'shadow-sm'}`}
                onClick={() => onMarkRead(n.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      {getIcon(n.type)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      {n.type} Insight
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold opacity-50">
                    <Clock size={10} />
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <h4 className="font-bold text-sm mb-1">{n.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{n.message}</p>
                
                {n.actionLabel && n.targetView && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(n.targetView as ViewState);
                    }}
                    className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/50 px-3 py-2 rounded-xl border border-white/20 hover:bg-white transition-all"
                  >
                    {n.actionLabel} <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-6 pt-0 border-t border-slate-50 mt-4">
            <button 
              onClick={onClear}
              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear Insight History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNotificationCenter;
