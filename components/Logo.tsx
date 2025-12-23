
import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 40 : 60;
  const containerSize = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-20 h-20' : 'w-28 h-28';
  const fontSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-3xl' : 'text-5xl';

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center mb-2">
        {/* Simple Glow Background */}
        <div className={`absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl ${size === 'sm' ? 'opacity-0' : 'opacity-100'}`}></div>
        
        <div className={`${containerSize} bg-white rounded-3xl shadow-xl shadow-indigo-100/50 flex items-center justify-center border border-slate-50 relative z-10 transition-transform duration-500 hover:rotate-3`}>
          <GraduationCap size={iconSize} className="text-indigo-600" />
        </div>
      </div>

      {showText && (
        <h1 className={`logo-text mt-2 text-center font-black tracking-tighter ${fontSize}`}>
          PreppySphere
        </h1>
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

export default Logo;
