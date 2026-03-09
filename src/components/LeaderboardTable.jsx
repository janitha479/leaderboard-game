import { useMemo } from 'react';

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export default function LeaderboardTable({ users }) {
  const ranked = useMemo(() => {
    const scored = users.filter((u) => u.score != null);
    scored.sort((a, b) => b.score - a.score);
    // Only show top 5 players
    return scored.slice(0, 5);
  }, [users]);

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-2xl">
        Waiting for players…
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl ml-auto">
      <div className="flex flex-col gap-6">
        {ranked.map((player) => (
          <div
            key={player.id}
            className="grid grid-cols-[auto_auto] justify-end items-center"
            style={{
              columnGap: `${asNumber(player.layout?.xSpace, 32)}px`,
              marginTop: `${asNumber(player.layout?.ySpace, 0)}px`,
              marginBottom: `${asNumber(player.layout?.ySpace, 0)}px`,
            }}
          >
            <span
              className="font-semibold text-white text-lg text-right"
              style={{
                transform: `translate(${asNumber(player.layout?.nameX, 0)}px, ${asNumber(player.layout?.nameY, 0)}px)`,
              }}
            >
              {player.name}
            </span>
            <span
              className="font-bold text-2xl text-white text-right"
              style={{
                transform: `translate(${asNumber(player.layout?.scoreX, 0)}px, ${asNumber(player.layout?.scoreY, 0)}px)`,
              }}
            >
              {player.score != null ? player.score.toLocaleString() : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
