import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Ticket, Calendar, MapPin, QrCode, AlertCircle, Loader2 } from 'lucide-react';
import { Notice, Registration } from '../types';

interface RegisterModalProps {
  notice: Notice | null;
  onClose: () => void;
  onSuccess: (reg: Registration, notice: Notice) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ notice, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketPass, setTicketPass] = useState<Registration | null>(null);

  if (!notice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide your full name and campus email.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noticeId: notice.id,
          name: name.trim(),
          studentId: studentId.trim() || 'GEN-STU',
          email: email.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      setTicketPass(data.registration);
      onSuccess(data.registration, notice);
    } catch (err: any) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden text-slate-900"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {ticketPass ? (
          /* Digital Event Pass Ticket */
          <div className="text-center py-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold font-serif text-stone-900">
              Registration Confirmed!
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Your campus entry pass is confirmed and active.
            </p>

            {/* Realistic Pass Ticket */}
            <div className="mt-6 border-2 border-dashed border-stone-300 rounded-xl bg-amber-50/40 p-5 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">CAMPUS ADMIT PASS</span>
                  <h4 className="font-bold text-base text-stone-900 font-serif leading-tight">{notice.title}</h4>
                </div>
                <div className="w-9 h-9 bg-stone-900 text-white rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">ATTENDEE</span>
                  <span className="font-semibold text-stone-800">{ticketPass.name}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">STUDENT ID</span>
                  <span className="font-semibold text-stone-800">{ticketPass.studentId}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">DATE & TIME</span>
                  <span className="font-semibold text-stone-800">{notice.date} · {notice.startTime}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">VENUE</span>
                  <span className="font-semibold text-stone-800 truncate block">{notice.venue}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-stone-400 block uppercase">PASS TOKEN</span>
                  <span className="font-mono text-xs font-bold text-stone-800">{ticketPass.ticketId}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <QrCode className="w-6 h-6 text-stone-800" />
                  <span className="text-[9px] font-mono font-bold">VERIFIED</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Done & Return to Board
            </button>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                {notice.category}
              </span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-stone-900 leading-snug">
              Register for {notice.title}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {notice.date} · {notice.startTime} – {notice.endTime} · {notice.venue}
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Campus Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Student / Roll ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 25-CS-891"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Registration...</span>
                    </>
                  ) : (
                    <span>Confirm Registration & Issue Pass</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
