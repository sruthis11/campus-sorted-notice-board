import React from 'react';
import { PinType, TapeType } from '../types';

export const PushPin: React.FC<{ type: PinType; className?: string }> = ({ type, className = '' }) => {
  if (type === 'metal-paperclip') {
    return (
      <div className={`relative z-20 pointer-events-none ${className}`} aria-hidden="true">
        <svg width="22" height="42" viewBox="0 0 22 42" fill="none" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
          {/* Wire highlight & metal shine */}
          <path
            d="M6 38V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V33C18 35.2091 16.2091 37 14 37C11.7909 37 10 35.2091 10 33V12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12V30"
            stroke="#94a3b8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 38V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V33C18 35.2091 16.2091 37 14 37C11.7909 37 10 35.2091 10 33V12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12V30"
            stroke="#e2e8f0"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (type === 'wood-clip') {
    return (
      <div className={`relative z-20 pointer-events-none ${className}`} aria-hidden="true">
        <div className="w-5 h-8 bg-amber-800 rounded-sm shadow-md border border-amber-900/40 relative flex items-center justify-center">
          <div className="w-3.5 h-1.5 bg-slate-400 rounded-full shadow-inner" />
          <div className="absolute top-1 w-2.5 h-0.5 bg-amber-950/60" />
          <div className="absolute bottom-1 w-2.5 h-0.5 bg-amber-950/60" />
        </div>
      </div>
    );
  }

  if (type === 'dual-pins') {
    return (
      <div className={`absolute -top-3 inset-x-4 flex justify-between z-20 pointer-events-none ${className}`} aria-hidden="true">
        <SingleSphericalPin color="rose" />
        <SingleSphericalPin color="rose" />
      </div>
    );
  }

  const colorMap: Record<string, 'red' | 'purple' | 'green' | 'yellow'> = {
    'red-pushpin': 'red',
    'purple-pin': 'purple',
    'green-pushpin': 'green',
    'yellow-pin': 'yellow',
  };

  const color = colorMap[type] || 'red';

  return (
    <div className={`relative z-20 pointer-events-none ${className}`} aria-hidden="true">
      <SingleSphericalPin color={color} />
    </div>
  );
};

export const SingleSphericalPin: React.FC<{ color: 'red' | 'purple' | 'green' | 'yellow' | 'rose' }> = ({ color }) => {
  const bgColors = {
    red: 'from-rose-500 via-red-600 to-red-800',
    purple: 'from-purple-400 via-indigo-600 to-indigo-900',
    green: 'from-emerald-400 via-teal-600 to-emerald-800',
    yellow: 'from-amber-300 via-amber-500 to-amber-700',
    rose: 'from-pink-400 via-rose-500 to-rose-700'
  };

  return (
    <div className="relative group/pin flex items-center justify-center">
      {/* Pin head shadow */}
      <div className="absolute top-2.5 left-2.5 w-4 h-4 bg-black/35 rounded-full blur-[2px] transform -translate-x-1" />
      
      {/* 3D Pin Head */}
      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${bgColors[color]} shadow-md border border-white/30 relative flex items-center justify-center ring-1 ring-black/20`}>
        {/* Specular highlight */}
        <div className="w-1.5 h-1.5 rounded-full bg-white/70 absolute top-0.5 left-0.5 blur-[0.3px]" />
      </div>
    </div>
  );
};

export const WashiTape: React.FC<{ type?: TapeType; text?: string; className?: string }> = ({
  type = 'none',
  text,
  className = ''
}) => {
  if (type === 'none') return null;

  const colorClass =
    type === 'pink-washi'
      ? 'washi-tape-pink text-pink-900 border-pink-400/40'
      : type === 'amber-tape'
      ? 'washi-tape-amber text-amber-950 border-amber-500/40'
      : 'washi-tape-kraft text-amber-900 border-amber-600/40';

  return (
    <div
      className={`absolute z-20 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase transform shadow-sm pointer-events-none border-y border-dashed select-none ${colorClass} ${className}`}
      style={{
        clipPath: 'polygon(0% 0%, 97% 2%, 100% 98%, 3% 97%)',
      }}
    >
      {text || 'DUE SOON'}
    </div>
  );
};
