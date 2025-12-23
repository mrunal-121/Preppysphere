
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  AlertCircle, 
  Heart, 
  MessageSquare,
  User,
  Info
} from 'lucide-react';
import { ViewState, CommunityIssue, UserProfile, TodoTask } from './types';
import Dashboard from './components/Dashboard';
import StudyPlanner from './components/StudyPlanner';
import IssueTracker from './components/IssueTracker';
import WellnessCenter from './components/WellnessCenter';
import DoubtAssistant from './components/DoubtAssistant';
import Profile from './components/Profile';
import Features from './components/Features';
import Login from './components/Login';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [formalityTasks, setFormalityTasks] = useState<TodoTask[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: 'Scholar',
    major: 'Undecided',
    collegeCampus: '',
    department: '',
    grade: '',
    streak: 0
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedLogin = localStorage.getItem('preppysphere_logged_in');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }

    const savedIssues = localStorage.getItem('preppysphere_issues');
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    }
    
    const savedTasks = localStorage.getItem('preppysphere_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: '1', text: 'Complete Math assignment', completed: false },
        { id: '2', text: 'Read Biology Chapter 3', completed: true },
      ]);
    }
    
    const savedFormalityTasks = localStorage.getItem('preppysphere_formality_tasks');
    if (savedFormalityTasks) {
      setFormalityTasks(JSON.parse(savedFormalityTasks));
    }

    // Profile & Streak Logic
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
        streak: 0
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

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
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

  const saveIssues = (newIssues: CommunityIssue[]) => {
    setIssues(newIssues);
    localStorage.setItem('preppysphere_issues', JSON.stringify(newIssues));
  };

  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('preppysphere_profile', JSON.stringify(newProfile));
  };

  const saveTasks = (newTasks: TodoTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('preppysphere_tasks', JSON.stringify(newTasks));
  };

  const saveFormalityTasks = (newTasks: TodoTask[]) => {
    setFormalityTasks(newTasks);
    localStorage.setItem('preppysphere_formality_tasks', JSON.stringify(newTasks));
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <Dashboard 
            setActiveView={setActiveView} 
            userProfile={userProfile} 
            issuesCount={issues.length} 
            tasks={tasks}
            setTasks={saveTasks}
            formalityTasks={formalityTasks}
            setFormalityTasks={saveFormalityTasks}
          />
        );
      case 'study':
        return <StudyPlanner />;
      case 'issues':
        return <IssueTracker issues={issues} setIssues={saveIssues} />;
      case 'wellness':
        return <WellnessCenter />;
      case 'chat':
        return <DoubtAssistant />;
      case 'profile':
        return <Profile profile={userProfile} onSave={saveProfile} onBack={() => setActiveView('home')} />;
      case 'features':
        return <Features onBack={() => setActiveView('home')} />;
      default:
        return (
          <Dashboard 
            setActiveView={setActiveView} 
            userProfile={userProfile} 
            issuesCount={issues.length} 
            tasks={tasks}
            setTasks={saveTasks}
            formalityTasks={formalityTasks}
            setFormalityTasks={saveFormalityTasks}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md px-6 pt-10 pb-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Logo size="sm" showText={false} />
          <div>
            <h1 className="text-xl font-black logo-text tracking-tighter">
              PreppySphere
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">By Gemini AI</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button 
            onClick={() => setActiveView('features')}
            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
              activeView === 'features' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-white text-slate-400 shadow-sm'
            }`}
          >
            <Info size={18} />
          </button>
          <button 
            onClick={() => setActiveView('profile')}
            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden ${
              activeView === 'profile' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-white text-slate-400 shadow-sm'
            }`}
          >
            <User size={18} className={activeView === 'profile' ? 'text-white' : 'text-slate-400'} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <div className="p-6">
          {renderView()}
        </div>
      </main>

      {/* Navigation Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 pb-6 flex justify-between items-center z-50">
        <NavButton 
          active={activeView === 'home'} 
          onClick={() => setActiveView('home')} 
          icon={<Home size={22} />} 
          label="Home" 
        />
        <NavButton 
          active={activeView === 'study'} 
          onClick={() => setActiveView('study')} 
          icon={<BookOpen size={22} />} 
          label="Study" 
        />
        <NavButton 
          active={activeView === 'chat'} 
          onClick={() => setActiveView('chat')} 
          icon={<MessageSquare size={22} />} 
          label="Doubts"
        />
        <NavButton 
          active={activeView === 'wellness'} 
          onClick={() => setActiveView('wellness')} 
          icon={<Heart size={22} />} 
          label="Wellness" 
        />
        <NavButton 
          active={activeView === 'issues'} 
          onClick={() => setActiveView('issues')} 
          icon={<AlertCircle size={22} />} 
          label="Issues" 
        />
      </nav>

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
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
      {label}
    </span>
  </button>
);

export default App;
