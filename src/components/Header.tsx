import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenInstall: () => void;
  notificationsEnabled: boolean;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotifications,
  onOpenInstall,
  notificationsEnabled,
}) => {
  return (
    <header className="relative w-full px-3 sm:px-4 pt-3 pb-2 flex items-center justify-end z-20 gap-2 sm:gap-3">
      {/* Botón Instalar App */}
      <button
        onClick={onOpenInstall}
        className="h-9 px-3 flex items-center gap-1.5 rounded-lg text-xs font-bold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-red-600/30 border border-zinc-700/70 hover:border-red-500/70 transition-all shadow-sm active:scale-95"
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

      {/* Campanita de notificaciones */}
      <button
        onClick={onOpenNotifications}
        className="relative min-w-[38px] h-9 px-2 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900/60 transition-colors"
        title="Notificaciones de programas en vivo"
        aria-label="Configurar notificaciones en vivo"
      >
        <Bell className="w-5 h-5" />
        {notificationsEnabled && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-glow-red-sm" />
        )}
      </button>

      {/* Menú */}
      <button
        onClick={onOpenMenu}
        className="min-w-[38px] h-9 px-2 flex items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors"
        title="Menú y programación"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
};
