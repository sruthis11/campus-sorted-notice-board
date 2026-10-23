import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Notice } from '../types';
import { NoticeCard } from './NoticeCard';
import { LoupeCursor } from './LoupeCursor';
import { Sparkles, Eye, Filter, Wind } from 'lucide-react';

interface CorkBoardProps {
  notices: Notice[];
  selectedNoticeId?: string;
  onSelectNotice: (notice: Notice) => void;
  filterCategory: string;
  onFilterChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loupeEnabled: boolean;
  onToggleLoupe: () => void;
  breezeEnabled: boolean;
  onToggleBreeze: () => void;
  onOpenPosterAutomation?: () => void;
}

export const CorkBoard: React.FC<CorkBoardProps> = ({
  notices,
  selectedNoticeId,
  onSelectNotice,
  filterCategory,
  onFilterChange,
  searchQuery,
  onSearchChange,
  loupeEnabled,
  onToggleLoupe,
  breezeEnabled,
  onToggleBreeze,
  onOpenPosterAutomation
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'ALL', label: 'All Notices' },
    { id: 'TECH', label: 'Tech & Talks' },
    { id: 'WORKSHOP', label: 'Workshops' },
    { id: 'CULTURAL', label: 'Cultural' },
    { id: 'SPORTS', label: 'Sports' }
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCat =
      filterCategory === 'ALL' ||
      (filterCategory === 'TECH' && (n.category.includes('TECH') || n.category.includes('ACM') || n.category.includes('LECTURE') || n.category.includes('INNOVATE'))) ||
      (filterCategory === 'WORKSHOP' && n.category.includes('WORKSHOP')) ||
      (filterCategory === 'CULTURAL' && (n.category.includes('CULTURAL') || n.category.includes('COMMUNITY'))) ||
      (filterCategory === 'SPORTS' && n.category.includes('SPORTS'));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.subtitle.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      (n.organizer && n.organizer.toLowerCase().includes(q)) ||
      (n.summary && n.summary.toLowerCase().includes(q)) ||
      (n.fullNotice && n.fullNotice.toLowerCase().includes(q)) ||
      n.venue.toLowerCase().includes(q) ||
      n.regDeadline.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full relative py-6 px-3 sm:px-8 max-w-7xl mx-auto">
      {/* Board Controls Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-[#38271d]/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-900/40 text-amber-100 shadow-lg">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <Filter className="w-3.5 h-3.5 text-amber-300/80 mr-1 shrink-0 hidden sm:inline" />
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onFilterChange(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterCategory === c.id
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-amber-200/80 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search, Automation Action & Loupe Toggle */}
        <div className="flex items-center gap-2.5 ml-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pinned notices or organizers..."
            className="px-3 py-1.5 text-xs bg-stone-900/60 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-200/40 focus:outline-none focus:ring-1 focus:ring-amber-400 w-36 sm:w-52"
          />

          {onOpenPosterAutomation && (
            <button
              type="button"
              onClick={onOpenPosterAutomation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              title="Upload poster/flyer image or PDF to auto-extract structured digital notice"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-900" />
              <span>Auto-Extract Poster</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleBreeze}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              breezeEnabled
                ? 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-xs'
                : 'border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle deadline air breeze (flaps notices due tomorrow or tonight)"
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wind Flap {breezeEnabled ? 'On' : 'Off'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleLoupe}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              loupeEnabled
                ? 'bg-amber-600/30 border-amber-500/80 text-amber-200'
                : 'border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle magnifying inspection glass"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Loupe {loupeEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Tactile Wood-Framed Cork Board */}
      <div
        ref={boardRef}
        className="cork-texture wood-frame rounded-2xl relative p-6 sm:p-10 md:p-12 min-h-[560px] overflow-hidden select-none cursor-default"
      >
        {/* Pinboard Wood Header Plaque */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-amber-950/20">
          <div className="flex items-center gap-3">
            {/* Brass Nameplate */}
            <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 px-3.5 py-1 rounded shadow-md border border-amber-400/50 flex items-center gap-1.5 text-amber-100 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>OFFICIAL CAMPUS PINBOARD</span>
            </div>
            <span className="text-[11px] text-amber-950/80 font-semibold tracking-wide hidden sm:inline">
              SPRING 2025 SEMESTER
            </span>
          </div>

          <div className="text-[11px] font-bold text-amber-950/70 uppercase tracking-wider bg-amber-400/30 px-2.5 py-1 rounded border border-amber-900/20">
            {filteredNotices.length} Active Circulars
          </div>
        </div>

        {/* Interactive Magnifier Loupe */}
        <LoupeCursor boardRef={boardRef} enabled={loupeEnabled} />

        {/* Notices Grid */}
        {filteredNotices.length === 0 ? (
          <div className="py-20 text-center bg-amber-100/30 rounded-xl border border-dashed border-amber-900/30 text-amber-950">
            <p className="font-serif text-lg font-semibold">No notices match your filter</p>
            <p className="text-xs text-amber-900/80 mt-1">Try resetting the search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start relative z-10">
            {filteredNotices.map((notice) => (
              <div key={notice.id} className="transform transition-transform">
                <NoticeCard
                  notice={notice}
                  isSelected={notice.id === selectedNoticeId}
                  onSelect={onSelectNotice}
                  breezeEnabled={breezeEnabled}
                />
              </div>
            ))}
          </div>
        )}

        {/* Board Bottom Pin Legend / Notice */}
        <div className="mt-10 pt-4 border-t border-amber-950/20 flex flex-wrap items-center justify-between text-[11px] text-amber-950/80 font-medium gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block shadow-xs" />
              <span>Deadlines / Urgent</span>
            </span>
            <span className="flex items-center gap-1 text-amber-950 font-semibold">
              <Wind className="w-3.5 h-3.5 text-rose-600" />
              <span>Flaps in wind = All notices with due date near/soon (Distant deadlines stay still)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block shadow-xs" />
              <span>Guest Keynotes</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shadow-xs" />
              <span>Workshops & Competitions</span>
            </span>
          </div>
          <span className="font-hand text-base text-amber-950 opacity-90 hidden sm:inline">
            Notice board updated every morning at 08:00 AM
          </span>
        </div>
      </div>
    </div>
  );
};
