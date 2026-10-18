import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface BabyOinkLoginProps {
  onSuccessLogin: (user: { name: string; email: string }) => void;
  onBackToBoard: () => void;
}

export const BabyOinkLogin: React.FC<BabyOinkLoginProps> = ({
  onSuccessLogin,
  onBackToBoard
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // When typing password and not showing password, the piglet covers eyes
  const isCoveringEyes = isPasswordFocused && !showPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrUsername.trim()) {
      setErrorMessage('Oink! Please enter your email or username first.');
      return;
    }

    if (!password) {
      setErrorMessage('Oink! Please enter your secret password.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Passwords must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);

    // Simulate smooth demo login
    setTimeout(() => {
      setIsSubmitting(false);
      const displayName = emailOrUsername.includes('@')
        ? emailOrUsername.split('@')[0]
        : emailOrUsername;
      
      const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      setSuccessMessage(`Oink-tastic! Welcome back, ${capitalized}! 🐷✨`);

      setTimeout(() => {
        onSuccessLogin({
          name: capitalized,
          email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@babyoink.app`
        });
      }, 1200);
    }, 700);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff6f8] via-[#fdf2f4] to-[#fceef2] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-800 relative selection:bg-pink-200 selection:text-pink-900 overflow-hidden">
      {/* Background Pastel Sparkles & Soft Blobs (No hearts!) */}
      <div className="absolute top-12 left-10 text-pink-300 opacity-60 text-2xl select-none animate-bounce" style={{ animationDuration: '4s' }}>
        ✦
      </div>
      <div className="absolute top-24 right-16 text-rose-300 opacity-50 text-xl select-none animate-pulse" style={{ animationDuration: '3s' }}>
        ★
      </div>
      <div className="absolute bottom-20 left-16 text-pink-300 opacity-60 text-3xl select-none">
        ✦
      </div>
      <div className="absolute bottom-32 right-12 text-rose-200 opacity-60 text-2xl select-none">
        ★
      </div>

      {/* Top Navigation Bar back to notice board */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10">
        <button
          type="button"
          onClick={onBackToBoard}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700/80 hover:text-pink-900 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full shadow-xs border border-pink-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Notice Board</span>
        </button>

        <span className="text-[11px] font-semibold text-pink-500 uppercase tracking-widest bg-pink-100/70 px-2.5 py-1 rounded-full">
          Member Portal
        </span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Adorable Baby Oink Piglet Peeking Over Card */}
        <div className="w-full flex justify-center -mb-8 relative z-20 pointer-events-none">
          <div className="relative w-44 h-36 flex items-end justify-center">
            <svg
              viewBox="0 0 200 160"
              className="w-full h-full drop-shadow-[0_8px_16px_rgba(244,114,182,0.25)] overflow-visible"
            >
              {/* Left Piglet Ear */}
              <motion.path
                d="M 50 85 C 30 50 45 25 70 50 Z"
                fill="#fca5a5"
                stroke="#f472b6"
                strokeWidth="3"
                animate={{ rotate: isCoveringEyes ? -12 : [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{ transformOrigin: '70px 50px' }}
              />
              <path d="M 53 78 C 42 58 52 42 66 58 Z" fill="#fda4af" />

              {/* Right Piglet Ear */}
              <motion.path
                d="M 150 85 C 170 50 155 25 130 50 Z"
                fill="#fca5a5"
                stroke="#f472b6"
                strokeWidth="3"
                animate={{ rotate: isCoveringEyes ? 12 : [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{ transformOrigin: '130px 50px' }}
              />
              <path d="M 147 78 C 158 58 148 42 134 58 Z" fill="#fda4af" />

              {/* Chubby Piglet Head */}
              <ellipse
                cx="100"
                cy="95"
                rx="62"
                ry="54"
                fill="#fed7aa"
                className="fill-[#fed7aa] stroke-[#f472b6]"
                style={{ fill: '#ffe4e6', stroke: '#f472b6', strokeWidth: 3 }}
              />

              {/* Cute Cheek Blushes (Oval rosy blush - NO hearts) */}
              <ellipse cx="62" cy="110" rx="9" ry="6" fill="#fb7185" opacity="0.45" />
              <ellipse cx="138" cy="110" rx="9" ry="6" fill="#fb7185" opacity="0.45" />

              {/* Baby Snout */}
              <g transform="translate(100, 108)">
                {/* Snout oval */}
                <ellipse cx="0" cy="0" rx="24" ry="17" fill="#fda4af" stroke="#f43f5e" strokeWidth="2.5" />
                {/* Left nostril */}
                <ellipse cx="-8" cy="0" rx="4.5" ry="6.5" fill="#be123c" />
                {/* Right nostril */}
                <ellipse cx="8" cy="0" rx="4.5" ry="6.5" fill="#be123c" />
                {/* Snout shine */}
                <ellipse cx="-4" cy="-7" rx="6" ry="2.5" fill="#ffffff" opacity="0.6" />
              </g>

              {/* Eyes (Open or Closed when covering) */}
              {!isCoveringEyes ? (
                <g>
                  {/* Left Eye */}
                  <ellipse cx="75" cy="85" rx="8" ry="9" fill="#1e1b4b" />
                  <ellipse cx="72" cy="82" rx="3" ry="3.5" fill="#ffffff" />
                  <ellipse cx="78" cy="88" rx="1.5" ry="1.5" fill="#ffffff" />

                  {/* Right Eye */}
                  <ellipse cx="125" cy="85" rx="8" ry="9" fill="#1e1b4b" />
                  <ellipse cx="122" cy="82" rx="3" ry="3.5" fill="#ffffff" />
                  <ellipse cx="128" cy="88" rx="1.5" ry="1.5" fill="#ffffff" />

                  {/* Tiny happy eyebrows */}
                  <path d="M 69 73 Q 75 70 81 73" stroke="#be185d" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 119 73 Q 125 70 131 73" stroke="#be185d" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  {/* Closed cute curved wink lines behind hooves */}
                  <path d="M 68 86 Q 75 92 82 86" stroke="#be185d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 118 86 Q 125 92 132 86" stroke="#be185d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </g>
              )}

              {/* Tiny Smile under snout */}
              <path d="M 94 130 Q 100 135 106 130" stroke="#be123c" strokeWidth="2.2" fill="none" strokeLinecap="round" />

              {/* Tiny Piglet Hooves / Paws */}
              {/* If covering eyes, hooves move up to eyes! */}
              <motion.g
                initial={false}
                animate={
                  isCoveringEyes
                    ? { y: -38, x: 12, rotate: 18 }
                    : { y: 0, x: 0, rotate: 0 }
                }
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {/* Left Hoof */}
                <ellipse cx="65" cy="148" rx="15" ry="11" fill="#fda4af" stroke="#f43f5e" strokeWidth="2.5" />
                <path d="M 65 142 L 65 152" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
              </motion.g>

              <motion.g
                initial={false}
                animate={
                  isCoveringEyes
                    ? { y: -38, x: -12, rotate: -18 }
                    : { y: 0, x: 0, rotate: 0 }
                }
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {/* Right Hoof */}
                <ellipse cx="135" cy="148" rx="15" ry="11" fill="#fda4af" stroke="#f43f5e" strokeWidth="2.5" />
                <path d="M 135 142 L 135 152" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
            </svg>
          </div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-9 shadow-xl shadow-pink-200/60 border border-pink-100 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-6 pt-2">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/70 mb-2.5">
              <span className="text-sm">🐷</span>
              <span className="text-xs font-bold text-pink-700 tracking-wide font-sans">
                Baby Oink
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              {isSignUpMode ? 'Oink! Join the Pen!' : 'Oink! Welcome Back!'}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isSignUpMode
                ? 'Create your sweet campus account in seconds!'
                : 'Your little happy place awaits!'}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3.5 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-2.5 text-xs font-semibold text-pink-900"
              >
                <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Email or Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="e.g. oink@campus.edu or littlepiggy"
                className="w-full px-4 py-3 rounded-2xl bg-[#fff9fa] border border-pink-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm placeholder:text-stone-400 text-stone-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Password
                </label>
                {!isSignUpMode && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#fff9fa] border border-pink-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm placeholder:text-stone-400 text-stone-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-pink-600 transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {isCoveringEyes && (
                <p className="text-[11px] text-pink-500 font-medium mt-1 italic flex items-center gap-1">
                  <span>🐷 Baby Oink is covering eyes: no peeking!</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-pink-300 text-pink-500 focus:ring-pink-400 cursor-pointer accent-pink-500"
                />
                <span className="text-xs font-medium text-stone-600">Remember me</span>
              </label>
            </div>

            {/* Prominent Pastel Pink Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300 transition-all duration-200 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isSignUpMode ? 'Create My Account!' : 'Let Me In!'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-5 text-center">
            {isSignUpMode ? (
              <p className="text-xs text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(false)}
                  className="font-bold text-pink-600 hover:text-pink-800 hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(true)}
                  className="font-bold text-pink-600 hover:text-pink-800 hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-pink-700/60 mt-4 select-none">
          Baby Oink Theme · Soft, safe & cozy campus authentication
        </p>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-pink-200 text-stone-800"
            >
              <div className="text-center mb-4">
                <span className="text-2xl">🐷</span>
                <h3 className="text-lg font-bold font-serif text-stone-900 mt-1">
                  Reset Password
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enter your email and Baby Oink will send a reset link!
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl text-xs text-pink-900 text-center font-medium">
                  Oink! We sent password reset instructions to your inbox!
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@campus.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Send Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
