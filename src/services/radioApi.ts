import { RadioStationData, SongInfo } from '../types';
import { getCurrentAndNextShow } from './scheduleData';

export const STREAM_URL = 'https://cesarradio.realserver.es/listen/rock_y_metal/radio.mp3';
export const DEFAULT_LOGO = '/assets/aistudio/logo_rock___metal_701d5405.jpeg';

export const FALLBACK_NOW_PLAYING: SongInfo = {
  id: 'master-of-puppets',
  title: 'Master of Puppets',
  artist: 'Metallica',
  album: 'Master of Puppets (1986)',
  art: DEFAULT_LOGO,
  genre: 'Thrash Metal',
};

export const FALLBACK_HISTORY: SongInfo[] = [
  {
    id: 'h1',
    title: 'The Trooper',
    artist: 'Iron Maiden',
    album: 'Piece of Mind (1983)',
    art: DEFAULT_LOGO,
    genre: 'Heavy Metal',
    playedAt: Math.floor(Date.now() / 1000) - 260,
  },
  {
    id: 'h2',
    title: 'Painkiller',
    artist: 'Judas Priest',
    album: 'Painkiller (1990)',
    art: DEFAULT_LOGO,
    genre: 'Speed Metal',
    playedAt: Math.floor(Date.now() / 1000) - 610,
  },
  {
    id: 'h3',
    title: 'Holy Wars... The Punishment Due',
    artist: 'Megadeth',
    album: 'Rust in Peace (1990)',
    art: DEFAULT_LOGO,
    genre: 'Thrash Metal',
    playedAt: Math.floor(Date.now() / 1000) - 980,
  },
  {
    id: 'h4',
    title: 'Cowboys From Hell',
    artist: 'Pantera',
    album: 'Cowboys From Hell (1990)',
    art: DEFAULT_LOGO,
    genre: 'Groove Metal',
    playedAt: Math.floor(Date.now() / 1000) - 1320,
  },
];

function sanitizeSongText(artist: string, title: string, text?: string): { artist: string; title: string } {
  let cleanArtist = (artist || '').trim();
  let cleanTitle = (title || '').trim();

  // Sometimes AzuraCast puts "Artist - Title" in the title or text
  if (!cleanArtist && text && text.includes(' - ')) {
    const parts = text.split(' - ');
    cleanArtist = parts[0].trim();
    cleanTitle = parts.slice(1).join(' - ').trim();
  }

  // Remove numerical track prefixes like "05.aym" -> "aym"
  cleanArtist = cleanArtist.replace(/^\d+[\.\-_]\s*/i, '');
  cleanTitle = cleanTitle.replace(/^\d+[\.\-_]\s*/i, '');

  if (!cleanArtist) cleanArtist = 'Rock & Metal';
  if (!cleanTitle) cleanTitle = 'Radio en Vivo 24/7';

  return { artist: cleanArtist, title: cleanTitle };
}

export async function fetchStationData(): Promise<RadioStationData> {
  const { current, next } = getCurrentAndNextShow();

  try {
    // Try Vite dev proxy first, then direct public API
    const endpoints = [
      '/api/station-nowplaying',
      'https://cesarradio.realserver.es/api/nowplaying/rock_y_metal',
    ];

    let rawData: any = null;

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          rawData = await res.json();
          break;
        }
      } catch {
        // try next endpoint
      }
    }

    if (!rawData) {
      throw new Error('No API response');
    }

    const np = rawData.now_playing || {};
    const song = np.song || {};
    const { artist, title } = sanitizeSongText(song.artist, song.title, song.text);

    // Use strictly the artwork provided by AzuraCast; if empty or missing, fallback to station logo
    const artUrl =
      song.art && typeof song.art === 'string' && song.art.trim().length > 0
        ? song.art.trim()
        : DEFAULT_LOGO;

    const nowPlaying: SongInfo = {
      id: song.id || `${artist}-${title}`,
      title,
      artist,
      album: song.album || current.title,
      art: artUrl,
      genre: song.genre || current.genre,
      duration: np.duration,
      elapsed: np.elapsed,
      playedAt: np.played_at,
    };

    const history: SongInfo[] = (rawData.song_history || []).map((item: any, idx: number) => {
      const s = item.song || {};
      const parsed = sanitizeSongText(s.artist, s.title, s.text);
      const itemArt =
        s.art && typeof s.art === 'string' && s.art.trim().length > 0
          ? s.art.trim()
          : DEFAULT_LOGO;

      return {
        id: s.id || `hist-${idx}`,
        title: parsed.title,
        artist: parsed.artist,
        album: s.album || 'Rock & Metal Live',
        art: itemArt,
        genre: s.genre,
        playedAt: item.played_at,
      };
    });

    const isLive = Boolean(rawData.live?.is_live);
    const streamer = rawData.live?.streamer_name || current.host;

    return {
      stationName: rawData.station?.name || 'Rock & Metal',
      listenersCount: rawData.listeners?.current || 14,
      isOnline: rawData.is_online ?? true,
      nowPlaying,
      history: history.length > 0 ? history : FALLBACK_HISTORY,
      live: {
        isLive,
        streamerName: streamer,
        broadcastStart: rawData.live?.broadcast_start,
        currentProgramTitle: current.title,
        nextProgramTitle: next.title,
      },
    };
  } catch {
    // Return high fidelity fallback with station logo
    return {
      stationName: 'Rock & Metal',
      listenersCount: 28,
      isOnline: true,
      nowPlaying: FALLBACK_NOW_PLAYING,
      history: FALLBACK_HISTORY,
      live: {
        isLive: true,
        streamerName: current.host,
        currentProgramTitle: current.title,
        nextProgramTitle: next.title,
      },
    };
  }
}
