import React from 'react';
import { SongInfo } from '../types';
import { X, Clock, Share2, Music, Check } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SongInfo[];
  currentSong: SongInfo;
  onShareSong: (song: SongInfo) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  currentSong,
  onShareSong,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (song: SongInfo) => {
    const text = `${song.artist} - ${song.title} (Rock & Metal Radio Online)`;
    navigator.clipboard.writeText(text);
    setCopiedId(song.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatPlayedAt = (timestamp?: number) => {
    if (!timestamp) return 'Reciente';
    const secondsAgo = Math.floor(Date.now() / 1000) - timestamp;
    if (secondsAgo < 60) return 'Hace un momento';
    const mins = Math.floor(secondsAgo / 60);
    if (mins < 60) return `Hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    return `Hace ${hours} h`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md h-full bg-[#0d0d11] border-l border-zinc-800 shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            <h3
              className="text-lg font-bold text-white uppercase tracking-wider"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Historial de Canciones
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            aria-label="Cerrar historial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Song Highlight */}
        <div className="p-4 bg-red-950/20 border-b border-red-900/40">
          <div className="text-[10px] font-bold tracking-widest text-red-400 uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Sonando Ahora en Vivo
          </div>
          <div className="flex items-center gap-3">
            <img
              src={currentSong.art || '/assets/aistudio/logo_rock___metal_701d5405.jpeg'}
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover border border-red-500/50 shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/aistudio/logo_rock___metal_701d5405.jpeg';
              }}
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate">{currentSong.artist}</h4>
              <p className="text-xs text-zinc-300 truncate">{currentSong.title}</p>
            </div>
            <button
              onClick={() => onShareSong(currentSong)}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors"
              title="Compartir tema actual"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Temas reproducidos recientemente ({history.length})
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 flex flex-col items-center">
              <Music className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">El historial se irá completando a medida que avance la transmisión.</p>
            </div>
          ) : (
            history.map((song, idx) => (
              <div
                key={song.id || idx}
                className="group flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/70 hover:border-zinc-700 transition-all"
              >
                <img
                  src={song.art || '/assets/aistudio/logo_rock___metal_701d5405.jpeg'}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover border border-zinc-700/80 shrink-0 shadow-md"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/logo_rock___metal_701d5405.jpeg';
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-200 truncate group-hover:text-red-400 transition-colors">
                    {song.artist}
                  </h4>
                  <p className="text-xs text-zinc-300 truncate">{song.title}</p>
                  {song.album && (
                    <p className="text-[10px] text-red-400/90 font-medium truncate">{song.album}</p>
                  )}
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatPlayedAt(song.playedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopy(song)}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    title="Copiar artista y tema"
                    aria-label="Copiar artista y tema"
                  >
                    {copiedId === song.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <span className="text-[10px] font-mono px-1">Copiar</span>
                    )}
                  </button>

                  <button
                    onClick={() => onShareSong(song)}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                    title="Compartir tema"
                    aria-label="Compartir tema"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 text-center text-[11px] text-zinc-400">
          Rock & Metal Radio Online · Transmitiendo 24 Horas
        </div>
      </div>
    </div>
  );
};
