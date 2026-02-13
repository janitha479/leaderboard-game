import { useMemo } from 'react';

export default function LeaderboardTable({ users }) {
  const ranked = useMemo(() => {
    const scored = users.filter((u) => u.score != null);
    const unscored = users.filter((u) => u.score == null);
    scored.sort((a, b) => b.score - a.score);
    return [...scored, ...unscored];
  }, [users]);

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-2xl">
        Waiting for players…
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-gray-700">
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Rank</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Player</th>
            <th className="px-6 py-4 text-right text-sm font-bold text-gray-300 uppercase tracking-wider">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {ranked.map((player, idx) => {
            const hasScore = player.score != null;
            const rank = hasScore ? idx + 1 : '—';
            const isTop3 = hasScore && idx < 3;

            return (
              <tr
                key={player.id}
                className={`transition-colors ${
                  isTop3 ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'
                }`}
              >
                <td className="px-6 py-4">
                  {isTop3 ? (
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        idx === 0
                          ? 'bg-yellow-500 text-yellow-950'
                          : idx === 1
                          ? 'bg-gray-300 text-gray-900'
                          : 'bg-amber-700 text-amber-100'
                      }`}
                    >
                      {rank}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium text-lg">{rank}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${isTop3 ? 'text-white text-lg' : 'text-gray-200'}`}>
                    {player.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {hasScore ? (
                    <span className={`font-bold ${isTop3 ? 'text-2xl text-white' : 'text-xl text-gray-200'}`}>
                      {player.score.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Pending</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
