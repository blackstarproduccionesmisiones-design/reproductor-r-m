import React from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, ListMusic, Share2, RotateCw } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onResync: () => void;
  onOpenHistory: () => void;
  onOpenShare: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  isLoading,
  onTogglePlay,
  onResync,
  onOpenHistory,
  onOpenShare,
}) => {
  return (
    <div className="w-full flex items-center justify-center gap-3 sm:gap-6 px-4 py-3">
      {/* 1. History / Playlist button */}
      <button
        onClick={onOpenHistory}
        className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-zinc-900/90 border border-zinc-700/70 text-zinc-300 hover:text-white hover:border-red-500 hover:bg-zinc-800 flex items-center justify-center transition-all active:scale-90"
        title="Historial de temas recientes"
        aria-label="Ver historial de canciones reproducidas"
      >
        <ListMusic className="w-5 h-5" />
      </button>

      {/* 2. Skip back / Re-sync stream */}
      <button
        onClick={onResync}
        className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-zinc-900/90 border border-zinc-700/70 text-zinc-300 hover:text-white hover:border-red-500 hover:bg-zinc-800 flex items-center justify-center transition-all active:scale-90"
        title="Reconectar / Sincronizar en vivo"
        aria-label="Reconectar transmisión"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* 3. MASTER PLAY / STOP BUTTON */}
      <div className="relative flex items-center justify-center">
        {/* Glowing pulsing aura when active */}
        {isPlaying && (
          <div className="absolute inset-0 -m-2 rounded-full bg-red-600/30 blur-lg animate-pulse pointer-events-none" />
        )}

        <button
          onClick={onTogglePlay}
          disabled={isLoading}
          className={`relative min-w-[64px] min-h-[64px] w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${
            isPlaying
              ? 'bg-[#0f0a0c] border-[3px] border-red-500 shadow-glow-red text-red-500 hover:border-red-400 hover:text-red-400'
              : 'bg-gradient-to-br from-red-600 to-red-800 border-[3px] border-red-400 text-white shadow-glow-red hover:brightness-110'
          }`}
          title={isPlaying ? 'Detener transmisión' : 'Reproducir en vivo'}
          aria-label={isPlaying ? 'Detener reproducción' : 'Iniciar reproducción'}
        >
          {isLoading ? (
            <RotateCw className="w-7 h-7 text-white animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8 fill-current drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          ) : (
            <Play className="w-8 h-8 fill-current translate-x-0.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          )}
        </button>
      </div>

      {/* 4. Skip forward / Refresh live stream */}
      <button
        onClick={onResync}
        className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-zinc-900/90 border border-zinc-700/70 text-zinc-300 hover:text-white hover:border-red-500 hover:bg-zinc-800 flex items-center justify-center transition-all active:scale-90"
        title="Actualizar señal en vivo"
        aria-label="Actualizar señal en vivo"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      {/* 5. Share track / radio */}
      <button
        onClick={onOpenShare}
        className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-zinc-900/90 border border-zinc-700/70 text-zinc-300 hover:text-white hover:border-red-500 hover:bg-zinc-800 flex items-center justify-center transition-all active:scale-90"
        title="Compartir canción o radio"
        aria-label="Compartir en redes sociales"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
};
