
import React, { useState } from 'react';
import { User, ArrowLeft, Save, CheckCircle, GraduationCap, MapPin, Building2, School, AtSign, Info, Sparkles, LogOut, ShieldCheck, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onLogout: () => void;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onSave, onLogout, onBack }) => {
  const [name, setName] = useState(profile.name);
  const [major, setMajor] = useState(profile.major);
  const [campus, setCampus] = useState(profile.collegeCampus || '');
  const [department, setDepartment] = useState(profile.department || '');
  const [grade, setGrade] = useState(profile.grade || '');
  const [role, setRole] = useState(profile.role || 'student');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ 
      ...profile,
      name,
      major, 
      collegeCampus: campus, 
      department, 
      grade,
      role
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Identity Dashboard</h2>
          <p className="text-xs text-slate-400 font-medium">Manage your roles and data</p>
        </div>
      </div>

      {/* Role Toggle for MVP */}
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2.5rem] flex flex-col items-center gap-4">
         <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${role === 'faculty' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
               {role === 'faculty' ? <ShieldCheck size={24} /> : <GraduationCap size={24} />}
            </div>
            <div>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Identity</p>
               <h3 className="font-bold text-slate-800 capitalize">{role} Account</h3>
            </div>
         </div>
         <button 
           onClick={() => setRole(role === 'student' ? 'faculty' : 'student')}
           className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm active:scale-95 transition-all"
         >
            <RefreshCw size={14} /> Switch to {role === 'student' ? 'Faculty' : 'Student'} Mode
         </button>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -inset-2 border-2 border-dashed border-indigo-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
          
          <div className="w-36 h-36 rounded-full bg-white border-4 border-white shadow-2xl flex items-center justify-center relative z-10 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
              <User size={72} className="text-indigo-300 translate-y-2" />
            </div>
          </div>
          
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
            <GraduationCap size={24} />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{name || 'Scholar'}</h3>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
            <AtSign size={10} />
            <span>{profile.username || 'student_id'}</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-indigo-50/50 space-y-6">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Info size={12} /> Personal Details
          </h4>
          
          <div className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Display Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all text-sm font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">College / University</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <School size={18} />
                </div>
                <input 
                  type="text" 
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder="University name"
                  className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all text-sm font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Department</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <Building2 size={18} />
                </div>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Science & Tech"
                  className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all text-sm font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Course</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <GraduationCap size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="Major"
                    className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>
              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Grade / Year</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Year 1"
                    className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className={`w-full py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
              saved 
                ? 'bg-green-500 text-white shadow-green-100 animate-in zoom-in-95' 
                : 'bg-slate-900 text-white shadow-slate-200 hover:bg-indigo-600'
            }`}
          >
            {saved ? <CheckCircle size={20} /> : <Save size={20} />}
            {saved ? 'IDENTITY UPDATED' : 'SAVE CHANGES'}
          </button>
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-5 rounded-[2.5rem] bg-white border border-rose-100 text-rose-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-50 transition-all active:scale-95 shadow-sm"
        >
          <LogOut size={18} />
          Sign Out of Sphere
        </button>
      </div>
    </div>
  );
};

export default Profile;
