import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  fetchPlayers,
  insertPlayer,
  updatePlayerScore,
  resetPlayers,
} from '../utils/supabaseStorage';
import { MAX_PLAYERS } from '../constants';

// ── Context ──

const GameContext = createContext(null);

// ── Reducer (synchronous local state only) ──

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.loading };

    case 'SET_LOCATION_DATA': {
      const { locationId, users } = action;
      return { ...state, locationId, users, counter: users.length, loading: false };
    }

    case 'SET_USERS': {
      return { ...state, users: action.users, counter: action.users.length };
    }

    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// ── Provider ──

const initialState = {
  locationId: null,
  users: [],
  counter: 0,
  loading: false,
  error: null,
};

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load location data from Supabase
  const setLocation = useCallback(async (locationId) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const users = await fetchPlayers(locationId);
      dispatch({ type: 'SET_LOCATION_DATA', locationId, users });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err.message });
    }
  }, []);

  // Add a player via Supabase
  const addPlayer = useCallback(
    async (playerData) => {
      if (state.counter >= MAX_PLAYERS) {
        return { success: false, error: `Maximum ${MAX_PLAYERS} players reached for today.` };
      }
      try {
        await insertPlayer(state.locationId, playerData);
        // Realtime subscription will update the list, but also refresh immediately
        const users = await fetchPlayers(state.locationId);
        dispatch({ type: 'SET_USERS', users });
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [state.counter, state.locationId]
  );

  // Update a player's score via Supabase
  const updateScore = useCallback(
    async (playerId, score) => {
      try {
        await updatePlayerScore(state.locationId, playerId, score);
        const users = await fetchPlayers(state.locationId);
        dispatch({ type: 'SET_USERS', users });
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [state.locationId]
  );

  // Reset location (delete today's players)
  const resetLocation = useCallback(async () => {
    try {
      await resetPlayers(state.locationId);
      dispatch({ type: 'SET_USERS', users: [] });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [state.locationId]);

  // Called by realtime subscription to refresh data
  const refreshFromSupabase = useCallback(async () => {
    if (!state.locationId) return;
    try {
      const users = await fetchPlayers(state.locationId);
      dispatch({ type: 'SET_USERS', users });
    } catch {
      // silent — will retry on next event
    }
  }, [state.locationId]);

  const value = {
    ...state,
    setLocation,
    addPlayer,
    updateScore,
    resetLocation,
    refreshFromSupabase,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
