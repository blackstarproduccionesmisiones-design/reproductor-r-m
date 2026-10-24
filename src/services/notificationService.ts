/**
 * Service to handle push/browser notifications when live shows begin
 */

const STORAGE_KEY = 'rock_metal_live_notifications_enabled';
const LAST_NOTIFIED_SHOW_KEY = 'rock_metal_last_notified_show';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const areNotificationsEnabled = (): boolean => {
  if (!isNotificationSupported()) return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'true' && Notification.permission === 'granted';
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    } else {
      localStorage.setItem(STORAGE_KEY, 'false');
      return false;
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
};

export const toggleNotifications = async (enable: boolean): Promise<boolean> => {
  if (!isNotificationSupported()) return false;

  if (enable) {
    if (Notification.permission === 'granted') {
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    const granted = await requestNotificationPermission();
    return granted;
  } else {
    localStorage.setItem(STORAGE_KEY, 'false');
    return false;
  }
};

export const sendLiveShowNotification = (title: string, host: string, extra?: string): boolean => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const icon = '/assets/aistudio/logo_rock___metal_701d5405.jpeg';
    const body = extra
      ? `🔴 ¡EN VIVO AHORA! ${host ? `Con ${host}. ` : ''}${extra}`
      : `🔴 ¡Ha comenzado "${title}" en vivo por Rock & Metal Radio! Sintoniza ya.`;

    const notification = new Notification(`🤘 ROCK & METAL: ${title}`, {
      body,
      icon,
      badge: icon,
      tag: 'rock-metal-live-show',
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    localStorage.setItem(LAST_NOTIFIED_SHOW_KEY, title);
    return true;
  } catch (err) {
    console.warn('Could not trigger notification:', err);
    return false;
  }
};

export const testLiveNotification = (): boolean => {
  return sendLiveShowNotification(
    'El Santuario del Rock',
    'Cesar Metalhead',
    'Himnos legendarios del rock y metal en directo sin interrupciones.'
  );
};
