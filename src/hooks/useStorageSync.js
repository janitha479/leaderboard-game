import { useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { useGame } from '../context/GameContext';

/**
 * Listens for cross-tab LocalStorage changes and syncs state.
 * Also polls every 2 s as a fallback (same-tab writes don't fire the event).
 */
export function useStorageSync(locationId) {
  const { syncFromStorage } = useGame();

  useEffect(() => {
    if (!locationId) return;

    const key = STORAGE_KEYS.users(locationId);

    // Cross-tab listener
    const handleStorage = (e) => {
      if (e.key === key) {
        try {
          const users = JSON.parse(e.newValue || '[]');
          syncFromStorage(users);
        } catch {
          // ignore corrupt data
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    // Polling fallback
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(key);
        const users = raw ? JSON.parse(raw) : [];
        syncFromStorage(users);
      } catch {
        // ignore
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [locationId, syncFromStorage]);
}
