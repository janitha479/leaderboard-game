import { useEffect } from 'react';
import { subscribeToPlayers } from '../utils/supabaseStorage';
import { useGame } from '../context/GameContext';

/**
 * Subscribes to Supabase Realtime for cross-device live updates.
 * When any device inserts/updates/deletes a player for this location,
 * the callback re-fetches the full player list.
 */
export function useStorageSync(locationId) {
  const { refreshFromSupabase } = useGame();

  useEffect(() => {
    if (!locationId) return;

    // Subscribe to realtime changes
    const channel = subscribeToPlayers(locationId, refreshFromSupabase);

    return () => {
      channel.unsubscribe();
    };
  }, [locationId, refreshFromSupabase]);
}
