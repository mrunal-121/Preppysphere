
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  AlertCircle, 
  Heart, 
  MessageSquare,
  User,
  Info,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { ViewState, CommunityIssue, UserProfile, TodoTask, SmartNotification } from './types';
import Dashboard from './components/Dashboard';
import StudyPlanner from './components/StudyPlanner';
import IssueTracker from './components/IssueTracker';
import WellnessCenter from './components/WellnessCenter';
import DoubtAssistant from './components/DoubtAssistant';
import Profile from './components/Profile';
import Features from './components/Features';
import FacultyDashboard from './components/FacultyDashboard';
import SmartNotificationCenter from './components/SmartNotificationCenter';
import Login from './components/Login';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [formalityTasks, setFormalityTasks] = useState<TodoTask[]>([]);
  const [smartNotifications, setSmartNotifications] = useState<SmartNotification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: 'Scholar',
    major: 'Undecided',
    collegeCampus: '',
    department: '',
    grade: '',
    streak: 0,
    role: 'student'
  });

  const unreadCount = smartNotifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isMvpAccess = params.get('mvp') === 'true';
    const savedLogin = localStorage.getItem('preppysphere_logged_in');
    
    if (isMvpAccess || savedLogin === 'true') {
      setIsLoggedIn(true);
      if (isMvpAccess) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const savedIssues = localStorage.getItem('preppysphere_issues');
    if (savedIssues) setIssues(JSON.parse(savedIssues));
    
    const savedTasks = localStorage.getItem('preppysphere_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    
    const savedFormalityTasks = localStorage.getItem('preppysphere_formality_tasks');
    if (savedFormalityTasks) setFormalityTasks(JSON.parse(savedFormalityTasks));

    const savedNotes = localStorage.getItem('preppysphere_notifications');
    if (savedNotes) setSmartNotifications(JSON.parse(savedNotes));

    const savedProfileStr = localStorage.getItem('preppysphere_profile');
    let currentProfile: UserProfile;
    
    if (savedProfileStr) {
      currentProfile = JSON.parse(savedProfileStr);
    } else {
      currentProfile = { 
        name: 'Scholar',
        major: 'Undecided',
        collegeCampus: '',
        department: '',
        grade: '',
        streak: 0,
        role: 'student'
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const lastDate = currentProfile.lastActiveDate;

    if (lastDate !== today) {
      let newStreak = currentProfile.streak || 0;
      if (lastDate) {
        const last = new Date(lastDate);
        const current = new Date(today);
        const diffTime = current.getTime() - last.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      } else {
        newStreak = Math.max(newStreak, 1);
      }
      currentProfile = { ...currentProfile, streak: newStreak, lastActiveDate: today };
      localStorage.setItem('preppysphere_profile', JSON.stringify(currentProfile));
    }
    
    setUserProfile(currentProfile);
  }, []);

  const handleLogin = (userData: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...userData };
    setUserProfile(newProfile);
    setIsLoggedIn(true);
    localStorage.setItem('preppysphere_logged_in', 'true');
    localStorage.setItem('preppysphere_profile', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('preppysphere_logged_in');
    setActiveView('home');
  };

  const addSmartNotifications = (newNotes: SmartNotification[]) => {
    const existingTitles = new Set(smartNotifications.map(n => n.title));
    const filtered = newNotes.filter(n => !existingTitles.has(n.title));
    if (filtered.length === 0) return;

    const merged = [...filtered, ...smartNotifications].slice(0, 20);
    setSmartNotifications(merged);
    localStorage.setItem('preppysphere_notifications', JSON.stringify(merged));
  };

  const markNotificationRead = (id: string) => {
    const updated = smartNotifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setSmartNotifications(updated);
    localStorage.setItem('preppysphere_notifications', JSON.stringify(updated));
  };

  const clearNotifications = () => {
    setSmartNotifications([]);
    localStorage.removeItem('preppysphere_notifications');
  };

  const isFacultyMode = activeView === 'faculty';

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <Dashboard 
            setActiveView={setActiveView} 
            userProfile={userProfile} 
            issuesCount={issues.length} 
            tasks={tasks}
            setTasks={(t) => { setTasks(t); localStorage.setItem('preppysphere_tasks', JSON.stringify(t)); }}
            formalityTasks={formalityTasks}
            setFormalityTasks={(t) => { setFormalityTasks(t); localStorage.setItem('preppysphere_formality_tasks', JSON.stringify(t)); }}
            onAddNotifications={addSmartNotifications}
          />
        );
      case 'study': return <StudyPlanner />;
      case 'issues': return <IssueTracker issues={issues} setIssues={(i) => { setIssues(i); localStorage.setItem('preppysphere_issues', JSON.stringify(i)); }} />;
      case 'wellness': return <WellnessCenter />;
      case 'chat': return <DoubtAssistant />;
      case 'faculty': return <FacultyDashboard issues={issues} onExit={() => setActiveView('home')} />;
      case 'profile': return <Profile profile={userProfile} onSave={(p) => { setUserProfile(p); localStorage.setItem('preppysphere_profile', JSON.stringify(p)); }} onLogout={handleLogout} onBack={() => setActiveView('home')} />;
      case 'features': return <Features onBack={() => setActiveView('home')} />;
      default: return <Dashboard setActiveView={setActiveView} userProfile={userProfile} issuesCount={issues.length} tasks={tasks} setTasks={setTasks} formalityTasks={formalityTasks} setFormalityTasks={setFormalityTasks} onAddNotifications={addSmartNotifications} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isFacultyMode ? 'bg-indigo-950' : 'bg-slate-50'} text-slate-900 overflow-hidden`}>
      {/* Student Top Header - Hidden in Faculty Mode */}
      {!isFacultyMode && (
        <header className="bg-white/80 backdrop-blur-md px-6 pt-10 pb-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Logo size="sm" showText={false} />
            <div className="flex flex-col">
              <h1 className="text-xl font-black logo-text tracking-tighter">PreppySphere</h1>
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none">By Gemini AI</span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {userProfile.role === 'faculty' && (
              <button 
                onClick={() => setActiveView('faculty')}
                className="px-4 py-2 bg-indigo-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 animate-in zoom-in"
              >
                <ShieldCheck size={14} /> Admin Portal
              </button>
            )}
            <button 
              onClick={() => setShowNotificationCenter(true)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all relative ${unreadCount > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-white text-slate-400 shadow-sm'}`}
            >
              <Bell size={18} className={unreadCount > 0 ? 'animate-pulse' : ''} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => setActiveView('profile')} className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden ${activeView === 'profile' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-white text-slate-400 shadow-sm'}`}>
              <User size={18} className={activeView === 'profile' ? 'text-white' : 'text-slate-400'} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto ${isFacultyMode ? '' : 'pb-24 scroll-smooth'}`}>
        <div className={isFacultyMode ? "" : "p-6"}>
          {renderView()}
        </div>
      </main>

      {/* Student Notification Center */}
      {showNotificationCenter && !isFacultyMode && (
        <SmartNotificationCenter 
          notifications={smartNotifications}
          onClose={() => setShowNotificationCenter(false)}
          onClear={clearNotifications}
          onMarkRead={markNotificationRead}
          onAction={(view) => {
            setActiveView(view);
            setShowNotificationCenter(false);
          }}
        />
      )}

      {/* Student Bottom Navigation Bar - Hidden in Faculty Mode */}
      {!isFacultyMode && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 pb-6 flex justify-between items-center z-50">
          <NavButton active={activeView === 'home'} onClick={() => setActiveView('home')} icon={<Home size={22} />} label="Home" />
          <NavButton active={activeView === 'study'} onClick={() => setActiveView('study')} icon={<BookOpen size={22} />} label="Study" />
          <NavButton active={activeView === 'chat'} onClick={() => setActiveView('chat')} icon={<MessageSquare size={22} />} label="Doubts" />
          <NavButton active={activeView === 'wellness'} onClick={() => setActiveView('wellness')} icon={<Heart size={22} />} label="Wellness" />
          <NavButton active={activeView === 'issues'} onClick={() => setActiveView('issues')} icon={<AlertCircle size={22} />} label="Issues" />
        </nav>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .logo-text {
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 40%, #8b5cf6 70%, #d946ef 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}} />
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

export default App;
