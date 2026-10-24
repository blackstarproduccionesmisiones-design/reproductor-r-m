import React, { useState } from 'react';
import { SongInfo } from '../types';
import { X, Copy, Check, MessageCircle, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: SongInfo;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, song }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const streamUrl = 'https://cesarradio.realserver.es/listen/rock_y_metal/radio.mp3';
  const shareText = `🤘 ¡Escucha "${song.title}" de ${song.artist} en vivo por ROCK & METAL Radio Online! 🎸 Sintoniza en directo: ${streamUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(streamUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(streamUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Rock & Metal Radio Online',
        text: shareText,
        url: streamUrl,
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0f0d12] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-red-500" />
            <h3
              className="text-lg font-bold text-white uppercase tracking-wider"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Compartir Radio & Canción
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently playing preview */}
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
          <img
            src={song.art || '/assets/aistudio/logo_rock___metal_701d5405.jpeg'}
            alt={song.title}
            className="w-14 h-14 rounded-lg object-cover border border-zinc-700 shrink-0 shadow-md"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/aistudio/logo_rock___metal_701d5405.jpeg';
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Sonando Ahora</div>
            <h4 className="text-sm font-bold text-white truncate">{song.artist}</h4>
            <p className="text-xs text-zinc-300 truncate">{song.title}</p>
            {song.album && (
              <p className="text-[11px] text-red-400/90 font-medium truncate mt-0.5">{song.album}</p>
            )}
          </div>
        </div>

        {/* Share buttons grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-zinc-100 hover:text-white transition-all font-semibold text-xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareToFacebook}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/30 text-zinc-100 hover:text-white transition-all font-semibold text-xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center text-white shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span>Facebook</span>
          </button>

          <button
            onClick={shareToTwitter}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-100 hover:text-white transition-all font-semibold text-xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shrink-0">
              <span className="font-bold text-xs">𝕏</span>
            </div>
            <span>X (Twitter)</span>
          </button>

          <button
            onClick={shareToTelegram}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/30 text-zinc-100 hover:text-white transition-all font-semibold text-xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-[#229ED9] flex items-center justify-center text-white shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>
            <span>Telegram</span>
          </button>
        </div>

        {/* Copy text block */}
        <div className="pt-2">
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-glow-red-sm transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Enlace y Mensaje</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
