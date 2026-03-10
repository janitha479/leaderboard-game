import { supabase } from './supabase';

// ── Helpers ──

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function rowToPlayer(row) {
  return {
    id: row.player_number,
    name: row.name,
    contact: row.contact,
    age: row.age,
    score: row.score,
    layout: row.layout || {},
    timestamp: row.created_at,
    scoreTimestamp: row.score_timestamp,
  };
}

export async function getUsers(locationId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('location_id', locationId)
    .eq('game_date', today())
    .order('player_number', { ascending: true });

  if (error) {
    console.error('getUsers error:', error);
    return [];
  }
  return (data || []).map(rowToPlayer);
}

export async function getCounter(locationId) {
  const { count, error } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('location_id', locationId)
    .eq('game_date', today());

  if (error) {
    console.error('getCounter error:', error);
    return 0;
  }
  return count || 0;
}

export async function addUser(locationId, player) {
  const { error } = await supabase.from('players').insert({
    location_id: locationId,
    player_number: player.id,
    name: player.name,
    contact: player.contact,
    age: player.age,
    score: player.score,
    layout: player.layout,
    score_timestamp: player.scoreTimestamp,
    game_date: today(),
  });

  if (error) {
    console.error('addUser error:', error);
    return false;
  }
  return true;
}

export async function updateUserScore(locationId, playerId, score) {
  const { error } = await supabase
    .from('players')
    .update({ score, score_timestamp: new Date().toISOString() })
    .eq('location_id', locationId)
    .eq('player_number', playerId)
    .eq('game_date', today());

  if (error) console.error('updateUserScore error:', error);
}

export async function updateUserLayout(locationId, playerId, layout) {
  const { data } = await supabase
    .from('players')
    .select('layout')
    .eq('location_id', locationId)
    .eq('player_number', playerId)
    .eq('game_date', today())
    .single();

  const merged = { ...(data?.layout || {}), ...layout };

  const { error } = await supabase
    .from('players')
    .update({ layout: merged })
    .eq('location_id', locationId)
    .eq('player_number', playerId)
    .eq('game_date', today());

  if (error) console.error('updateUserLayout error:', error);
}

// ── Full Reset ──

export async function clearLocation(locationId) {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('location_id', locationId)
    .eq('game_date', today());

  if (error) console.error('clearLocation error:', error);
}

// Daily reset is automatic — queries filter by today's date,
// so a new day returns an empty result set.
