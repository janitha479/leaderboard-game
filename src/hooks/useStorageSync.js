import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { supabase } from '../utils/supabase';
import { getUsers } from '../utils/storage';

/**
 * Subscribes to Supabase Realtime changes for the given location
 * and syncs the latest player data into GameContext.
 */
export function useStorageSync(locationId) {
  const { syncFromStorage } = useGame();

  useEffect(() => {
    if (!locationId) return;

    // Initial fetch
    getUsers(locationId).then(syncFromStorage);

    // Subscribe to realtime changes on the players table
    const channel = supabase
      .channel(`players-${locationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `location_id=eq.${locationId}`,
        },
        () => {
          // Re-fetch all users on any change (INSERT, UPDATE, DELETE)
          getUsers(locationId).then(syncFromStorage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [locationId, syncFromStorage]);
}
