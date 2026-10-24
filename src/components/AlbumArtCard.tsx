import React, { useState, useEffect } from 'react';
import { SongInfo } from '../types';
import { Radio, Disc3, Share2, Maximize2, X, Music } from 'lucide-react';

interface AlbumArtCardProps {
  song: SongInfo;
  isPlaying: boolean;
  onShare: () => void;
  listenersCount?: number;
}

export const AlbumArtCard: React.FC<AlbumArtCardProps> = ({
  song,
  isPlaying,
  onShare,
  listenersCount = 0,
}) => {
  const [imgError, setImgError] = useState(false);
  const [showFullArtModal, setShowFullArtModal] = useState(false);
  const fallbackImg = '/assets/aistudio/logo_rock___metal_701d5405.jpeg';

  // Crucial: reset error state when the song changes so new album art loads!
  useEffect(() => {
    setImgError(false);
  }, [song.art, song.id, song.title]);

  const currentCover = !imgError && song.art ? song.art : fallbackImg;

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 py-3">
        {/* Album Cover Jacket with realistic 3D Vinyl sleeve & spinning vinyl disc (40% larger) */}
        <div className="relative group shrink-0">
          {/* Vinyl Disc that slides out and spins when playing (40% larger) */}
          <div
            className={`absolute top-1 right-0 w-[224px] h-[224px] sm:w-[248px] sm:h-[248px] md:w-[268px] md:h-[268px] rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl transition-all duration-1000 flex items-center justify-center pointer-events-none ${
              isPlaying
                ? 'translate-x-6 sm:translate-x-8 md:translate-x-10 rotate-[720deg] opacity-90'
                : 'translate-x-0 rotate-0 opacity-0'
            }`}
            style={{
              transition: 'transform 2.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
              animation: isPlaying ? 'spin 6s linear infinite' : 'none',
            }}
          >
            {/* Vinyl record grooves texture */}
            <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[216px] md:h-[216px] rounded-full border border-zinc-800/80 flex items-center justify-center">
              <div className="w-[130px] h-[130px] sm:w-[145px] sm:h-[145px] md:w-[155px] md:h-[155px] rounded-full border border-zinc-800/70 flex items-center justify-center">
                <div className="w-[85px] h-[85px] sm:w-[95px] sm:h-[95px] md:w-[105px] md:h-[105px] rounded-full border border-zinc-800/60 flex items-center justify-center">
                  {/* Vinyl center red label */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-700 border-2 border-zinc-900 flex items-center justify-center shadow-inner">
                    <div className="w-3.5 h-3.5 rounded-full bg-black border border-zinc-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Album Jacket Cover (40% larger: 246px / 270px / 292px) */}
          <div className="relative w-[246px] h-[246px] sm:w-[270px] sm:h-[270px] md:w-[292px] md:h-[292px] rounded-2xl p-1.5 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black shadow-2xl border border-zinc-800/90 z-10 transition-transform group-hover:scale-[1.02]">
            {/* Dynamic red backlight aura */}
            <div
              className={`absolute -inset-1 rounded-xl bg-red-600/30 blur-lg transition-opacity duration-700 pointer-events-none ${
                isPlaying ? 'opacity-100' : 'opacity-20'
              }`}
            />

            <div className="relative w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center shadow-inner">
              <img
                src={currentCover}
                alt={`Portada del álbum: ${song.artist} - ${song.title}`}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Album cover glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/15 pointer-events-none" />

              {/* "TRANSMITIENDO" live badge overlay */}
              {isPlaying && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-300 font-bold tracking-wider uppercase">
                    AL AIRE
                  </span>
                </div>
              )}

              {/* Click to expand full artwork view */}
              <button
                onClick={() => setShowFullArtModal(true)}
                className="absolute top-2 right-2 min-w-[32px] min-h-[32px] rounded-full bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-zinc-700"
                title="Ampliar portada del álbum"
                aria-label="Ver portada completa"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Quick share button overlay on bottom right */}
              <button
                onClick={onShare}
                className="absolute bottom-2 right-2 min-w-[36px] min-h-[36px] rounded-full bg-black/75 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 border border-zinc-700 hover:border-red-500 shadow-md"
                title="Compartir canción actual"
                aria-label="Compartir canción actual"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Song Metadata & Live Badge */}
        <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left z-10">
          {/* Live Broadcast Badge */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-red-700 to-red-600 border border-red-500/80 shadow-glow-red-sm">
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span
                className="text-xs font-black tracking-wider text-white uppercase"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                EN VIVO
              </span>
            </div>

            {listenersCount > 0 && (
              <div className="text-[11px] font-mono text-zinc-400 tabular-nums">
                {listenersCount} {listenersCount === 1 ? 'oyente' : 'oyentes'}
              </div>
            )}
          </div>

          {/* Artist Name */}
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide truncate mb-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Oswald', 'Plus Jakarta Sans', sans-serif" }}
            title={song.artist}
          >
            {song.artist}
          </h2>

          {/* Song Title */}
          <h3
            className="text-base sm:text-lg md:text-xl font-bold text-zinc-200 truncate mb-1.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            title={song.title}
          >
            {song.title}
          </h3>

          {/* Album Title (Prominently displayed like in the reference image) */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-bold tracking-wider text-red-500 uppercase truncate">
            <Music className="w-3.5 h-3.5 shrink-0 text-red-400" />
            <span className="truncate" title={song.album || 'Rock & Metal Live'}>
              {song.album || 'ROCK & METAL RADIO'}
            </span>
          </div>

          {/* Genre & Quality specs */}
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-center sm:justify-start gap-2">
            {song.genre && (
              <>
                <span className="text-zinc-300 font-semibold">{song.genre}</span>
                <span className="text-zinc-600">•</span>
              </>
            )}
            <span className="text-zinc-400 font-mono">128 kbps HD</span>
          </div>
        </div>
      </div>

      {/* Full Artwork Modal when user wants to view the high-resolution album cover */}
      {showFullArtModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowFullArtModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#121016] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div className="min-w-0 pr-2">
                <h4 className="text-sm font-bold text-white truncate">{song.artist}</h4>
                <p className="text-xs text-zinc-400 truncate">{song.album || song.title}</p>
              </div>
              <button
                onClick={() => setShowFullArtModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Cerrar vista de portada"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-glow-red-sm">
              <img
                src={currentCover}
                alt={`${song.artist} - ${song.title}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full mt-3 flex items-center justify-between text-xs text-zinc-400">
              <span>Portada oficial del álbum</span>
              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
