import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoupeCursorProps {
  boardRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
}

export const LoupeCursor: React.FC<LoupeCursorProps> = ({ boardRef, enabled = true }) => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isInside, setIsInside] = useState(false);
  const [isOverCard, setIsOverCard] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = boardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setPos({ x, y });
        setIsInside(true);

        // Check if cursor is over a button/card
        const target = e.target as HTMLElement;
        const overCard = Boolean(target && (target.closest('button') || target.closest('[data-notice-card]')));
        setIsOverCard(overCard);
      } else {
        setIsInside(false);
      }
    };

    const handleMouseLeave = () => {
      setIsInside(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    boardEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      boardEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [boardRef, enabled]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {isInside && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: isOverCard ? 1.08 : 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380, mass: 0.18 }}
          className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center select-none"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
          }}
          aria-hidden="true"
        >
          {/* Magnifying Glass Assembly */}
          <div className="relative flex items-center justify-center">
            {/* Cast shadow onto board from elevated glass & frame */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/25 blur-md translate-x-2 translate-y-3" />

            {/* Handle Shadow */}
            <div className="absolute w-3 h-14 bg-black/20 rounded-full blur-[3px] rotate-45 translate-x-12 translate-y-12 origin-top-left" />

            {/* Physical Polished Brass/Rosewood Handle extending at 45deg bottom-right */}
            <div
              className="absolute w-3.5 h-16 origin-top-left z-20 flex flex-col items-center"
              style={{
                top: '72%',
                left: '72%',
                transform: 'rotate(45deg)',
              }}
            >
              {/* Metallic Ferrule / Collar connecting to frame */}
              <div className="w-4 h-2.5 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-600 rounded-xs shadow-xs border-y border-amber-800/40" />
              {/* Turned Rosewood Handle with highlight reflection */}
              <div className="w-3.5 h-12 bg-gradient-to-r from-[#451e11] via-[#78351b] to-[#2e1208] rounded-b-md shadow-md relative overflow-hidden">
                {/* Specular sheen stripe down the wooden handle */}
                <div className="absolute top-0 left-0.5 w-1 h-full bg-white/20 blur-[0.4px]" />
              </div>
              {/* Brass End Cap */}
              <div className="w-3.5 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600 rounded-b-full shadow-xs" />
            </div>

            {/* Clear Transparent Optical Lens Container */}
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                /* Ultra-clear glass with subtle optical brightness enhancement */
                background: 'radial-gradient(circle at 38% 34%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 65%, rgba(255, 255, 255, 0.08) 100%)',
                backdropFilter: 'brightness(1.04) contrast(1.05)',
                /* Dual metallic brass & ground glass bevel borders */
                border: '3px solid rgba(217, 160, 95, 0.95)',
                boxShadow: `
                  inset 0 1.5px 3px rgba(255, 255, 255, 0.9),
                  inset 0 -1.5px 3px rgba(0, 0, 0, 0.35),
                  inset 0 0 12px rgba(255, 255, 255, 0.15),
                  0 8px 24px -2px rgba(0, 0, 0, 0.4)
                `,
              }}
            >
              {/* Outer Ground Optical Rim Ring */}
              <div className="absolute inset-[1px] rounded-full border border-white/60 pointer-events-none" />

              {/* Inner Optical Bevel (gives the authentic 3D lens refraction depth) */}
              <div
                className="absolute inset-[3px] rounded-full pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.35), inset 0 0 2px rgba(255, 255, 255, 0.6)',
                }}
              />

              {/* Top-Left Crescent Glass Highlight Curve (Iconic glass curvature reflection) */}
              <div
                className="absolute top-1 left-2 w-14 h-7 rounded-t-full pointer-events-none opacity-80"
                style={{
                  background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 70%)',
                  transform: 'rotate(-25deg)',
                  filter: 'blur(0.4px)',
                }}
              />

              {/* Tiny Crisp Specular Glare Dot */}
              <div className="absolute top-3 left-4 w-2 h-1 bg-white rounded-full opacity-90 blur-[0.2px] rotate-[-30deg]" />

              {/* Bottom-Right Soft Rim Reflection (Light bouncing back through glass) */}
              <div
                className="absolute bottom-1.5 right-2.5 w-12 h-5 rounded-b-full pointer-events-none opacity-40"
                style={{
                  background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
                  transform: 'rotate(-20deg)',
                }}
              />

              {/* Subtle Precision Optical Crosshairs (Hairline thin so they never obstruct reading) */}
              <div className="absolute w-2 h-[1px] bg-amber-950/30 left-2" />
              <div className="absolute w-2 h-[1px] bg-amber-950/30 right-2" />
              <div className="absolute h-2 w-[1px] bg-amber-950/30 top-2" />
              <div className="absolute h-2 w-[1px] bg-amber-950/30 bottom-2" />
            </div>
          </div>

          {/* Floating Transparent Glass Indicator (Placed BELOW lens so glass center stays 100% clear & legible!) */}
          <motion.div
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 px-2.5 py-0.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5 pointer-events-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isOverCard ? 'Click to Decode' : 'Inspect Notice'}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
