
import React, { useState } from 'react';
import { 
  BookOpen, 
  AlertCircle, 
  Heart, 
  MessageCircle, 
  ArrowRight, 
  Trophy, 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  X,
  FileText,
  Flame,
  Wrench,
  Megaphone,
  Calendar,
  Sparkles,
  Clock
} from 'lucide-react';
import { ViewState, UserProfile, TodoTask } from '../types';

interface DashboardProps {
  setActiveView: (view: ViewState) => void;
  issuesCount: number;
  userProfile: UserProfile;
  tasks: TodoTask[];
  setTasks: (tasks: TodoTask[]) => void;
  formalityTasks: TodoTask[];
  setFormalityTasks: (tasks: TodoTask[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  setActiveView, 
  issuesCount, 
  userProfile, 
  tasks, 
  setTasks,
  formalityTasks,
  setFormalityTasks 
}) => {
  const [showTodoList, setShowTodoList] = useState(false);
  const [showFormalitiesList, setShowFormalitiesList] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newFormalityText, setNewFormalityText] = useState('');
  const [newFormalityDeadline, setNewFormalityDeadline] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const formalityCompletedCount = formalityTasks.filter(t => t.completed).length;
  const formalityPercentage = formalityTasks.length > 0 ? Math.round((formalityCompletedCount / formalityTasks.length) * 100) : 0;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleFormalityTask = (id: string) => {
    setFormalityTasks(formalityTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: TodoTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const addFormalityTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormalityText.trim()) return;
    const newTask: TodoTask = {
      id: Date.now().toString(),
      text: newFormalityText.trim(),
      completed: false,
      deadline: newFormalityDeadline || undefined
    };
    setFormalityTasks([...formalityTasks, newTask]);
    setNewFormalityText('');
    setNewFormalityDeadline('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const deleteFormalityTask = (id: string) => {
    setFormalityTasks(formalityTasks.filter(t => t.id !== id));
  };

  const handleToggleGoals = () => {
    setShowTodoList(!showTodoList);
    setShowFormalitiesList(false);
  };

  const handleToggleFormalities = () => {
    setShowFormalitiesList(!showFormalitiesList);
    setShowTodoList(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Welcome Section */}
      <section>
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Hi, {userProfile.name}! 👋</h2>
            <p className="text-indigo-100 text-sm opacity-90 mb-4">
              {userProfile.grade ? `${userProfile.grade} ` : ''} 
              {userProfile.major !== 'Undecided' ? `${userProfile.major} Student` : 'Scholar'}
              {userProfile.collegeCampus ? ` at ${userProfile.collegeCampus}` : ''}. 
              Gemini has a plan for you.
            </p>
            <button 
              onClick={() => setActiveView('study')}
              className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Resume Prep <ArrowRight size={16} />
            </button>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl opacity-30"></div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-3 gap-3">
        {/* Goal Completion Card */}
        <div 
          onClick={handleToggleGoals}
          className={`bg-white p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            showTodoList ? 'border-indigo-400 shadow-md ring-2 ring-indigo-50' : 'border-slate-100 shadow-sm hover:border-slate-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              showTodoList ? 'bg-indigo-600 text-white' : 'bg-green-50 text-green-600'
            }`}>
              <Trophy size={16} />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{completionPercentage}%</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Goals</p>
          </div>
        </div>

        {/* Campus Task Card */}
        <div 
          onClick={handleToggleFormalities}
          className={`bg-white p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            showFormalitiesList ? 'border-blue-400 shadow-md ring-2 ring-blue-50' : 'border-slate-100 shadow-sm hover:border-slate-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              showFormalitiesList ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
            }`}>
              <FileText size={16} />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{formalityPercentage}%</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Campus Task</p>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div 
          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all cursor-default relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Flame size={16} className={userProfile.streak > 0 ? "animate-bounce" : ""} />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{userProfile.streak || 0}</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Day Streak</p>
          </div>
        </div>
      </section>

      {/* Interactive To-Do List (Goals) */}
      {showTodoList && (
        <section className="animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white rounded-[2.5rem] border border-indigo-100 shadow-xl overflow-hidden">
            <div className="bg-indigo-50 px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                <CheckCircle2 size={18} /> My Daily Goals
              </h3>
              <button onClick={() => setShowTodoList(false)} className="text-indigo-400 hover:text-indigo-600 p-1">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <form onSubmit={addTask} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="What's your next goal?"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {tasks.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">No goals set yet.</p>
                ) : (
                  tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        task.completed ? 'bg-slate-50 border-slate-50' : 'bg-white border-slate-100 shadow-sm'
                      }`}
                    >
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`transition-colors ${task.completed ? 'text-green-500' : 'text-slate-300'}`}
                      >
                        {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                      </button>
                      <span className={`flex-1 text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.text}
                      </span>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive To-Do List (Campus Tasks) */}
      {showFormalitiesList && (
        <section className="animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white rounded-[2.5rem] border border-blue-100 shadow-xl overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                <FileText size={18} /> Campus Task Manager
              </h3>
              <button onClick={() => setShowFormalitiesList(false)} className="text-blue-400 hover:text-blue-600 p-1">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <form onSubmit={addFormalityTask} className="space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Task name (e.g. ID verification)"
                    value={newFormalityText}
                    onChange={(e) => setNewFormalityText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <Calendar size={14} className="absolute left-4 top-3.5 text-slate-400" />
                    <input 
                      type="date" 
                      value={newFormalityDeadline}
                      onChange={(e) => setNewFormalityDeadline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-600"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!newFormalityText.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {formalityTasks.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">No campus tasks added yet.</p>
                ) : (
                  formalityTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`flex flex-col gap-1 p-3 rounded-2xl border transition-all ${
                        task.completed ? 'bg-slate-50 border-slate-50' : 'bg-white border-slate-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleFormalityTask(task.id)}
                          className={`transition-colors ${task.completed ? 'text-blue-500' : 'text-slate-300'}`}
                        >
                          {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                        </button>
                        <span className={`flex-1 text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {task.text}
                        </span>
                        <button 
                          onClick={() => deleteFormalityTask(task.id)}
                          className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {task.deadline && (
                        <div className="ml-9 flex items-center gap-1.5 text-[10px] font-bold text-blue-500/70 bg-blue-50 w-fit px-2 py-0.5 rounded-lg border border-blue-100">
                          <Clock size={10} />
                          Deadline: {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
          <Target size={14} /> AI Services
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard 
            title="Doubt Support" 
            desc="Solve concepts instantly" 
            icon={<MessageCircle className="text-blue-500" />} 
            color="bg-blue-50"
            onClick={() => setActiveView('chat')}
          />
          <ServiceCard 
            title="Study Plans" 
            desc="Personalized AI schedules" 
            icon={<BookOpen className="text-purple-500" />} 
            color="bg-purple-50"
            onClick={() => setActiveView('study')}
          />
          <ServiceCard 
            title="Wellness" 
            desc="Tips for stress & focus" 
            icon={<Heart className="text-rose-500" />} 
            color="bg-rose-50"
            onClick={() => setActiveView('wellness')}
          />
          <ServiceCard 
            title="Campus Issues" 
            desc={`${issuesCount} issues reported`} 
            icon={<AlertCircle className="text-amber-500" />} 
            color="bg-amber-50"
            onClick={() => setActiveView('issues')}
          />
        </div>
      </section>

      {/* Community Feed */}
      <section>
         <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Megaphone size={14} /> Community Feed
            </h3>
            <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">See All</button>
         </div>
         <div className="space-y-3">
            {/* Maintenance Update */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex gap-4 hover:border-indigo-100 transition-colors">
               <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Wrench size={18} />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                     <p className="text-xs font-bold text-slate-800">Campus Maintenance</p>
                     <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Resolved</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">Fixed: Lighting in Library Hall B. Thanks for the AI report!</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">2 hours ago</span>
               </div>
            </div>

            {/* Event Announcement */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex gap-4 hover:border-purple-100 transition-colors">
               <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar size={18} />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                     <p className="text-xs font-bold text-slate-800">Student Union</p>
                     <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">Upcoming</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">Hackathon 2024 registration starts tomorrow! Visit the portal.</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">5 hours ago</span>
               </div>
            </div>

            {/* AI Wellness Tip */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-5 border border-blue-100 shadow-sm flex gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={18} />
               </div>
               <div className="flex-1">
                  <p className="text-xs font-bold text-blue-800 mb-1">Gemini Wellness Minute</p>
                  <p className="text-sm text-blue-700 leading-relaxed font-medium italic">"Taking a 5-minute walk between classes can boost retention by 20%."</p>
                  <span className="text-[10px] text-blue-400 mt-2 block font-bold">Just Now</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

const ServiceCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, desc, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start text-left gap-3 group"
  >
    <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-[10px] text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
  </button>
);

export default Dashboard;
