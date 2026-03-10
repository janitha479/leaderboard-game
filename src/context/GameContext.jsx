import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  getUsers,
  getCounter,
  addUser,
  updateUserScore,
  updateUserLayout,
  clearLocation,
} from '../utils/storage';
import { MAX_PLAYERS } from '../constants';

const GameContext = createContext(null);

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        locationId: action.locationId,
        users: action.users,
        counter: action.counter,
      };

    case 'ADD_PLAYER':
      return {
        ...state,
        users: [...state.users, action.player],
        counter: state.counter + 1,
      };

    case 'UPDATE_SCORE': {
      const updated = state.users.map((u) =>
        u.id === action.playerId
          ? { ...u, score: action.score, scoreTimestamp: new Date().toISOString() }
          : u
      );
      return { ...state, users: updated };
    }

    case 'UPDATE_PLAYER_LAYOUT': {
      const updated = state.users.map((u) =>
        u.id === action.playerId
          ? { ...u, layout: { ...(u.layout || {}), ...action.layout } }
          : u
      );
      return { ...state, users: updated };
    }

    case 'RESET':
      return { ...state, users: [], counter: 0 };

    case 'SYNC_FROM_STORAGE':
      return { ...state, users: action.users, counter: action.users.length };

    default:
      return state;
  }
}

const initialState = {
  locationId: null,
  users: [],
  counter: 0,
};

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setLocation = useCallback(async (locationId) => {
    const [users, counter] = await Promise.all([
      getUsers(locationId),
      getCounter(locationId),
    ]);
    dispatch({ type: 'SET_LOCATION', locationId, users, counter });
  }, []);

  const addPlayer = useCallback(
    async (player) => {
      if (state.counter >= MAX_PLAYERS) {
        return { success: false, error: `Maximum ${MAX_PLAYERS} players reached for today.` };
      }
      const ok = await addUser(state.locationId, player);
      if (!ok) return { success: false, error: 'Failed to save player. Please try again.' };
      dispatch({ type: 'ADD_PLAYER', player });
      return { success: true, error: null };
    },
    [state.counter, state.locationId]
  );

  const updateScore = useCallback(
    async (playerId, score) => {
      await updateUserScore(state.locationId, playerId, score);
      dispatch({ type: 'UPDATE_SCORE', playerId, score });
    },
    [state.locationId]
  );

  const updatePlayerLayout = useCallback(
    async (playerId, layout) => {
      await updateUserLayout(state.locationId, playerId, layout);
      dispatch({ type: 'UPDATE_PLAYER_LAYOUT', playerId, layout });
    },
    [state.locationId]
  );

  const resetLocation = useCallback(async () => {
    await clearLocation(state.locationId);
    dispatch({ type: 'RESET' });
  }, [state.locationId]);

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
