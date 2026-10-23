import React from 'react';
import { Pin, AlertTriangle, Bookmark, LayoutGrid, Calendar, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenPinModal: () => void;
  onOpenConflicts: () => void;
  conflictCount: number;
  activeView: 'board' | 'decoded' | 'timeline' | 'bookmarks' | 'login' | 'agent';
  onViewChange: (view: 'board' | 'decoded' | 'timeline' | 'bookmarks' | 'login' | 'agent') => void;
  bookmarksCount: number;
  currentUser: { name: string; email: string } | null;
  onLogout: () => void;
  onOpenPosterAutomation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPinModal,
  onOpenConflicts,
  conflictCount,
  activeView,
  onViewChange,
  bookmarksCount,
  currentUser,
  onLogout,
  onOpenPosterAutomation
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1c1815]/95 backdrop-blur-md border-b border-amber-950/40 text-stone-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onViewChange('board')}
          className="text-lg sm:text-xl font-black tracking-tight text-amber-100 hover:text-white transition-colors whitespace-nowrap shrink-0 font-serif flex items-center gap-2 cursor-pointer"
        >
          <span>Campus, Sorted</span>
        </button>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-300">
          <button
            type="button"
            onClick={() => onViewChange('board')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeView === 'board' ? 'text-amber-400 font-bold' : 'hover:text-white text-stone-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cork Board</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('decoded')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'decoded' ? 'text-amber-400 font-bold' : 'hover:text-white text-stone-300'
            }`}
          >
            <span>Decoded Notices</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('timeline')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeView === 'timeline' ? 'text-amber-400 font-bold' : 'hover:text-white text-stone-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            type="button"
            onClick={onOpenConflicts}
            className="transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-stone-300 hover:text-amber-300"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Conflict Radar</span>
            {conflictCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                {conflictCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onViewChange('agent')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeView === 'agent' ? 'text-amber-400 font-bold' : 'hover:text-amber-300 text-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Agent</span>
            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/30">
              NEW
            </span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('bookmarks')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeView === 'bookmarks' ? 'text-amber-400 font-bold' : 'hover:text-white text-stone-300'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({bookmarksCount})</span>
          </button>

          {/* Baby Oink Login Link */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-700">
              <span className="flex items-center gap-1 text-pink-300 font-bold">
                <span>🐷</span>
                <span>{currentUser.name}</span>
              </span>
              <button
                type="button"
                onClick={onLogout}
                title="Log out"
                className="text-stone-400 hover:text-stone-200 p-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onViewChange('login')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                activeView === 'login'
                  ? 'bg-pink-500 text-white border-pink-400'
                  : 'text-pink-300 border-pink-400/40 hover:bg-pink-900/30'
              }`}
            >
              <span>🐷</span>
              <span>Baby Oink Login</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenPosterAutomation && (
            <button
              type="button"
              onClick={onOpenPosterAutomation}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-200 bg-stone-900/90 hover:bg-stone-800 border border-amber-500/40 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap hover:border-amber-400"
              title="Upload poster or flyer to automatically extract digital notice"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Extract Poster</span>
            </button>
          )}

          {/* Mobile Login icon if small screen */}
          <button
            type="button"
            onClick={() => onViewChange('login')}
            className="md:hidden flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border border-pink-400/50 text-pink-300 bg-pink-950/40 cursor-pointer"
          >
            <span>🐷</span>
            <span>{currentUser ? currentUser.name : 'Login'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPinModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Pin a Notice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
