import React from 'react';
import { Notice } from '../types';
import { Calendar, ChevronRight } from 'lucide-react';

interface TimelineRibbonProps {
  notices: Notice[];
  selectedId?: string;
  onSelect: (notice: Notice) => void;
}

export const TimelineRibbon: React.FC<TimelineRibbonProps> = ({
  notices,
  selectedId,
  onSelect
}) => {
  // Sort notices chronologically by isoDate
  const sorted = [...notices].sort((a, b) => (a.isoDate || '').localeCompare(b.isoDate || ''));

  return (
    <div className="w-full bg-[#f7f5f0] border-t border-stone-300/80 py-6 px-6 sm:px-12 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-bold tracking-wider uppercase text-stone-600">
              Campus Timeline · Chronological Stream
            </span>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {sorted.length} decoded notices
          </span>
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
          {sorted.map((notice) => {
            const isSelected = notice.id === selectedId;
            return (
              <button
                key={notice.id}
                type="button"
                onClick={() => onSelect(notice)}
                className={`flex-shrink-0 w-64 text-left p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-white border-amber-500 ring-2 ring-amber-400 shadow-md'
                    : 'bg-[#faf8f4] border-stone-200/90 hover:bg-white hover:border-stone-400/80 shadow-xs'
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-1">
                  <span>{notice.date}</span>
                  {notice.conflictNotice && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Schedule conflict" />
                  )}
                </div>

                <div className="text-[10px] font-semibold text-stone-600 uppercase tracking-tight truncate">
                  {notice.category}
                </div>

                <h4 className="font-serif font-bold text-sm text-stone-900 truncate mt-0.5">
                  {notice.title}
                </h4>

                <p className="font-hand text-xs text-stone-700 truncate mt-1">
                  {notice.handNote}
                </p>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span className="truncate max-w-[140px]">{notice.venue.split(',')[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
