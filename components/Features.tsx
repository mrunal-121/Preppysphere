
import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  AlertCircle, 
  Heart, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface FeaturesProps {
  onBack: () => void;
}

const Features: React.FC<FeaturesProps> = ({ onBack }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">App Features</h2>
          <p className="text-xs text-slate-400">Discover what Preppysphere can do</p>
        </div>
      </div>

      {/* Main Description Card */}
      <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md">
            <Sparkles size={24} />
          </div>
          <h3 className="text-2xl font-bold">The AI-First Student Ecosystem</h3>
          <p className="text-indigo-50 text-sm leading-relaxed opacity-90">
            Preppysphere is designed to be the ultimate companion for modern students. 
            By leveraging Google's Gemini AI, we bridge the gap between academic pressure, 
            campus administrative tasks, and mental well-being.
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 gap-6">
        <FeatureCard 
          icon={<BookOpen className="text-purple-600" />}
          title="AI Study Planner"
          description="Gemini analyzes your subject and available time to generate a step-by-step milestone plan with expert tips for better retention."
          bgColor="bg-purple-50"
          accentColor="border-purple-100"
        />
        
        <FeatureCard 
          icon={<MessageSquare className="text-blue-600" />}
          title="Doubt Assistant"
          description="Instant conceptual clarity. Our AI Tutor explains complex topics in simple, plain language, avoiding jargon and markdown for pure focus."
          bgColor="bg-blue-50"
          accentColor="border-blue-100"
        />

        <FeatureCard 
          icon={<CheckCircle2 className="text-emerald-600" />}
          title="Campus Task Manager"
          description="Stay organized with deadlines. Track university formalities like ID verification or library returns with custom user-defined deadlines."
          bgColor="bg-emerald-50"
          accentColor="border-emerald-100"
        />

        <FeatureCard 
          icon={<AlertCircle className="text-amber-600" />}
          title="Smart Issue Tracker"
          description="Report campus infrastructure or safety issues. Our AI automatically categorizes and routes reports to the correct department (e.g. Maintenance or Dean)."
          bgColor="bg-amber-50"
          accentColor="border-amber-100"
        />

        <FeatureCard 
          icon={<Heart className="text-rose-600" />}
          title="Wellness Center"
          description="A holistic approach to student health. Includes a rapid Stress Buster analysis and AI-personalized tips for mental and social well-being."
          bgColor="bg-rose-50"
          accentColor="border-rose-100"
        />

        <FeatureCard 
          icon={<Globe className="text-indigo-600" />}
          title="Community Feed"
          description="Stay updated with resolved campus issues, club events, and a 'Gemini Tip of the Hour' to keep you motivated throughout the day."
          bgColor="bg-indigo-50"
          accentColor="border-indigo-100"
        />
      </div>

      {/* Security Section */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-white/10 rounded-2xl">
            <ShieldCheck className="text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold">Privacy & Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We use secure university email authentication (OTP verified) to ensure only authorized students access the campus-wide reporting system. Your data is used exclusively to personalize your academic experience.
            </p>
          </div>
        </div>
      </section>

      <div className="text-center py-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version 2.0 • Powered by Gemini AI</p>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  accentColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, bgColor, accentColor }) => (
  <div className={`p-6 rounded-[2rem] bg-white border ${accentColor} shadow-sm flex gap-5 hover:shadow-md transition-all group`}>
    <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="space-y-2">
      <h4 className="font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default Features;
