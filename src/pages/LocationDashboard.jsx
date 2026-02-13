import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LOCATION_CONFIG, MAX_PLAYERS } from '../constants';
import { useGame } from '../context/GameContext';
import { format } from 'date-fns';
import { FiSettings, FiMonitor, FiArrowLeft, FiUsers, FiCopy } from 'react-icons/fi';

export default function LocationDashboard() {
  const { locationId } = useParams();
  const { setLocation, counter } = useGame();
  const cfg = LOCATION_CONFIG[locationId];

  useEffect(() => {
    if (locationId) setLocation(locationId);
  }, [locationId, setLocation]);

  if (!cfg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Invalid Location</h1>
          <Link to="/" className="text-blue-400 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const adminUrl = `/location/${locationId}/admin`;
  const scoreboardUrl = `/location/${locationId}/scoreboard`;

  const copyLink = (path) => {
    const url = window.location.origin + path;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
      {/* Back link */}
      <div className="w-full max-w-2xl mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <FiArrowLeft /> All Locations
        </Link>
      </div>

      {/* Header card */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{cfg.name}</h1>
            <p className="text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: cfg.accent + '20', color: cfg.accent }}
          >
            <FiUsers />
            {counter} / {MAX_PLAYERS} players
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Admin Panel */}
          <div className="bg-gray-750 rounded-xl border border-gray-700 p-5 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
                <FiSettings className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Admin Panel</h3>
                <p className="text-xs text-gray-400">For the tablet</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Register players, enter scores, generate reports.
            </p>
            <div className="flex items-center gap-2">
              <Link
                to={adminUrl}
                target="_blank"
                className="flex-1 text-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Open Admin Panel
              </Link>
              <button
                onClick={() => copyLink(adminUrl)}
                className="p-2.5 text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition-colors"
                title="Copy link"
              >
                <FiCopy />
              </button>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="bg-gray-750 rounded-xl border border-gray-700 p-5 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FiMonitor className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Scoreboard</h3>
                <p className="text-xs text-gray-400">For the display</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Live leaderboard — auto-updates in real time.
            </p>
            <div className="flex items-center gap-2">
              <Link
                to={scoreboardUrl}
                target="_blank"
                className="flex-1 text-center px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                Open Scoreboard
              </Link>
              <button
                onClick={() => copyLink(scoreboardUrl)}
                className="p-2.5 text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition-colors"
                title="Copy link"
              >
                <FiCopy />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-xs text-center max-w-md">
        Open the Admin Panel on the operator tablet and the Scoreboard on the public display.
        Both will stay in sync automatically.
      </p>
    </div>
  );
}
