import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LOCATION_CONFIG, MAX_PLAYERS } from '../constants';
import { useGame } from '../context/GameContext';
import { useStorageSync } from '../hooks/useStorageSync';
import PlayerForm from '../components/PlayerForm';
import PlayerList from '../components/PlayerList';
import PDFButton from '../components/PDFButton';
import { format } from 'date-fns';
import { FiArrowLeft, FiRefreshCw, FiUsers } from 'react-icons/fi';

export default function AdminPanel() {
  const { locationId } = useParams();
  const { setLocation, counter, users, resetLocation } = useGame();
  const cfg = LOCATION_CONFIG[locationId];
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (locationId) setLocation(locationId);
  }, [locationId, setLocation]);

  useStorageSync(locationId);

  useEffect(() => {
    document.title = `Admin — ${cfg?.name || 'Unknown'} | Game Scoreboard`;
  }, [cfg]);

  if (!cfg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Location</h1>
          <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    resetLocation();
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/location/${locationId}`}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Admin Panel —{' '}
                <span style={{ color: cfg.accent }}>{cfg.name}</span>
              </h1>
              <p className="text-xs text-gray-500">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: cfg.accent + '15', color: cfg.accent }}
            >
              <FiUsers className="text-base" />
              {counter} / {MAX_PLAYERS}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <PlayerForm />
        <PlayerList />

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <PDFButton />

          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
          >
            <FiRefreshCw />
            Reset for Tomorrow
          </button>
        </div>

        {/* Confirmation dialog */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reset All Data?</h3>
              <p className="text-gray-600 text-sm mb-6">
                This will permanently delete all {users.length} player(s) for {cfg.name} today.
                Make sure you've downloaded the PDF report first.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
