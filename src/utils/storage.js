import { STORAGE_KEYS } from '../constants';

// ── Helpers ──

export function getUsers(locationId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.users(locationId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setUsers(locationId, users) {
  localStorage.setItem(STORAGE_KEYS.users(locationId), JSON.stringify(users));
}

export function getCounter(locationId) {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEYS.counter(locationId)) || '0', 10);
  } catch {
    return 0;
  }
}

export function setCounter(locationId, count) {
  localStorage.setItem(STORAGE_KEYS.counter(locationId), String(count));
}

export function getStoredDate(locationId) {
  return localStorage.getItem(STORAGE_KEYS.date(locationId)) || '';
}

export function setStoredDate(locationId, dateStr) {
  localStorage.setItem(STORAGE_KEYS.date(locationId), dateStr);
}

// ── Daily Reset ──

export function checkAndResetIfNewDay(locationId) {
  const today = new Date().toDateString();
  const stored = getStoredDate(locationId);

  if (stored !== today) {
    setUsers(locationId, []);
    setCounter(locationId, 0);
    setStoredDate(locationId, today);
    return true; // was reset
  }
  return false;
}

// ── Full Reset ──

export function clearLocation(locationId) {
  setUsers(locationId, []);
  setCounter(locationId, 0);
  setStoredDate(locationId, new Date().toDateString());
}

// ── Feature check ──

export function isLocalStorageAvailable() {
  try {
    const key = '__ls_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
