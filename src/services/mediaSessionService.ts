import { SongInfo } from '../types';

export function setupMediaSession(
  song: SongInfo,
  onPlay: () => void,
  onPause: () => void,
  onStop: () => void,
  onResync: () => void
) {
  if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
    return;
  }

  const artUrl = song.art || '/assets/aistudio/logo_rock___metal_701d5405.jpeg';
  const logoUrl = '/assets/aistudio/logo_rock___metal_701d5405.jpeg';

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title || 'Rock & Metal Live',
    artist: song.artist || 'Rock & Metal Radio Online',
    album: song.album || 'Rock & Metal Radio Online',
    artwork: [
      { src: artUrl, sizes: '96x96', type: 'image/jpeg' },
      { src: artUrl, sizes: '128x128', type: 'image/jpeg' },
      { src: artUrl, sizes: '192x192', type: 'image/jpeg' },
      { src: logoUrl, sizes: '256x256', type: 'image/jpeg' },
      { src: logoUrl, sizes: '512x512', type: 'image/jpeg' },
    ],
  });

  try {
    navigator.mediaSession.setActionHandler('play', () => {
      onPlay();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      onPause();
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      onStop();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      onResync();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      onResync();
    });
  } catch (err) {
    console.debug('MediaSession action handler error:', err);
  }
}

export function updatePlaybackState(isPlaying: boolean) {
  if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }
}
