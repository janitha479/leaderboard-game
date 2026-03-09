import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  getUsers,
  setUsers,
  getCounter,
  setCounter,
  checkAndResetIfNewDay,
  clearLocation,
} from '../utils/storage';
import { MAX_PLAYERS } from '../constants';

// ── Context ──

const GameContext = createContext(null);

// ── Reducer ──

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOCATION': {
      const { locationId } = action;
      checkAndResetIfNewDay(locationId);
      const users = getUsers(locationId);
      const counter = getCounter(locationId);
      return { ...state, locationId, users, counter };
    }

    case 'ADD_PLAYER': {
      const { player } = action;
      const updated = [...state.users, player];
      const newCount = state.counter + 1;
      setUsers(state.locationId, updated);
      setCounter(state.locationId, newCount);
      return { ...state, users: updated, counter: newCount };
    }

    case 'UPDATE_SCORE': {
      const { playerId, score } = action;
      const updated = state.users.map((u) =>
        u.id === playerId
          ? { ...u, score, scoreTimestamp: new Date().toISOString() }
          : u
      );
      setUsers(state.locationId, updated);
      return { ...state, users: updated };
    }

    case 'UPDATE_PLAYER_LAYOUT': {
      const { playerId, layout } = action;
      const updated = state.users.map((u) =>
        u.id === playerId
          ? { ...u, layout: { ...(u.layout || {}), ...layout } }
          : u
      );
      setUsers(state.locationId, updated);
      return { ...state, users: updated };
    }

    case 'RESET': {
      clearLocation(state.locationId);
      return { ...state, users: [], counter: 0 };
    }

    case 'SYNC_FROM_STORAGE': {
      return { ...state, users: action.users, counter: action.users.length };
    }

    default:
      return state;
  }
}

// ── Provider ──

const initialState = {
  locationId: null,
  users: [],
  counter: 0,
};

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setLocation = useCallback(
    (locationId) => dispatch({ type: 'SET_LOCATION', locationId }),
    []
  );

  const addPlayer = useCallback(
    (player) => {
      if (state.counter >= MAX_PLAYERS) {
        return { success: false, error: `Maximum ${MAX_PLAYERS} players reached for today.` };
      }
      dispatch({ type: 'ADD_PLAYER', player });
      return { success: true, error: null };
    },
    [state.counter]
  );

  const updateScore = useCallback(
    (playerId, score) => dispatch({ type: 'UPDATE_SCORE', playerId, score }),
    []
  );

  const updatePlayerLayout = useCallback(
    (playerId, layout) => dispatch({ type: 'UPDATE_PLAYER_LAYOUT', playerId, layout }),
    []
  );

  const resetLocation = useCallback(
    () => dispatch({ type: 'RESET' }),
    []
  );

  const syncFromStorage = useCallback(
    (users) => dispatch({ type: 'SYNC_FROM_STORAGE', users }),
    []
  );

  const value = {
    ...state,
    setLocation,
    addPlayer,
    updateScore,
    updatePlayerLayout,
    resetLocation,
    syncFromStorage,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
