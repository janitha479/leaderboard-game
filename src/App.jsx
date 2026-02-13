import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import LandingPage from './pages/LandingPage';
import LocationDashboard from './pages/LocationDashboard';
import AdminPanel from './pages/AdminPanel';
import Scoreboard from './pages/Scoreboard';

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/location/:locationId" element={<LocationDashboard />} />
          <Route path="/location/:locationId/admin" element={<AdminPanel />} />
          <Route path="/location/:locationId/scoreboard" element={<Scoreboard />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}
