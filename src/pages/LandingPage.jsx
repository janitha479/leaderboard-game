import { Link } from 'react-router-dom';
import { LOCATIONS, LOCATION_CONFIG } from '../constants';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
          🎮 Game Scoreboard
        </h1>
        <p className="text-gray-400 text-lg">Select your location to get started</p>
      </div>

      {/* Location cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {LOCATIONS.map((loc) => {
          const cfg = LOCATION_CONFIG[loc];
          return (
            <Link
              key={loc}
              to={`/location/${loc}`}
              className="group relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all duration-200 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: cfg.accent }}
              />
              <div className="relative">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                  style={{ backgroundColor: cfg.accent + '20', color: cfg.accent }}
                >
                  <FiMapPin className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{cfg.name}</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Manage players and view scores for {cfg.name}
                </p>
                <div
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: cfg.accent }}
                >
                  Enter <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-600 text-sm">
        Each location operates independently with its own player data.
      </p>
    </div>
  );
}
