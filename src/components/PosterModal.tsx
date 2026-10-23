import React from 'react';
import { motion } from 'motion/react';
import { X, Printer, Calendar, MapPin, Clock, ShieldCheck, Download } from 'lucide-react';
import { Notice } from '../types';

interface PosterModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ notice, onClose }) => {
  if (!notice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-10 shadow-2xl border border-stone-200 relative my-6 text-slate-900"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close flyer modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If original poster image is available, display it directly */}
        {notice.posterImageData ? (
          <div className="space-y-4">
            <div className="border border-stone-300 rounded-xl overflow-hidden bg-stone-950 p-2 flex items-center justify-center max-h-[520px]">
              <img
                src={notice.posterImageData}
                alt={notice.title}
                className="max-h-[500px] w-auto object-contain rounded shadow-lg"
              />
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <span className="font-semibold text-stone-800">Source: Original Verified Event Poster</span>
              {notice.organizer && <span className="font-medium text-amber-700">{notice.organizer}</span>}
            </div>
          </div>
        ) : (
          /* Poster Paper Frame */
          <div className="border-4 border-double border-stone-800 p-6 sm:p-8 bg-[#fdfcf9] rounded-sm relative shadow-inner">
            {/* Institutional Header */}
            <div className="text-center border-b border-stone-300 pb-4 mb-6">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-500 block">
                CAMPUS ACADEMIC COUNCIL & CLUBS
              </span>
              <div className="text-xs font-serif italic text-stone-600 mt-0.5">
                Official Bulletin Board Notice · Spring Semester 2025
              </div>
            </div>

          {/* Category Tag */}
          <div className="text-center mb-2">
            <span className="inline-block px-3 py-1 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm">
              {notice.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-center text-stone-950 tracking-tight leading-tight mt-3">
            {notice.title}
          </h1>

          {/* Handwritten Subtitle Callout */}
          <div className="font-hand text-2xl text-center text-stone-800 my-4 px-2">
            “{notice.handNote}”
          </div>

          {/* Description */}
          <p className="text-center text-xs sm:text-sm text-stone-700 leading-relaxed max-w-md mx-auto my-5">
            {notice.subtitle}
          </p>

          {/* Logistics Box */}
          <div className="border border-stone-300 bg-stone-50 p-4 rounded-lg my-6 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-stone-800">
              <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="font-bold">Date:</span>
              <span>{notice.date}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-800">
              <Clock className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="font-bold">Time:</span>
              <span>{notice.startTime} – {notice.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-800">
              <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="font-bold">Venue:</span>
              <span>{notice.venue}</span>
            </div>
          </div>

          {/* Prerequisites */}
          {notice.prerequisites && (
            <div className="text-xs text-stone-600 mb-6">
              <span className="font-bold uppercase text-[10px] tracking-wider text-stone-500 block mb-1.5">
                Entry Requirements:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                {notice.prerequisites.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Verification Seal */}
          <div className="border-t border-stone-300 pt-4 flex items-center justify-between text-[10px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold uppercase tracking-wider">Campus Verified Notice</span>
            </div>
            <span className="font-mono">REF: #{notice.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
        )}

        {/* Modal Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Flyer</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
