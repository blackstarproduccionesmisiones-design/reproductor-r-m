import React, { useEffect, useRef, useState } from 'react';

interface EqualizerProps {
  isPlaying: boolean;
  analyser?: AnalyserNode | null;
}

const NUM_BARS = 28;
const SEGMENTS_PER_BAR = 12;

export const Equalizer: React.FC<EqualizerProps> = ({ isPlaying, analyser }) => {
  // Array of bar values between 0 and 1
  const [barLevels, setBarLevels] = useState<number[]>(() =>
    new Array(NUM_BARS).fill(0.08)
  );
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);
  const peaksRef = useRef<number[]>(new Array(NUM_BARS).fill(0));

  useEffect(() => {
    let active = true;

    const updateVisualizer = () => {
      if (!active) return;

      phaseRef.current += 0.08;
      const phase = phaseRef.current;

      if (!isPlaying) {
        // Idle ambient state: gentle flat low level
        setBarLevels((prev) =>
          prev.map((val) => Math.max(0.04, val * 0.9))
        );
        animFrameRef.current = requestAnimationFrame(updateVisualizer);
        return;
      }

      // Check if real Web Audio API AnalyserNode has data
      let realAudioData: Uint8Array | null = null;
      if (analyser) {
        try {
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);

          // Check if there is actual non-zero audio data
          let sum = 0;
          for (let i = 0; i < 40; i++) {
            sum += dataArray[i];
          }
          if (sum > 10) {
            realAudioData = dataArray;
          }
        } catch {
          // Fallback to simulation
        }
      }

      const newLevels: number[] = [];

      for (let i = 0; i < NUM_BARS; i++) {
        if (realAudioData) {
          // Map analyser frequency bins to bars
          const binIndex = Math.min(
            Math.floor((i / NUM_BARS) * 48) + 2,
            realAudioData.length - 1
          );
          const rawVal = realAudioData[binIndex] / 255;
          // Apply curve for punchy bass and mids
          const boosted = Math.pow(rawVal, 0.85);
          newLevels.push(Math.min(1, Math.max(0.08, boosted)));
        } else {
          // Dynamic rock & metal beat simulation with heavy bass kicks and guitar mids
          const bassKick = Math.pow(Math.sin(phase * 2.8), 6) * 0.6;
          const snareHit = Math.pow(Math.cos(phase * 1.4 + 0.5), 8) * 0.45;
          const guitarRiff = Math.sin(phase * 3.7 + i * 0.4) * 0.25 + 0.35;
          const trebleFlicker = (Math.sin(phase * 6.2 + i * 1.1) + 1) * 0.18;

          // Bass is bars 0-7, Mids 8-20, Treble 21-27
          let target = 0.1;
          if (i < 8) {
            target = 0.2 + bassKick * 0.8 + Math.sin(phase * 1.5 + i) * 0.15;
          } else if (i < 20) {
            target = 0.25 + guitarRiff + snareHit * 0.4;
          } else {
            target = 0.15 + trebleFlicker + snareHit * 0.5;
          }

          // Add slight organic noise per bar
          const jitter = Math.sin(i * 99 + phase * 4) * 0.08;
          const level = Math.min(1, Math.max(0.08, target + jitter));
          newLevels.push(level);
        }
      }

      // Smooth decay for realistic LED response
      setBarLevels((prev) =>
        newLevels.map((target, idx) => {
          const current = prev[idx] || 0.08;
          if (target > current) {
            return current + (target - current) * 0.65; // Fast attack
          } else {
            return current - (current - target) * 0.25; // Smooth decay
          }
        })
      );

      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, analyser]);

  return (
    <div className="w-full px-4 py-2 select-none">
      <div className="relative w-full h-24 sm:h-28 rounded-lg bg-[#0a0709] border border-zinc-900/90 p-2.5 flex items-end justify-between gap-[2px] sm:gap-1 overflow-hidden shadow-inner">
        {/* Subtle grid backdrop lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_90%,rgba(255,255,255,0.03)_90%)] bg-[length:100%_8px] pointer-events-none" />

        {/* Ambient bottom glow */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-600/20 to-transparent pointer-events-none" />
        )}

        {/* Segmented LED bars */}
        {barLevels.map((level, barIndex) => {
          const activeSegments = Math.round(level * SEGMENTS_PER_BAR);

          return (
            <div
              key={barIndex}
              className="flex-1 flex flex-col-reverse gap-[2px] h-full justify-start items-center"
            >
              {Array.from({ length: SEGMENTS_PER_BAR }).map((_, segIndex) => {
                const isActive = segIndex < activeSegments;
                const isPeak = segIndex === activeSegments - 1 && isActive;

                // Color calculation based on height
                // Bottom segments: dark red to red; top segments: bright red to white-hot peak
                let colorClass = 'bg-[#181316]'; // Inactive segment

                if (isActive) {
                  if (segIndex >= 10) {
                    colorClass = 'bg-white shadow-[0_0_6px_#fff]'; // Peak white
                  } else if (segIndex >= 8) {
                    colorClass = 'bg-red-400 shadow-[0_0_6px_#f87171]'; // Upper red/orange
                  } else if (segIndex >= 4) {
                    colorClass = 'bg-red-500 shadow-[0_0_4px_#ef4444]'; // Mid fiery red
                  } else {
                    colorClass = 'bg-red-600'; // Base red
                  }
                }

                return (
                  <div
                    key={segIndex}
                    className={`w-full h-[5px] sm:h-[6px] rounded-[1px] transition-colors duration-75 ${colorClass}`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Frequency label strip */}
      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 px-1 pt-1 tracking-wider uppercase">
        <span>32Hz BASS</span>
        <span>250Hz</span>
        <span>1kHz MIDS</span>
        <span>4kHz</span>
        <span>16kHz TREBLE</span>
      </div>
    </div>
  );
};
