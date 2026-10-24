import React, { useState } from 'react';
import { X, Bell, BellOff, Calendar, Radio, Check, Sparkles, Volume2 } from 'lucide-react';
import { STATION_SCHEDULE, getCurrentAndNextShow } from '../services/scheduleData';
import {
  areNotificationsEnabled,
  toggleNotifications,
  testLiveNotification,
  isNotificationSupported,
} from '../services/notificationService';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationToggled: (enabled: boolean) => void;
  onOpenInstall?: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onNotificationToggled,
  onOpenInstall,
}) => {
  const [notificationsOn, setNotificationsOn] = useState(() => areNotificationsEnabled());
  const [testSent, setTestSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const { current, next, timeToNext } = getCurrentAndNextShow();
  const supported = isNotificationSupported();

  const handleToggle = async () => {
    setErrorMsg(null);
    const targetState = !notificationsOn;
    const success = await toggleNotifications(targetState);
    if (success) {
      setNotificationsOn(true);
      onNotificationToggled(true);
    } else {
      if (targetState && Notification.permission === 'denied') {
        setErrorMsg('Las notificaciones están bloqueadas en tu navegador. Habilítalas en los permisos del sitio.');
      }
      setNotificationsOn(false);
      onNotificationToggled(false);
    }
  };

  const handleTestNotification = () => {
    const sent = testLiveNotification();
    if (sent) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      setErrorMsg('Activa primero las notificaciones para recibir alertas.');
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0e0c10] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-red-500" />
            <h3
              className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Programación & Notificaciones
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            aria-label="Cerrar programación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Push Notifications Configuration Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900/80 border border-red-900/50">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-400" />
                  <h4 className="text-sm font-bold text-white">
                    Notificaciones de Programas en Vivo
                  </h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Recibe un aviso instantáneo en tu pantalla cuando empiece un programa especial o transmisión en directo.
                </p>
              </div>

              {/* Toggle switch */}
              <button
                onClick={handleToggle}
                className={`min-w-[52px] h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  notificationsOn ? 'bg-red-600' : 'bg-zinc-700'
                }`}
                role="switch"
                aria-checked={notificationsOn}
                aria-label="Activar o desactivar notificaciones de programas en vivo"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    notificationsOn ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 mt-2 bg-red-950/60 p-2 rounded border border-red-800/60">
                {errorMsg}
              </p>
            )}

            {/* Test button */}
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                {notificationsOn ? '✅ Notificaciones activas' : '⚪ Notificaciones desactivadas'}
              </span>

              <button
                onClick={handleTestNotification}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-xs font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
              >
                {testSent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    ¡Notificación Enviada!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    Probar Notificación
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Install on Android PWA Banner */}
          {onOpenInstall && (
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/70 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <span className="text-red-500">📱</span> Instalar en tu Android
                </div>
                <p className="text-[11px] text-zinc-400 truncate">
                  Acceso directo, controles en pantalla de bloqueo y modo pantalla completa.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenInstall();
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-glow-red-sm"
              >
                Instalar
              </button>
            </div>
          )}

          {/* Current & Next Highlight Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-red-500/50">
              <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-black uppercase tracking-wider mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Al Aire Ahora
              </div>
              <h5 className="text-sm font-bold text-white truncate">{current.title}</h5>
              <p className="text-xs text-zinc-400">{current.host} · {current.startTime} a {current.endTime}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1">
                A Continuación (en {timeToNext})
              </div>
              <h5 className="text-sm font-bold text-zinc-200 truncate">{next.title}</h5>
              <p className="text-xs text-zinc-400">{next.host} · {next.startTime}</p>
            </div>
          </div>

          {/* Schedule list */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Grilla Completa de Programación (Hora Local)
            </div>

            <div className="divide-y divide-zinc-800/80 rounded-xl bg-zinc-900/40 border border-zinc-800 overflow-hidden">
              {STATION_SCHEDULE.map((show) => {
                const isCurrent = show.id === current.id;
                return (
                  <div
                    key={show.id}
                    className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
                      isCurrent ? 'bg-red-950/20' : 'hover:bg-zinc-800/30'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-400">
                          {show.startTime} - {show.endTime}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold tracking-wider uppercase">
                            En Vivo
                          </span>
                        )}
                      </div>
                      <h6 className="text-sm font-bold text-white">{show.title}</h6>
                      <p className="text-xs text-zinc-400">{show.description}</p>
                    </div>

                    <div className="text-[11px] text-zinc-400 shrink-0 sm:text-right">
                      <span className="font-semibold text-zinc-300">{show.host}</span>
                      <div className="text-zinc-500">{show.days}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Transmisión ininterrumpida 24 horas</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
