/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AlbumArtCard } from './components/AlbumArtCard';
import { AudioControls } from './components/AudioControls';
import { VolumeControl } from './components/VolumeControl';
import { Equalizer } from './components/Equalizer';
import { SocialShareBar } from './components/SocialShareBar';
import { TaglineFooter } from './components/TaglineFooter';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ScheduleModal } from './components/ScheduleModal';
import { ShareModal } from './components/ShareModal';
import { InstallModal } from './components/InstallModal';
import { SongInfo, RadioStationData } from './types';
import { STREAM_URL, fetchStationData, FALLBACK_NOW_PLAYING, FALLBACK_HISTORY } from './services/radioApi';
import { setupMediaSession, updatePlaybackState } from './services/mediaSessionService';
import {
  areNotificationsEnabled,
  sendLiveShowNotification,
} from './services/notificationService';
import { getCurrentAndNextShow } from './services/scheduleData';

// Direct stream and proxy fallback
const STREAM_ENDPOINTS = [
  STREAM_URL,
  '/api/stream',
];

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [endpointIndex, setEndpointIndex] = useState<number>(0);

  // Radio metadata state
  const [stationData, setStationData] = useState<RadioStationData>({
    stationName: 'Rock & Metal',
    listenersCount: 14,
    isOnline: true,
    nowPlaying: FALLBACK_NOW_PLAYING,
    history: FALLBACK_HISTORY,
    live: {
      isLive: true,
      streamerName: 'Cesar en Vivo',
      currentProgramTitle: 'El Santuario del Rock',
      nextProgramTitle: 'Noche de Thrash & Brutal Metal',
    },
  });

  // UI modals
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);
  const [selectedShareSong, setSelectedShareSong] = useState<SongInfo>(FALLBACK_NOW_PLAYING);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() =>
    areNotificationsEnabled()
  );

  // Track previous show for notification triggering
  const lastShowRef = useRef<string>('');

  // Toggle play/pause - Native HTML5 audio (No Web Audio API interception to prevent CORS muting)
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setStreamError(null);

    if (isPlaying) {
      audio.pause();
      // Remove src on stop to release stream connection
      audio.removeAttribute('src');
      audio.load();
      setIsPlaying(false);
      setIsLoading(false);
      updatePlaybackState(false);
    } else {
      setIsLoading(true);
      try {
        const streamSrc = STREAM_ENDPOINTS[endpointIndex] || STREAM_URL;
        // Append unique timestamp to prevent cached buffers on live streams
        audio.src = `${streamSrc}?t=${Date.now()}`;
        audio.volume = isMuted ? 0 : volume;
        audio.muted = isMuted;
        audio.load();

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }

        setIsPlaying(true);
        setIsLoading(false);
        updatePlaybackState(true);
      } catch (err: any) {
        console.error('Audio play error:', err);
        // Try fallback endpoint if first failed
        if (endpointIndex < STREAM_ENDPOINTS.length - 1) {
          setEndpointIndex((prev) => prev + 1);
          setStreamError('Conectando con servidor alternativo...');
        } else {
          setIsLoading(false);
          setIsPlaying(false);
          setStreamError('Haz clic en Play para iniciar la transmisión.');
        }
      }
    }
  }, [isPlaying, isMuted, volume, endpointIndex]);

  // Stop playback completely
  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    setIsPlaying(false);
    setIsLoading(false);
    updatePlaybackState(false);
  }, []);

  // Reconnect / refresh live stream
  const resyncStream = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsLoading(true);
    setStreamError(null);
    try {
      audio.pause();
      const streamSrc = STREAM_ENDPOINTS[endpointIndex] || STREAM_URL;
      audio.src = `${streamSrc}?resync=${Date.now()}`;
      audio.volume = isMuted ? 0 : volume;
      audio.muted = isMuted;
      audio.load();
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
      updatePlaybackState(true);
    } catch {
      setIsLoading(false);
      setStreamError('Reconectando señal en vivo...');
    }
  }, [endpointIndex, isMuted, volume]);

  // Volume change handler
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = false;
    }
  };

  // Toggle mute handler
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = nextMuted;
      }
      return nextMuted;
    });
  };

  // Fetch station now playing data periodically
  const loadData = useCallback(async () => {
    const data = await fetchStationData();
    setStationData(data);

    // MediaSession updates for phone lock screen
    setupMediaSession(
      data.nowPlaying,
      () => togglePlay(),
      () => togglePlay(),
      () => stopPlayback(),
      () => resyncStream()
    );

    // Check for show change and send push notification if enabled
    const { current } = getCurrentAndNextShow();
    if (current && current.title !== lastShowRef.current) {
      if (lastShowRef.current !== '' && notificationsEnabled) {
        sendLiveShowNotification(current.title, current.host, current.description);
      }
      lastShowRef.current = current.title;
    }
  }, [togglePlay, stopPlayback, resyncStream, notificationsEnabled]);

  // Initial load & polling
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Synchronize audio volume on startup
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Quick share handlers
  const openShareCurrentSong = () => {
    setSelectedShareSong(stationData.nowPlaying);
    setIsShareOpen(true);
  };

  const openShareSpecificSong = (song: SongInfo) => {
    setSelectedShareSong(song);
    setIsShareOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-grunge-pattern text-zinc-100 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Hidden Native HTML5 Audio Element - No Web Audio CORS muting */}
      <audio
        ref={audioRef}
        playsInline
        preload="none"
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoading(false);
          updatePlaybackState(true);
          setStreamError(null);
        }}
        onWaiting={() => setIsLoading(true)}
        onError={(e) => {
          console.error('Audio tag error:', e);
          setIsLoading(false);
          // Try switching endpoint if direct fails
          if (endpointIndex === 0) {
            setEndpointIndex(1);
          } else {
            setIsPlaying(false);
            setStreamError('Señal en vivo desconectada. Toca Play para reconectar.');
          }
        }}
      />

      {/* Custom Rock & Metal Skulls Wallpaper with atmospheric dark vignette */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: "url('/assets/background_rock.jpeg')",
        }}
      />
      {/* Dark scrim overlay for high-contrast UI legibility */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#08080a]/80 via-[#070709]/70 to-[#08080a]/85 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Ambient Red Smoke & Glow Background Lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-600/15 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-red-700/10 blur-[110px] rounded-full pointer-events-none z-0" />

      {/* Main Container - Responsive for mobile and expands elegantly on desktop */}
      <main className="relative z-10 w-full max-w-xl md:max-w-2xl mx-auto flex flex-col justify-between min-h-screen py-2 px-2 sm:px-4">
        {/* Top Header */}
        <Header
          onOpenMenu={() => setIsScheduleOpen(true)}
          onOpenNotifications={() => setIsScheduleOpen(true)}
          onOpenInstall={() => setIsInstallOpen(true)}
          notificationsEnabled={notificationsEnabled}
          isLive={stationData.isOnline}
        />

        {/* Stream Error Alert if any */}
        {streamError && (
          <div className="mx-4 my-1 p-2 rounded-lg bg-red-950/80 border border-red-700/80 text-xs text-red-200 text-center flex items-center justify-between">
            <span>{streamError}</span>
            <button
              onClick={resyncStream}
              className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase ml-2 hover:bg-red-500 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Player Core Area */}
        <div className="flex-1 flex flex-col justify-center space-y-1">
          {/* 1. Album Artwork and Song Info */}
          <AlbumArtCard
            song={stationData.nowPlaying}
            isPlaying={isPlaying}
            onShare={openShareCurrentSong}
            listenersCount={stationData.listenersCount}
          />

          {/* 2. Controls Row (History, Rewind, MASTER PLAY/STOP, Next, Share) */}
          <AudioControls
            isPlaying={isPlaying}
            isLoading={isLoading}
            onTogglePlay={togglePlay}
            onResync={resyncStream}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenShare={openShareCurrentSong}
          />

          {/* 3. Intuitive Volume Slider with VOL readout */}
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
          />

          {/* 4. Animated Graphic Equalizer */}
          <Equalizer
            isPlaying={isPlaying}
          />

          {/* 5. Social Media Icons (Facebook, Instagram, WhatsApp with exact user URLs) */}
          <SocialShareBar
            song={stationData.nowPlaying}
            onOpenShareModal={openShareCurrentSong}
          />
        </div>

        {/* 7. Bottom Tagline: SOLO ROCK • SOLO METAL • 24 HS */}
        <TaglineFooter />
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={stationData.history}
        currentSong={stationData.nowPlaying}
        onShareSong={openShareSpecificSong}
      />

      {/* Schedule & Live Push Notifications Modal */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onNotificationToggled={(enabled) => setNotificationsEnabled(enabled)}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        song={selectedShareSong}
      />

      {/* Android Install PWA Modal */}
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
}
