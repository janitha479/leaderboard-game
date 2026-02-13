import { supabase } from '../lib/supabase';

/**
 * Fetch today's players for a location, sorted by player_number.
 */
export async function fetchPlayers(locationId) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('location_id', locationId)
    .eq('game_date', today)
    .is('deleted_at', null)
    .order('player_number', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapRow);
}

/**
 * Get the current player count for a location today.
 */
export async function fetchPlayerCount(locationId) {
  const today = new Date().toISOString().split('T')[0];

  const { count, error } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('location_id', locationId)
    .eq('game_date', today)
    .is('deleted_at', null);

  if (error) throw error;
  return count || 0;
}

/**
 * Insert a new player.
 * Auto-assigns player_number based on current active count.
 */
export async function insertPlayer(locationId, playerData) {
  const today = new Date().toISOString().split('T')[0];

  // Get current active count to determine next player number
  const count = await fetchPlayerCount(locationId);
  const playerNumber = count + 1;

  const { data, error } = await supabase
    .from('players')
    .insert({
      location_id: locationId,
      player_number: playerNumber,
      name: playerData.name,
      contact: playerData.contact,
      age: playerData.age,
      score: null,
      game_date: today,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

/**
 * Update a player's score.
 */
export async function updatePlayerScore(locationId, playerId, score) {
  const { data, error } = await supabase
    .from('players')
    .update({
      score,
      score_updated_at: new Date().toISOString(),
    })
    .eq('id', playerId)
    .eq('location_id', locationId)
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

/**
 * Soft-delete all of today's active players for a location.
 * Sets deleted_at timestamp instead of removing rows.
 */
export async function resetPlayers(locationId) {
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('players')
    .update({ deleted_at: new Date().toISOString() })
    .eq('location_id', locationId)
    .eq('game_date', today)
    .is('deleted_at', null);

  if (error) throw error;
}

/**
 * Subscribe to realtime changes for a location's players today.
 * Returns the channel (call .unsubscribe() to clean up).
 */
export function subscribeToPlayers(locationId, onChange) {
  const today = new Date().toISOString().split('T')[0];

  const channel = supabase
    .channel(`players-${locationId}-${today}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `location_id=eq.${locationId}`,
      },
      () => {
        // On any change, re-fetch the full list for consistency
        onChange();
      }
    )
    .subscribe();

  return channel;
}

// ── Map Supabase row → app player object ──

function mapRow(row) {
  return {
    id: row.id,
    playerNumber: row.player_number,
    name: row.name,
    contact: row.contact,
    age: row.age,
    score: row.score,
    timestamp: row.created_at,
    scoreTimestamp: row.score_updated_at,
    gameDate: row.game_date,
  };
}
