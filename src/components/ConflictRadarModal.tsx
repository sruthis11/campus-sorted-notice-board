import React from 'react';
import { motion } from 'motion/react';
import { X, AlertTriangle, Clock, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Notice } from '../types';

interface ConflictRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
  onSelectNotice: (n: Notice) => void;
}

export const ConflictRadarModal: React.FC<ConflictRadarModalProps> = ({
  isOpen,
  onClose,
  notices,
  onSelectNotice
}) => {
  if (!isOpen) return null;

  // Find all notices with conflicts
  const conflictingNotices = notices.filter(n => Boolean(n.conflictNotice));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative text-slate-900"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold tracking-wider uppercase text-amber-700">
            Smart Timetable Radar
          </span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-stone-900">
          Campus Schedule Conflicts & Tight Transits
        </h2>
        <p className="text-xs text-stone-600 mt-1">
          Our scheduling engine audits event dates, room allocations, and campus walking times to prevent overlap surprises.
        </p>

        <div className="mt-6 space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {conflictingNotices.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2 hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {n.category} · {n.date}
                </span>
                <span className="text-xs font-semibold text-stone-600">{n.startTime}</span>
              </div>

              <h4 className="font-serif font-bold text-base text-stone-900">
                {n.title}
              </h4>

              <div className="p-3 bg-white/90 rounded-lg border border-amber-300/80 text-xs text-amber-950 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900">{n.conflictNotice?.title}</span>
                  <span className="text-amber-800">{n.conflictNotice?.description}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{n.venue}</span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onSelectNotice(n);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 cursor-pointer"
                >
                  <span>Decode Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {conflictingNotices.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>No schedule clashes detected across all pinned announcements!</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  );
};
