// Location IDs
export const LOCATIONS = ['A'];

// Max players per location per day
export const MAX_PLAYERS = 450;

// LocalStorage key prefixes
export const STORAGE_KEYS = {
  users: (loc) => `location-${loc}-users`,
  date: (loc) => `location-${loc}-date`,
  counter: (loc) => `location-${loc}-counter`,
};

// Location display config
export const LOCATION_CONFIG = {
  A: { name: 'Location A', color: 'blue', accent: '#3b82f6', bg: '#eff6ff' },
};
