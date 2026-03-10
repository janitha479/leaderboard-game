import { useState } from 'react';
import { useGame } from '../context/GameContext';

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export default function PlayerLayoutControls({ player }) {
  const { updatePlayerLayout } = useGame();
  const [form, setForm] = useState({
    xSpace: String(player.layout?.xSpace ?? 32),
    ySpace: String(player.layout?.ySpace ?? 0),
    nameX: String(player.layout?.nameX ?? 0),
    nameY: String(player.layout?.nameY ?? 0),
    scoreX: String(player.layout?.scoreX ?? 0),
    scoreY: String(player.layout?.scoreY ?? 0),
  });

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    updatePlayerLayout(player.id, {
      xSpace: toNumber(form.xSpace, 32),
      ySpace: toNumber(form.ySpace, 0),
      nameX: toNumber(form.nameX, 0),
      nameY: toNumber(form.nameY, 0),
      scoreX: toNumber(form.scoreX, 0),
      scoreY: toNumber(form.scoreY, 0),
    });
  };

  return (
    <div className="grid grid-cols-3 gap-1">
      <input
        type="number"
        value={form.nameX}
        onChange={(e) => onChange('nameX', e.target.value)}
        onBlur={onSave}
        placeholder="Name X"
        className="w-18 px-1 py-1 text-xs border border-gray-300 rounded"
      />
      <input
        type="number"
        value={form.nameY}
        onChange={(e) => onChange('nameY', e.target.value)}
        onBlur={onSave}
        placeholder="Name Y"
        className="w-18 px-1 py-1 text-xs border border-gray-300 rounded"
      />
      <input
        type="number"
        value={form.xSpace}
        onChange={(e) => onChange('xSpace', e.target.value)}
        onBlur={onSave}
        placeholder="X Space"
        className="w-18 px-1 py-1 text-xs border border-gray-300 rounded"
      />
      <input
        type="number"
        value={form.scoreX}
        onChange={(e) => onChange('scoreX', e.target.value)}
        onBlur={onSave}
        placeholder="Score X"
        className="w-18 px-1 py-1 text-xs border border-gray-300 rounded"
      />
      <input
        type="number"
        value={form.scoreY}
        onChange={(e) => onChange('scoreY', e.target.value)}
        onBlur={onSave}
        placeholder="Score Y"
        className="w-18 px-1 py-1 text-xs border border-gray-300 rounded"
      />
      <input
        type="number"
        value={form.ySpace}
        onChange={(e) => onChange('ySpace', e.target.value)}
        onBlur={onSave}
        placeholder="Y Space"
        className="w-18 px-1 py-1 text-xs border border-gray-300 rounded"
      />
    </div>
  );
}
