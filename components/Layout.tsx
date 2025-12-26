
import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onNavigate?: (module: 'home' | 'practice' | 'exam' | 'wrong' | 'random') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentModule, onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="tech-gradient text-white p-4 sticky top-0 z-50 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight">AI训练师刷题宝</h1>
        </div>
        {currentModule !== 'home' && onNavigate && (
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <Home size={16} />
            首页
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
