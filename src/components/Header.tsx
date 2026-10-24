import React from 'react';
import { Menu, Bell, Radio } from 'lucide-react';

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
    <header className="relative w-full px-4 pt-3 pb-2 flex items-center justify-between z-20">
      {/* Station Logo */}
      <div className="flex items-center gap-2">
        <div className="relative group cursor-pointer" onClick={onOpenMenu} title="Información de la radio">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-red-600 via-zinc-400 to-red-500 shadow-glow-red-sm overflow-hidden flex items-center justify-center transition-transform active:scale-95">
            <img
              src="/assets/aistudio/logo_rock___metal_701d5405.jpeg"
              alt="Rock & Metal Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          {isLive && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 border-2 border-[#09090c] rounded-full animate-ping"
              title="Transmisión en vivo"
            />
          )}
          {isLive && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 border-2 border-[#09090c] rounded-full"
            />
          )}
        </div>
      </div>

      {/* Center Title Lockup */}
      <div className="flex flex-col items-center select-none text-center px-2">
        <div className="flex items-center gap-1.5 font-black tracking-wider text-xl sm:text-2xl" style={{ fontFamily: "'Cinzel', 'Oswald', sans-serif" }}>
          <span className="text-zinc-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Rock
          </span>
          <span className="text-red-500 text-2xl sm:text-3xl font-extrabold italic drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            &
          </span>
          <span className="text-zinc-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Metal
          </span>
        </div>
        
        {/* Red accent divider line */}
        <div className="w-full flex items-center justify-center gap-2 my-0.5">
          <div className="h-[2px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-red-600" />
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-zinc-300 uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Radio Online
          </span>
          <div className="h-[2px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-red-600" />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          onClick={onOpenInstall}
          className="min-h-[40px] px-2.5 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-bold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-red-600/30 border border-zinc-700/70 hover:border-red-500/70 transition-all shadow-sm active:scale-95"
          title="Instalar app en tu celular Android"
          aria-label="Instalar app"
        >
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold whitespace-nowrap">
            Instalar App
          </span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900/60 transition-colors"
          title="Notificaciones de programas en vivo"
          aria-label="Configurar notificaciones en vivo"
        >
          <Bell className="w-5 h-5" />
          {notificationsEnabled && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-glow-red-sm" />
          )}
        </button>

        <button
          onClick={onOpenMenu}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors"
          title="Menú y programación"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
