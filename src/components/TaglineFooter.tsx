import React from 'react';
import { Activity } from 'lucide-react';

export const TaglineFooter: React.FC = () => {
  return (
    <footer className="w-full px-4 pt-3 pb-4 select-none">
      <div className="flex items-center justify-center gap-2 text-zinc-400">
        {/* Left red accent line */}
        <div className="h-[2px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-red-600" />

        {/* Pulse ECG sound wave icon */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-red-500 animate-pulse" />
          <span
            className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-zinc-300 uppercase whitespace-nowrap"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            SOLO ROCK <span className="text-red-500">•</span> SOLO METAL <span className="text-red-500">•</span> 24 HS
          </span>
        </div>

        {/* Right red accent line */}
        <div className="h-[2px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-red-600" />
      </div>

      <div className="mt-2 text-center text-[10px] text-zinc-500">
        Streaming oficial en vivo · Reproductor sin anuncios
      </div>
    </footer>
  );
};
