// Location IDs
export const LOCATIONS = ['A', 'B', 'C'];

// Max players per location per day
export const MAX_PLAYERS = 50;

// LocalStorage key prefixes
export const STORAGE_KEYS = {
  users: (loc) => `location-${loc}-users`,
  date: (loc) => `location-${loc}-date`,
  counter: (loc) => `location-${loc}-counter`,
};

// Location display config
export const LOCATION_CONFIG = {
  A: { name: 'Location A', color: 'blue', accent: '#3b82f6', bg: '#eff6ff' },
  B: { name: 'Location B', color: 'emerald', accent: '#10b981', bg: '#ecfdf5' },
  C: { name: 'Location C', color: 'violet', accent: '#8b5cf6', bg: '#f5f3ff' },
};
