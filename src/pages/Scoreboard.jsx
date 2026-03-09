import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LOCATION_CONFIG } from '../constants';
import { useGame } from '../context/GameContext';
import { useStorageSync } from '../hooks/useStorageSync';
import LeaderboardTable from '../components/LeaderboardTable';
import scoreboardBg from './scoreboard.png';

export default function Scoreboard() {
  const { locationId } = useParams();
  const { setLocation, users } = useGame();
  const cfg = LOCATION_CONFIG[locationId];

  useEffect(() => {
    if (locationId) setLocation(locationId);
  }, [locationId, setLocation]);

  useStorageSync(locationId);

  useEffect(() => {
    document.title = `Scoreboard — ${cfg?.name || 'Unknown'} | Game Scoreboard`;
  }, [cfg]);

  if (!cfg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Location</h1>
          <Link to="/" className="text-blue-400 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div
        className="relative w-full h-full text-white flex flex-col overflow-hidden"
        style={{
          backgroundImage: `url(${scoreboardBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Content wrapper */}
        <div className="relative z-10 h-full w-full flex items-center justify-center px-6 py-4">
          <div className="w-full max-w-3xl">
            <LeaderboardTable users={users} />
          </div>
        </div>
      </div>
    </div>
  );
}
