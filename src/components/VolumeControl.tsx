import React from 'react';
import { VolumeX, Volume1, Volume2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number; // 0 to 1
  isMuted: boolean;
  onVolumeChange: (newVol: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const currentVal = isMuted ? 0 : volume;
  const percentage = Math.round(currentVal * 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onVolumeChange(val);
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 px-4 py-2 select-none">
      {/* Mute / Low Volume Button */}
      <button
        onClick={onToggleMute}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-5 h-5 text-red-500" />
        ) : volume < 0.5 ? (
          <Volume1 className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {/* Slider with filled progress styling */}
      <div className="relative flex-1 flex items-center">
        {/* Background track */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          {/* Active red track */}
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Range input overlay */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentVal}
          onChange={handleSliderChange}
          aria-label="Control de volumen"
          className="rock-slider absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Visual Thumb aligned with percentage */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-red-500 shadow-glow-red-sm pointer-events-none transform -translate-x-1/2 transition-all duration-75"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Max Volume / Unmute trigger */}
      <button
        onClick={() => onVolumeChange(1)}
        className="min-w-[40px] min-h-[44px] flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
        title="Volumen al máximo (100%)"
        aria-label="Volumen al máximo"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      {/* VOL % Badge (exact match from reference screenshot!) */}
      <div className="shrink-0 px-2.5 py-1 rounded border border-red-900/60 bg-[#120a0d] shadow-inner">
        <span
          className="text-xs font-black tracking-wider text-red-500 tabular-nums uppercase"
          style={{ fontFamily: "'Oswald', monospace" }}
        >
          VOL {percentage}%
        </span>
      </div>
    </div>
  );
};
