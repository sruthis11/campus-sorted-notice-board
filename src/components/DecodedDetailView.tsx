import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Share2,
  Bookmark,
  CalendarPlus,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import { Notice } from '../types';
import { PushPin } from './StationeryElements';

interface DecodedDetailViewProps {
  notice: Notice;
  onClose: () => void;
  onOpenRegister: (notice: Notice) => void;
  onOpenPoster: (notice: Notice) => void;
  isBookmarked?: boolean;
  onToggleBookmark: (id: string) => void;
}

export const DecodedDetailView: React.FC<DecodedDetailViewProps> = ({
  notice,
  onClose,
  onOpenRegister,
  onOpenPoster,
  isBookmarked = false,
  onToggleBookmark
}) => {
  const [copyToast, setCopyToast] = React.useState(false);

  const handleDownloadIcs = () => {
    window.location.href = `/api/calendar/ics/${notice.id}`;
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${notice.title} - ${notice.date} at ${notice.venue}. Details: ${url}`);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
    }
  };

  // Google Calendar URL generator
  const createGoogleCalendarUrl = () => {
    const cleanDate = notice.isoDate ? notice.isoDate.replace(/-/g, '') : '20250401';
    const start = `${cleanDate}T100000Z`;
    const end = `${cleanDate}T120000Z`;
    const title = encodeURIComponent(`${notice.title} (${notice.category})`);
    const details = encodeURIComponent(`${notice.subtitle}\n\nVenue: ${notice.venue}\nContact: ${notice.contact}`);
    const location = encodeURIComponent(notice.venue);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  return (
    <div className="w-full bg-white text-slate-900 border-t border-b border-stone-200 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Top Banner Bar */}
      <div className="border-b border-stone-100 bg-[#fdfbf7] px-6 sm:px-12 py-3.5 flex items-center justify-between text-xs font-medium text-stone-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="tracking-wide uppercase font-semibold text-stone-700">HOVER TO INSPECT • CLICK TO DECODE</span>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
          aria-label="Close detail view and return to full board"
        >
          <span>Return to Board</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 pb-14">
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest text-stone-500 uppercase mb-1">
            CAMPUS, SORTED
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 font-serif">
            What’s happening next
          </h2>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Select a card from the board, or browse every decoded notice below.
          </p>
        </div>

        {/* 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Pinned Card Artifact */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase self-start mb-3">
              SELECTED FROM THE BOARD
            </span>

            <motion.div
              key={notice.id}
              initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: notice.rotation }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm bg-[#fffdfa] border border-stone-300/80 p-6 sm:p-7 rounded-sm shadow-xl relative"
            >
              {/* Pushpin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <PushPin type={notice.pinType} />
              </div>

              <div className="text-[11px] font-bold tracking-wider uppercase text-stone-500 mb-3 border-b border-stone-200 pb-1">
                {notice.category}
              </div>

              <h3 className="font-serif text-2xl font-bold tracking-tight text-stone-950 mb-3 leading-snug">
                {notice.title}
              </h3>

              <div className="font-hand text-2xl text-stone-800 leading-snug tracking-wide my-4 border-l-2 border-stone-300 pl-3">
                “{notice.handNote}”
              </div>

              <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
                <span className="font-semibold">{notice.date}</span>
                <span className="uppercase text-[10px] tracking-wider text-stone-500">{notice.venue}</span>
              </div>
            </motion.div>

            {/* View Original Poster Action */}
            <button
              type="button"
              onClick={() => onOpenPoster(notice)}
              className="mt-6 flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-950 underline underline-offset-4 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View original notice flyer</span>
            </button>
          </div>

          {/* Right Column: Decoded Structured Intelligence */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold tracking-widest uppercase text-stone-500">
                  {notice.category}
                </span>
                {notice.organizer && notice.organizer !== 'Not mentioned in poster' && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Organized by {notice.organizer}
                    </span>
                  </>
                )}
                {notice.isAutoExtracted && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ⚡ Auto-Extracted from Poster
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 font-serif leading-tight">
                {notice.title}
              </h1>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed mt-2.5">
                {notice.subtitle}
              </p>

              {notice.summary && notice.summary !== notice.subtitle && (
                <div className="mt-3 p-3 bg-stone-50 border-l-3 border-amber-500 rounded-r-lg text-xs text-stone-700 font-medium italic">
                  “{notice.summary}”
                </div>
              )}
            </div>

            {/* 4-Item Key Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-stone-200/80 text-stone-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">EVENT DATE</span>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{notice.date}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-stone-200/80 text-stone-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">TIME</span>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{notice.startTime} – {notice.endTime}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-stone-200/80 text-stone-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">VENUE</span>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{notice.venue}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-stone-200/80 text-stone-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">REGISTRATION DEADLINE</span>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{notice.regDeadline}</p>
                </div>
              </div>
            </div>

            {/* Smart Conflict / Proximity Warning Banner */}
            {notice.conflictNotice && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 text-amber-950 shadow-xs"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {notice.conflictNotice.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-snug">
                    {notice.conflictNotice.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Before You Go Checklist */}
            {notice.prerequisites && notice.prerequisites.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold tracking-wider uppercase text-stone-500 block mb-2.5">
                  Before you go
                </span>
                <div className="flex flex-wrap gap-2">
                  {notice.prerequisites.map((item, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-3">
              {/* Add to Calendar Button */}
              <div className="relative group/cal">
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Add to calendar (.ics)</span>
                </button>
              </div>

              {/* Direct Google Calendar Link */}
              <a
                href={createGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:text-stone-900 hover:bg-stone-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                title="Add to Google Calendar"
              >
                <span>Google Cal</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </a>

              {/* Direct Web Registration Link (if extracted from poster) */}
              {notice.registrationLink && notice.registrationLink !== 'Not mentioned in poster' && (
                <a
                  href={notice.registrationLink.startsWith('http') ? notice.registrationLink : `https://${notice.registrationLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-400 bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold hover:bg-emerald-100 shadow-xs transition-colors whitespace-nowrap"
                  title="Open official registration portal"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>Official Portal</span>
                </a>
              )}

              {/* Registration / Event Pass Link */}
              <button
                type="button"
                onClick={() => onOpenRegister(notice)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-sm font-semibold hover:bg-amber-700 shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{notice.isRegistered ? 'View Event Pass' : 'Get Event Pass'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => onToggleBookmark(notice.id)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title={isBookmarked ? 'Saved to your notices' : 'Save notice'}
                aria-label={isBookmarked ? 'Notice saved' : 'Save notice'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-700' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer relative"
                title="Share notice link"
                aria-label="Share notice link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {copyToast && (
                <span className="text-xs text-emerald-700 font-semibold px-2 py-1 rounded bg-emerald-50 border border-emerald-200">
                  Link copied to clipboard!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
