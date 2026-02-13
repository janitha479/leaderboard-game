import { useState } from 'react';
import { validateScore } from '../utils/validation';
import { useGame } from '../context/GameContext';
import { FiCheck } from 'react-icons/fi';

export default function ScoreInput({ player }) {
  const { updateScore } = useGame();
  const [value, setValue] = useState(player.score != null ? String(player.score) : '');
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const result = validateScore(value);
    if (!result.valid) {
      setError(result.error);
      return;
    }

    setSaving(true);
    const saveResult = await updateScore(player.id, Number(value));
    setSaving(false);

    if (saveResult.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(saveResult.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        max="99999"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(null);
          setSaved(false);
        }}
        placeholder="Score"
        className={`w-24 px-2 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      <button
        type="submit"
        disabled={saving}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          saved
            ? 'bg-green-500 text-white'
            : saving
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {saving ? '…' : saved ? <FiCheck className="inline" /> : 'Save'}
      </button>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </form>
  );
}
