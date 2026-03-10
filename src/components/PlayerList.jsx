import ScoreInput from './ScoreInput';
import { format } from 'date-fns';
import { useGame } from '../context/GameContext';

export default function PlayerList() {
  const { users } = useGame();

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        No players registered yet. Use the form above to add the first player.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Registered Players</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium">{player.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{player.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{player.contact}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{player.age}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {player.timestamp ? format(new Date(player.timestamp), 'h:mm a') : '—'}
                </td>
                <td className="px-4 py-3">
                  {player.score != null ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-green-100 text-green-800">
                        {player.score}
                      </span>
                      <ScoreInput player={player} />
                    </div>
                  ) : (
                    <ScoreInput player={player} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
