export interface SongInfo {
  id: string;
  title: string;
  artist: string;
  album: string;
  art: string;
  genre?: string;
  duration?: number;
  elapsed?: number;
  playedAt?: number;
}

export interface LiveShowInfo {
  isLive: boolean;
  streamerName: string;
  broadcastStart?: number | null;
  currentProgramTitle: string;
  nextProgramTitle: string;
}

export interface RadioStationData {
  stationName: string;
  listenersCount: number;
  isOnline: boolean;
  nowPlaying: SongInfo;
  playingNext?: SongInfo;
  history: SongInfo[];
  live: LiveShowInfo;
}

export interface ScheduleItem {
  id: string;
  title: string;
  host: string;
  days: string;
  startTime: string; // "14:00"
  endTime: string;   // "18:00"
  description: string;
  genre: string;
  isCurrent?: boolean;
}
