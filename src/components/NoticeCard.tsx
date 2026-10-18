import React from 'react';
import { motion } from 'motion/react';
import { Notice } from '../types';
import { PushPin, WashiTape } from './StationeryElements';
import { Wind } from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
  isSelected?: boolean;
  onSelect: (notice: Notice) => void;
  compact?: boolean;
  breezeEnabled?: boolean;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  isSelected = false,
  onSelect,
  compact = false,
  breezeEnabled = true
}) => {
  const paperColorClasses: Record<string, string> = {
    yellow: 'bg-[#fff8c7] text-[#3d2f0a] border-[#e8d789]/70',
    mint: 'bg-[#e4f6ec] text-[#123826] border-[#b6e3cb]/70',
    lilac: 'bg-[#ede8f5] text-[#2e1d4a] border-[#d2c4e6]/70',
    cream: 'bg-[#faf6ed] text-[#332a1e] border-[#dfd4c1]/70',
    white: 'bg-[#ffffff] text-[#1e293b] border-[#cbd5e1]/70',
    card: 'bg-[#f5f5f7] text-[#1c1917] border-[#d6d3d1]/80',
    pink: 'bg-[#fee9ed] text-[#4c1626] border-[#fbc0cc]/70',
    kraft: 'bg-[#e7d8c0] text-[#3b2a14] border-[#cbb393]/70'
  };

  const currentBgClass = paperColorClasses[notice.paperColor] || paperColorClasses.yellow;

  // Determine if notice deadline is near / due soon
  const isDueNear = notice.urgency === 'urgent' || notice.urgency === 'soon';

  // Determine flap animation based on deadline urgency
  const flapClass =
    breezeEnabled && !isSelected && isDueNear
      ? notice.urgency === 'urgent'
        ? 'paper-flap-urgent'
        : 'paper-flap-soon'
      : '';

  // Stagger animation delay so multiple flapping cards flutter naturally in the hallway draft
  const staggerDelay = ((notice.id.charCodeAt(0) + notice.id.length) % 6) * 0.35;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(notice)}
      whileHover={{ scale: 1.025, y: -4, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.98 }}
      className={`relative group text-left transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-3 focus-visible:ring-amber-500 rounded-sm border ${currentBgClass} ${flapClass} ${
        compact ? 'p-3 w-44' : 'p-4 sm:p-5 w-full min-h-[190px] sm:min-h-[220px]'
      } ${
        isSelected
          ? 'ring-4 ring-amber-500/80 shadow-2xl z-30 scale-[1.02]'
          : 'paper-shadow-soft hover:paper-shadow-lifted z-10'
      }`}
      style={{
        transform: `rotate(${notice.rotation}deg)`,
        ['--base-rot' as any]: `${notice.rotation}deg`,
        animationDelay: isDueNear ? `-${staggerDelay}s` : undefined,
      }}
      aria-label={`Notice: ${notice.title}. Category: ${notice.category}. Date: ${notice.date}`}
    >
      {/* Top Pin / Clip */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <PushPin type={notice.pinType} />
      </div>

      {/* Flapping in wind badge indicator for all due near / soon notices */}
      {breezeEnabled && isDueNear && (
        <div
          className={`absolute -bottom-2.5 left-3 z-20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 border pointer-events-none ${
            notice.urgency === 'urgent'
              ? 'bg-rose-700/90 border-rose-300/40'
              : 'bg-amber-700/90 border-amber-300/40'
          }`}
          title="Deadline is near - flapping in the hallway breeze"
        >
          <Wind className="w-2.5 h-2.5 animate-pulse" />
          <span>
            {notice.urgency === 'urgent' ? 'DUE TOMORROW · FLAPPING' : 'DUE SOON · FLAPPING'}
          </span>
        </div>
      )}

      {/* Washi Tape (if present, e.g. DUE TONIGHT) */}
      {notice.tapeType && notice.tapeType !== 'none' && (
        <WashiTape
          type={notice.tapeType}
          text={notice.tag || 'IMPORTANT'}
          className="-top-2 right-1 rotate-12"
        />
      )}

      {/* Card Header: Category & Subcategory */}
      <div className="flex items-center justify-between gap-2 mb-2 pt-1 border-b border-black/10 pb-1">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase opacity-75">
          {notice.category}
        </span>
        {notice.conflictNotice && (
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white/80" title="Schedule conflict" />
        )}
      </div>

      {/* Main Title */}
      <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight mb-2 leading-snug">
        {notice.title}
      </h3>

      {/* Handwritten Calligraphic Note */}
      <div className="font-hand text-lg sm:text-xl leading-snug tracking-wide opacity-95 my-2.5 text-stone-800">
        “{notice.handNote}”
      </div>

      {/* Card Footer: Date & Venue */}
      <div className="mt-auto pt-3 border-t border-black/10 flex items-center justify-between text-[11px] sm:text-xs font-medium tracking-tight opacity-80">
        <span>{notice.date}</span>
        <span className="truncate max-w-[120px] text-right uppercase tracking-wider text-[10px]">
          {notice.venue.split(',')[0]}
        </span>
      </div>

      {/* Subtle corner fold shadow */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-tl from-black/20 to-transparent pointer-events-none rounded-br-sm"
        aria-hidden="true"
      />
    </motion.button>
  );
};
