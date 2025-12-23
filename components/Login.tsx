
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  User, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  UserPlus,
  LogIn,
  School,
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';
import { UserProfile } from '../types';
import Logo from './Logo';

interface LoginProps {
  onLogin: (userData: Partial<UserProfile>) => void;
}

type AuthMode = 'login' | 'register' | 'success';

interface UserAccount {
  username: string;
  password: string;
  name: string;
  collegeName: string;
  degree: string;
  course: string;
  grade: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [degree, setDegree] = useState('');
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const getAccounts = (): UserAccount[] => {
    const stored = localStorage.getItem('preppysphere_accounts');
    return stored ? JSON.parse(stored) : [];
  };

  const saveAccount = (account: UserAccount) => {
    const accounts = getAccounts();
    accounts.push(account);
    localStorage.setItem('preppysphere_accounts', JSON.stringify(accounts));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword || !displayName || !collegeName || !degree || !course || !grade) {
      setError('Please fill in all academic and identity fields');
      triggerShake();
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      triggerShake();
      return;
    }

    const accounts = getAccounts();
    if (accounts.some(acc => acc.username.toLowerCase() === username.toLowerCase())) {
      setError('Username already taken');
      triggerShake();
      return;
    }

    setIsLoading(true);
    // Simulate API Delay
    setTimeout(() => {
      const newUser: UserAccount = { 
        username, 
        password, 
        name: displayName,
        collegeName,
        degree,
        course,
        grade
      };
      saveAccount(newUser);
      setMode('success');
      setTimeout(() => {
        onLogin({
          name: displayName,
          username: username,
          collegeCampus: collegeName,
          department: degree,
          major: course,
          grade: grade,
          streak: 1,
        });
      }, 2000);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Enter your credentials');
      triggerShake();
      return;
    }

    setIsLoading(true);
    // Simulate API Delay
    setTimeout(() => {
      const accounts = getAccounts();
      const user = accounts.find(acc => acc.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        setError('Account not found');
        triggerShake();
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        setError('Incorrect password');
        triggerShake();
        setIsLoading(false);
        return;
      }

      setMode('success');
      setTimeout(() => {
        onLogin({
          name: user.name,
          username: user.username,
          collegeCampus: user.collegeName,
          department: user.degree,
          major: user.course,
          grade: user.grade,
        });
      }, 2000);
    }, 1200);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setCollegeName('');
    setDegree('');
    setCourse('');
    setGrade('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background with lighter gradients to match new logo */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        {/* Branding with new Logo */}
        <div className="mb-4">
          <Logo size="md" showText={true} />
        </div>

        {/* Auth Card */}
        <div className={`bg-white/80 backdrop-blur-2xl p-8 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(31,41,55,0.1)] border border-white/50 flex flex-col justify-center relative transition-all duration-500 ${isShaking ? 'animate-shake' : ''}`}>
          
          {mode !== 'success' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Student Registration'}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {mode === 'login' ? 'Sign in to access your dashboard' : 'Join your campus digital sphere'}
                </p>
              </div>

              <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3">
                <div className={`${mode === 'register' ? 'max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-3' : 'space-y-3'}`}>
                  {mode === 'register' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Identity</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                            <User size={16} />
                          </div>
                          <input 
                            type="text" 
                            placeholder="Full Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-11 rounded-2xl outline-none transition-all text-sm font-semibold text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Academic Details</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                            <School size={16} />
                          </div>
                          <input 
                            type="text" 
                            placeholder="College Name"
                            value={collegeName}
                            onChange={(e) => setCollegeName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-11 rounded-2xl outline-none transition-all text-sm font-semibold text-slate-700"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                              <Award size={16} />
                            </div>
                            <input 
                              type="text" 
                              placeholder="Degree"
                              value={degree}
                              onChange={(e) => setDegree(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-10 rounded-2xl outline-none transition-all text-[11px] font-semibold text-slate-700"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                              <Calendar size={16} />
                            </div>
                            <input 
                              type="text" 
                              placeholder="Grade/Year"
                              value={grade}
                              onChange={(e) => setGrade(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-10 rounded-2xl outline-none transition-all text-[11px] font-semibold text-slate-700"
                            />
                          </div>
                        </div>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                            <BookOpen size={16} />
                          </div>
                          <input 
                            type="text" 
                            placeholder="Course / Major"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-11 rounded-2xl outline-none transition-all text-sm font-semibold text-slate-700"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    {mode === 'register' && <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Account Credentials</label>}
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                        <User size={16} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-11 rounded-2xl outline-none transition-all text-sm font-semibold text-slate-700"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                        <Lock size={16} />
                      </div>
                      <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-11 rounded-2xl outline-none transition-all text-sm font-semibold text-slate-700"
                      />
                    </div>

                    {mode === 'register' && (
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                          <Lock size={16} />
                        </div>
                        <input 
                          type="password" 
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-blue-100 p-3.5 pl-11 rounded-2xl outline-none transition-all text-sm font-semibold text-slate-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold px-4 py-2 bg-rose-50/50 rounded-xl animate-in fade-in">
                    <AlertCircle size={12} />
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-40"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  onClick={switchMode}
                  className="text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                  {mode === 'login' ? (
                    <>Don't have an account? <span className="text-blue-600">Register now</span></>
                  ) : (
                    <>Already a member? <span className="text-blue-600">Login here</span></>
                  )}
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {mode === 'success' && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-700 flex flex-col items-center justify-center py-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center shadow-lg relative">
                  <CheckCircle2 size={40} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Granted</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Preparing your dashboard...</p>
              </div>
              <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-indefinite w-full"></div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-400 font-semibold px-10 leading-relaxed opacity-60">
          Secure campus verification protocols active. Your data is encrypted and used only for academic personalization.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes progress-indefinite {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-indefinite {
          animation: progress-indefinite 1.5s infinite linear;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default Login;
