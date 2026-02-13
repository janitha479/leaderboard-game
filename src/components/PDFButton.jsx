import { useGame } from '../context/GameContext';
import { generateReport } from '../utils/pdfGenerator';
import { FiDownload } from 'react-icons/fi';

export default function PDFButton() {
  const { users, locationId } = useGame();

  const handleClick = () => {
    generateReport(users, locationId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={users.length === 0}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      <FiDownload className="text-lg" />
      Generate PDF Report
    </button>
  );
}
