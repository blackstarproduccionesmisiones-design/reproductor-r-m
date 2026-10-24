import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenInstall: () => void;
  notificationsEnabled: boolean;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotifications,
  onOpenInstall,
  notificationsEnabled,
  isLive,
}) => {
  return (
    <header className="relative w-full px-2 sm:px-4 pt-3 pb-2 flex items-center justify-between z-20 gap-2">
      {/* Station Title shifted to the left without top logo */}
      <div className="flex flex-col items-start select-none shrink min-w-0">
        <div
          className="flex items-center gap-1 sm:gap-1.5 font-black tracking-wider text-xl sm:text-2xl"
          style={{ fontFamily: "'Cinzel', 'Oswald', sans-serif" }}
        >
          <span className="text-zinc-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Rock
          </span>
          <span className="text-red-500 text-2xl sm:text-3xl font-extrabold italic drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            &
          </span>
          <span className="text-zinc-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Metal
          </span>
          {isLive && (
            <span className="relative flex h-2.5 w-2.5 ml-1.5" title="Transmisión en vivo">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
          )}
        </div>

        {/* Red accent line & Radio Online indicator */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-zinc-300 uppercase whitespace-nowrap"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Radio Online
          </span>
          <div className="h-[2px] w-6 sm:w-10 bg-gradient-to-r from-red-600 to-transparent" />
        </div>
      </div>

      {/* Right Actions: Instalar App, Notifications, and Menu button */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          onClick={onOpenInstall}
          className="h-9 px-2 sm:px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-bold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-red-600/30 border border-zinc-700/70 hover:border-red-500/70 transition-all shadow-sm active:scale-95"
          title="Instalar app en tu celular Android"
          aria-label="Instalar app"
        >
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold whitespace-nowrap">
            Instalar App
          </span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative min-w-[36px] sm:min-w-[40px] h-9 px-2 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900/60 transition-colors"
          title="Notificaciones de programas en vivo"
          aria-label="Configurar notificaciones en vivo"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {notificationsEnabled && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-glow-red-sm" />
          )}
        </button>

        <button
          onClick={onOpenMenu}
          className="min-w-[36px] sm:min-w-[40px] h-9 px-2 flex items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors"
          title="Menú y programación"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </header>
  );
};
