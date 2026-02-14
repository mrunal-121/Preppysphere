
import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Target, 
  MessageCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard,
  ArrowRight,
  PieChart,
  ClipboardCheck,
  Building2,
  BrainCircuit,
  Sparkles,
  Zap,
  ChevronRight,
  CheckCircle2,
  LogOut,
  Bell,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  Filter,
  /* Added missing Plus icon */
  Plus
} from 'lucide-react';
import { FacultyAnalytics, IssueCategory, CommunityIssue } from '../types';

interface FacultyDashboardProps {
  issues: CommunityIssue[];
  onExit: () => void;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ issues, onExit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'logistics'>('overview');

  // Mock aggregated analytics for MVP
  const analytics: FacultyAnalytics = {
    activeStudents: 1248,
    averageStreak: 12.4,
    averageProgress: 76,
    hotDoubts: [
      { topic: 'DSP Filters', frequency: 15, trend: 'up' },
      { topic: 'Network Theorems', frequency: 12, trend: 'up' },
      { topic: 'Calculus Limits', frequency: 8, trend: 'down' }
    ],
    issueSummary: {
      [IssueCategory.INFRASTRUCTURE]: issues.filter(i => i.category === IssueCategory.INFRASTRUCTURE).length,
      [IssueCategory.SAFETY]: issues.filter(i => i.category === IssueCategory.SAFETY).length,
      [IssueCategory.ACADEMIC]: issues.filter(i => i.category === IssueCategory.ACADEMIC).length,
      [IssueCategory.ADMINISTRATION]: issues.filter(i => i.category === IssueCategory.ADMINISTRATION).length,
      [IssueCategory.SPORTS_CLUBS]: issues.filter(i => i.category === IssueCategory.SPORTS_CLUBS).length,
      [IssueCategory.SOCIAL]: issues.filter(i => i.category === IssueCategory.SOCIAL).length,
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
      {/* Side Navigation - Admin Style */}
      <aside className="w-full md:w-64 bg-indigo-950 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tighter">FACULTY PORTAL</h1>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Admin Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} label="Overview" />
          <SidebarBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<PieChart size={18} />} label="Student Analytics" />
          <SidebarBtn active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} icon={<Building2 size={18} />} label="Campus Logistics" />
          
          <div className="pt-8 px-4">
             <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-4">Quick Links</p>
             <div className="space-y-4">
                <button className="flex items-center gap-3 text-xs text-indigo-300 hover:text-white transition-colors">
                   <Bell size={14} /> Notifications
                </button>
                <button className="flex items-center gap-3 text-xs text-indigo-300 hover:text-white transition-colors">
                   <Settings size={14} /> Settings
                </button>
             </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onExit}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={14} /> Exit to Student View
          </button>
        </div>
      </aside>

      {/* Main Administrative Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
        {/* Top Action Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search roll numbers, issues..." className="w-full bg-slate-50 border border-slate-200 pl-9 py-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-slate-800">Prof. Gemini AI</p>
                 <p className="text-[10px] text-slate-400 font-bold">Admin Level 4</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
           </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
           {/* Section 1: Gemini Intelligence Brief */}
           <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/10 animate-in slide-in-from-top-4 duration-500">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-md">
                          <Sparkles className="text-cyan-400" size={20} />
                       </div>
                       <div>
                          <h3 className="font-bold text-xl tracking-tight">AI Executive Summary</h3>
                          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Automated Intelligence Report</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex gap-4 items-start bg-white/5 border border-white/10 p-4 rounded-2xl">
                          <AlertCircle className="text-rose-400 shrink-0 mt-1" size={18} />
                          <div>
                             <p className="text-sm font-bold text-white">Infrastructure Critical</p>
                             <p className="text-xs text-indigo-200 leading-relaxed mt-1">WiFi outage in Lab 3 is impacting ~250 students. IT cell has been notified automatically but requires manual approval for high-priority routing.</p>
                             <button className="mt-3 px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-600 transition-colors">Authorize Fix</button>
                          </div>
                       </div>
                       
                       <div className="flex gap-4 items-start bg-white/5 border border-white/10 p-4 rounded-2xl">
                          <TrendingDown className="text-amber-400 shrink-0 mt-1" size={18} />
                          <div>
                             <p className="text-sm font-bold text-white">Performance Alert</p>
                             <p className="text-xs text-indigo-200 leading-relaxed mt-1">Cohort average in DSP has dipped by 4% this week. Top doubt: "Filter Stability". Suggesting remedial workshop.</p>
                             <button className="mt-3 px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-colors">Broadcast Note</button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Efficiency Metrics</h4>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-inner">
                       <table className="w-full text-left text-[11px]">
                          <thead>
                             <tr className="bg-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-300">
                                <th className="px-6 py-3">Metric</th>
                                <th className="px-6 py-3">Current</th>
                                <th className="px-6 py-3">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-medium">
                             <tr>
                                <td className="px-6 py-4">Active Queries</td>
                                <td className="px-6 py-4">128 today</td>
                                <td className="px-6 py-4 text-emerald-400">High Engagement</td>
                             </tr>
                             <tr>
                                <td className="px-6 py-4">Issue Resolution</td>
                                <td className="px-6 py-4">92%</td>
                                <td className="px-6 py-4 text-emerald-400">Optimal</td>
                             </tr>
                             <tr>
                                <td className="px-6 py-4">Stress Index</td>
                                <td className="px-6 py-4">4.2 / 10</td>
                                <td className="px-6 py-4 text-cyan-400">Stable</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                    <div className="flex gap-3">
                       <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                          <p className="text-2xl font-black text-white">{analytics.activeStudents}</p>
                          <p className="text-[9px] font-bold text-indigo-400 uppercase">Tracked Scholars</p>
                       </div>
                       <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                          <p className="text-2xl font-black text-white">{analytics.averageProgress}%</p>
                          <p className="text-[9px] font-bold text-indigo-400 uppercase">Course Progress</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <BrainCircuit size={300} />
              </div>
           </section>

           {/* Section 2: Detailed Intelligence Cards */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Doubt Intelligence */}
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <BrainCircuit size={20} className="text-indigo-600" /> Hot Doubt Topics
                    </h3>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                       <Filter size={12} /> Last 7 Days
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.hotDoubts.map((doubt, idx) => (
                       <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm font-bold text-indigo-600">
                                {idx + 1}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800">{doubt.topic}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{doubt.frequency} Queries</p>
                             </div>
                          </div>
                          {doubt.trend === 'up' ? <TrendingUp size={20} className="text-rose-500" /> : <TrendingDown size={20} className="text-emerald-500" />}
                       </div>
                    ))}
                    <button className="p-5 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                       <Plus size={16} /> Add Topic to Lesson Plan
                    </button>
                 </div>
              </div>

              {/* Campus Logistics Card */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle size={20} className="text-amber-500" /> Report Volume
                 </h3>
                 <div className="space-y-4">
                    <VolumeBar label="Safety" count={analytics.issueSummary[IssueCategory.SAFETY]} color="bg-rose-500" total={10} />
                    <VolumeBar label="Infrastructure" count={analytics.issueSummary[IssueCategory.INFRASTRUCTURE]} color="bg-blue-500" total={10} />
                    <VolumeBar label="Administration" count={analytics.issueSummary[IssueCategory.ADMINISTRATION]} color="bg-indigo-500" total={10} />
                    <VolumeBar label="Academic" count={analytics.issueSummary[IssueCategory.ACADEMIC]} color="bg-amber-500" total={10} />
                 </div>
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-600 transition-colors mt-4">
                    Open Issue Hub <ChevronRight size={14} />
                 </button>
              </div>
           </div>

           {/* Section 3: Student Cohort Management */}
           <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg">Student Cohort List</h3>
                    <p className="text-xs text-slate-400 font-medium">B.Tech - Computer Science • Year 3</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">Filter</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all">Export Report</button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs">
                    <thead>
                       <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-widest">
                          <th className="pb-4 px-2">Student</th>
                          <th className="pb-4 px-2">Progress</th>
                          <th className="pb-4 px-2 text-center">Engagement</th>
                          <th className="pb-4 px-2 text-center">Avg Score</th>
                          <th className="pb-4 px-2 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       <CohortRow name="Alice Johnson" roll="2021CS01" progress={85} streak={14} score="92%" />
                       <CohortRow name="Bob Smith" roll="2021CS02" progress={42} streak={2} score="64%" status="lagging" />
                       <CohortRow name="Charlie Davis" roll="2021CS03" progress={78} streak={9} score="88%" />
                       <CohortRow name="Dana White" roll="2021CS04" progress={95} streak={22} score="96%" status="top" />
                    </tbody>
                 </table>
              </div>
           </section>
        </div>
      </main>
    </div>
  );
};

const SidebarBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg' 
        : 'text-indigo-300 hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

const VolumeBar: React.FC<{ label: string; count: number; color: string; total: number }> = ({ label, count, color, total }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
      <span>{label}</span>
      <span>{count} Issues</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${(count / total) * 100}%` }}></div>
    </div>
  </div>
);

const CohortRow: React.FC<{ name: string; roll: string; progress: number; streak: number; score: string; status?: 'lagging' | 'top' }> = ({ name, roll, progress, streak, score, status }) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="py-4 px-2">
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] border border-indigo-100">
            {name.split(' ').map(n => n[0]).join('')}
         </div>
         <div>
            <p className="font-bold text-slate-800">{name}</p>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">{roll}</p>
         </div>
      </div>
    </td>
    <td className="py-4 px-2">
       <div className="w-24">
          <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
             <span>{progress}%</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full">
             <div className={`h-full rounded-full ${progress < 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
          </div>
       </div>
    </td>
    <td className="py-4 px-2 text-center font-bold text-slate-700">
       <div className="flex items-center justify-center gap-1">
          <Flame size={12} className={streak > 10 ? 'text-orange-500' : 'text-slate-300'} />
          {streak}d
       </div>
    </td>
    <td className="py-4 px-2 text-center">
       <span className={`px-2 py-1 rounded-md text-[10px] font-black ${status === 'lagging' ? 'bg-rose-50 text-rose-600' : status === 'top' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
          {score}
       </span>
    </td>
    <td className="py-4 px-2 text-right">
       <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <MessageCircle size={16} />
       </button>
       <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <UserCheck size={16} />
       </button>
    </td>
  </tr>
);

export default FacultyDashboard;
