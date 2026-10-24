import { ScheduleItem } from '../types';

export const STATION_SCHEDULE: ScheduleItem[] = [
  {
    id: 'santuario-rock',
    title: 'El Santuario del Rock',
    host: 'Cesar Metalhead',
    days: 'Lunes a Viernes',
    startTime: '10:00',
    endTime: '13:00',
    description: 'Los mejores himnos del Hard Rock, Rock Clásico, Progresivo y Grunge de todos los tiempos.',
    genre: 'Classic Rock & Grunge',
  },
  {
    id: 'rotacion-extrema',
    title: 'Rotación Extrema & Novedades',
    host: 'DJ Rex',
    days: 'Lunes a Viernes',
    startTime: '13:00',
    endTime: '17:00',
    description: 'Estrenos internacionales de bandas emergentes, Metalcore, Nu Metal y Modern Heavy Metal.',
    genre: 'Metalcore & Modern Metal',
  },
  {
    id: 'hora-vinilo',
    title: 'La Hora del Vinilo Pesado',
    host: 'Lord Valdor',
    days: 'Lunes a Sábado',
    startTime: '17:00',
    endTime: '20:00',
    description: 'Joyas ocultas en acetato, NWOBHM, Power Metal y leyendas del rock en versiones de colección.',
    genre: 'NWOBHM & Heavy Metal',
  },
  {
    id: 'noche-thrash',
    title: 'Noche de Thrash & Brutal Metal',
    host: 'Cesar en Vivo',
    days: 'Todos los días',
    startTime: '20:00',
    endTime: '00:00',
    description: 'El programa insignia en vivo: Thrash, Death Metal, Black, Groove Metal y saludos a la comunidad.',
    genre: 'Thrash, Death & Black Metal',
  },
  {
    id: 'madrugada-acero',
    title: 'Madrugada de Acero',
    host: 'Transmisión 24/7',
    days: 'Diario',
    startTime: '00:00',
    endTime: '10:00',
    description: 'Poder continuo sin pausas comerciales ni interrupciones. La mejor dosis nocturna de distorsión.',
    genre: 'Rock & Metal Non-Stop',
  },
];

export function getCurrentAndNextShow(): { current: ScheduleItem; next: ScheduleItem; timeToNext: string } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find show where currentMinutes is between start and end
  for (let i = 0; i < STATION_SCHEDULE.length; i++) {
    const show = STATION_SCHEDULE[i];
    const [startH, startM] = show.startTime.split(':').map(Number);
    const [endH, endM] = show.endTime.split(':').map(Number);
    const startMin = startH * 60 + startM;
    let endMin = endH * 60 + endM;
    if (endMin <= startMin) endMin += 24 * 60; // Spans midnight

    let testMinutes = currentMinutes;
    if (testMinutes < startMin && endMin > 24 * 60) {
      testMinutes += 24 * 60;
    }

    if (testMinutes >= startMin && testMinutes < endMin) {
      const nextIndex = (i + 1) % STATION_SCHEDULE.length;
      const nextShow = STATION_SCHEDULE[nextIndex];
      const remainingMin = endMin - testMinutes;
      const hoursLeft = Math.floor(remainingMin / 60);
      const minsLeft = remainingMin % 60;
      const timeToNext = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft} min`;

      return {
        current: { ...show, isCurrent: true },
        next: nextShow,
        timeToNext,
      };
    }
  }

  // Fallback
  return {
    current: { ...STATION_SCHEDULE[3], isCurrent: true },
    next: STATION_SCHEDULE[4],
    timeToNext: 'En curso',
  };
}
