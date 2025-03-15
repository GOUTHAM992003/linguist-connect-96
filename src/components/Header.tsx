
import React from 'react';
import { Globe } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`w-full py-4 md:py-6 px-4 flex items-center justify-between animate-slide-down ${className}`}>
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center shadow-sm">
          <Globe className="h-6 w-6 text-white" />
        </div>
        <div className="font-display">
          <h1 className="text-xl font-bold tracking-tight">LinguistConnect</h1>
          <p className="text-xs text-muted-foreground">AI-Powered Translation</p>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="text-sm font-medium hover:text-brand-600 transition-colors">Translate</a>
        <a href="#" className="text-sm font-medium hover:text-brand-600 transition-colors">Documents</a>
        <a href="#" className="text-sm font-medium hover:text-brand-600 transition-colors">About</a>
      </nav>
      
      <div className="flex items-center gap-2">
        <button className="button-animation px-4 py-2 rounded-lg bg-brand-50 text-brand-700 font-medium text-sm">
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;
