import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Pin, Sparkles, Wand2, AlertCircle, Loader2 } from 'lucide-react';
import { Notice, PaperColor, PinType, TapeType } from '../types';

interface PinNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoticePinned: (newNotice: Notice) => void;
}

export const PinNoticeModal: React.FC<PinNoticeModalProps> = ({
  isOpen,
  onClose,
  onNoticePinned
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'decode'>('form');

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [handNote, setHandNote] = useState('');
  const [category, setCategory] = useState('TECH TALK');
  const [date, setDate] = useState('10 April 2025');
  const [isoDate, setIsoDate] = useState('2025-04-10');
  const [startTime, setStartTime] = useState('4:00 PM');
  const [endTime, setEndTime] = useState('5:30 PM');
  const [venue, setVenue] = useState('Seminar Hall 2, Block B');
  const [regDeadline, setRegDeadline] = useState('Walk-ins welcome');
  const [prereqInput, setPrereqInput] = useState('Open seating, Bring notebook');
  const [paperColor, setPaperColor] = useState<PaperColor>('yellow');
  const [pinType, setPinType] = useState<PinType>('red-pushpin');
  const [tapeType, setTapeType] = useState<TapeType>('none');
  const [tag, setTag] = useState('');

  // Auto-decode states
  const [rawText, setRawText] = useState('');
  const [decoding, setDecoding] = useState(false);
  const [decodeMessage, setDecodeMessage] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDecode = async () => {
    if (!rawText.trim()) {
      setError('Please enter circular or flyer text to decode.');
      return;
    }

    setDecoding(true);
    setError(null);
    setDecodeMessage(null);

    try {
      const res = await fetch('/api/notices/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Decoding failed');
      }

      const d = data.decoded;
      setTitle(d.title || '');
      setSubtitle(d.subtitle || '');
      setHandNote(d.handNote || d.subtitle || '');
      setDate(d.date || '12 April 2025');
      setVenue(d.venue || 'Campus Auditorium');
      setStartTime(d.startTime || '3:00 PM');
      setEndTime(d.endTime || '5:00 PM');
      setCategory(d.category || 'WORKSHOP');
      setPaperColor(d.paperColor || 'mint');
      setPrereqInput(d.prerequisites ? d.prerequisites.join(', ') : 'Valid ID, Open seating');

      setDecodeMessage('Notice successfully parsed! Review details and pin to board.');
      setActiveTab('form');
    } catch (err: any) {
      setError(err.message || 'Error decoding text.');
    } finally {
      setDecoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim() || !date.trim()) {
      setError('Please provide at least a title, date, and venue.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const prereqs = prereqInput.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: subtitle || title,
          handNote: handNote || subtitle || title,
          category,
          date,
          isoDate,
          startTime,
          endTime,
          venue,
          regDeadline,
          paperColor,
          pinType,
          tapeType,
          tag: tag || undefined,
          prerequisites: prereqs
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to pin notice');
      }

      onNoticePinned(data.notice);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 text-slate-900"
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
          <Pin className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold tracking-wider uppercase text-amber-700">
            Pin New Announcement
          </span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-stone-900">
          Add Notice to Campus Corkboard
        </h2>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'form' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Custom Stationery Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('decode')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'decode' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Auto-Decode Flyer</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {decodeMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            {decodeMessage}
          </div>
        )}

        {activeTab === 'decode' ? (
          /* Smart Notice Decoder */
          <div className="mt-5 space-y-4">
            <p className="text-xs text-stone-600">
              Paste the text from an event poster, email circular, or WhatsApp group announcement. Our parser will extract dates, times, venues, and auto-detect schedule clashes.
            </p>

            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Example:
AI & Robotics Hackathon 2025
Organized by IEEE Student Branch
Date: 12 April 2025 at 10:00 AM to 5:00 PM
Venue: Robotics Lab, Mech Block
Bring your laptops and Arduino/RPi kits. Open seating."
              className="w-full p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-mono leading-relaxed"
            />

            <button
              type="button"
              disabled={decoding}
              onClick={handleDecode}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs sm:text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {decoding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Decoding Notice Details...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Auto-Decode & Populate Form</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Stationery Customizer Form */
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Stationery Style Picker */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                  Paper Color & Stationery Style
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['yellow', 'mint', 'lilac', 'cream', 'white', 'card', 'pink', 'kraft'] as PaperColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPaperColor(c)}
                      className={`px-2.5 py-1 text-xs rounded-md border font-medium capitalize cursor-pointer ${
                        paperColor === c ? 'ring-2 ring-amber-500 border-amber-600 font-bold bg-white' : 'border-stone-300 bg-white/70'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Pin / Clip
                  </span>
                  <select
                    value={pinType}
                    onChange={(e) => setPinType(e.target.value as PinType)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="red-pushpin">Red Pushpin</option>
                    <option value="purple-pin">Purple Pin</option>
                    <option value="green-pushpin">Green Pin</option>
                    <option value="yellow-pin">Yellow Pin</option>
                    <option value="metal-paperclip">Metal Paperclip</option>
                    <option value="wood-clip">Wooden Bulldog Clip</option>
                    <option value="dual-pins">Dual Corner Pins</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Washi Tape
                  </span>
                  <select
                    value={tapeType}
                    onChange={(e) => setTapeType(e.target.value as TapeType)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="none">No Tape</option>
                    <option value="pink-washi">Pink Washi Tape</option>
                    <option value="kraft-tape">Kraft Paper Tape</option>
                    <option value="amber-tape">Amber Masking Tape</option>
                  </select>
                </div>

                {tapeType !== 'none' && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Tape Stamp Label
                    </span>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="e.g. DUE SOON"
                      className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white w-28 uppercase"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Event Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Notice Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Robotics Showcase & Demo Day"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-serif font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Category / Club
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. TECH TALK or ACM"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Venue <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Auditorium, Block A"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 10 April 2025"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  ISO Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={isoDate}
                  onChange={(e) => setIsoDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="4:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="5:30 PM"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Handwritten Note on Sticky Note
                </label>
                <input
                  type="text"
                  value={handNote}
                  onChange={(e) => setHandNote(e.target.value)}
                  placeholder="e.g. Bring your working prototypes and pitch decks!"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-hand"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Detailed Subtitle / Overview
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Comprehensive summary shown in the decoded detail view..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Prerequisites & Checkmarks (comma separated)
                </label>
                <input
                  type="text"
                  value={prereqInput}
                  onChange={(e) => setPrereqInput(e.target.value)}
                  placeholder="Open to all years, Bring ID card, Certificate provided"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Pinning to Cork Board...</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-4 h-4" />
                    <span>Pin Notice to Cork Board</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
