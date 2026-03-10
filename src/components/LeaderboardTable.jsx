import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import { WINNER_POSITIONS, GLOBAL_TEXT_STYLES, USE_ABSOLUTE_POSITIONING } from '../utils/winnerPositions';

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export default function LeaderboardTable({ users }) {
  const { updatePlayerLayout } = useGame();
  const [dragging, setDragging] = useState(null);

  const ranked = useMemo(() => {
    const scored = users.filter((u) => u.score != null);
    scored.sort((a, b) => b.score - a.score);
    // Only show top 5 players
    return scored.slice(0, 5);
  }, [users]);

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (event) => {
      const dx = event.clientX - dragging.startX;
      const dy = event.clientY - dragging.startY;

      const nextX = Math.round(dragging.baseX + dx);
      const nextY = Math.round(dragging.baseY + dy);

      if (dragging.target === 'name') {
        updatePlayerLayout(dragging.playerId, { nameX: nextX, nameY: nextY });
      } else {
        updatePlayerLayout(dragging.playerId, { scoreX: nextX, scoreY: nextY });
      }
    };

    const onMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, updatePlayerLayout]);

  const startDrag = (event, player, target) => {
    event.preventDefault();

    const baseX = target === 'name'
      ? asNumber(player.layout?.nameX, 0)
      : asNumber(player.layout?.scoreX, 0);
    const baseY = target === 'name'
      ? asNumber(player.layout?.nameY, 0)
      : asNumber(player.layout?.scoreY, 0);

    setDragging({
      playerId: player.id,
      target,
      startX: event.clientX,
      startY: event.clientY,
      baseX,
      baseY,
    });
  };

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-4xl font-semibold uppercase">
        Waiting for players…
      </div>
    );
  }

  // Use absolute positioning mode if enabled
  if (USE_ABSOLUTE_POSITIONING) {
    return (
      <div className="absolute inset-0 w-full h-full">
        {ranked.map((player, index) => {
          const rank = index + 1;
          const config = WINNER_POSITIONS[rank] || {};
          
          return (
            <div key={player.id}>
              {/* Player Name */}
              <div
                className="absolute whitespace-nowrap"
                style={{
                  left: `${config.nameX || 0}px`,
                  top: `${config.nameY || 0}px`,
                  fontSize: config.fontSize || '36px',
                  color: config.color || '#FFFFFF',
                  fontFamily: GLOBAL_TEXT_STYLES.fontFamily,
                  fontWeight: GLOBAL_TEXT_STYLES.fontWeight,
                  textShadow: GLOBAL_TEXT_STYLES.textShadow,
                  textTransform: GLOBAL_TEXT_STYLES.textTransform,
                }}
              >
                {player.name}
              </div>
              
              {/* Player Score */}
              <div
                className="absolute whitespace-nowrap"
                style={{
                  left: `${config.scoreX || 0}px`,
                  top: `${config.scoreY || 0}px`,
                  fontSize: config.scoreFontSize || '48px',
                  color: config.scoreColor || '#FFC107',
                  fontFamily: GLOBAL_TEXT_STYLES.fontFamily,
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(255, 193, 7, 0.8)',
                }}
              >
                {player.score != null ? player.score.toLocaleString() : '—'}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default draggable layout mode
  return (
    <div className="w-full max-w-5xl uppercase mt-24">
      <div className="flex flex-col gap-8">
        {ranked.map((player) => (
          <div
            key={player.id}
            className="grid grid-cols-[1fr_auto] items-center rounded-xl px-5 py-3 bg-black/20 backdrop-blur-[1px]"
            style={{
              columnGap: `${asNumber(player.layout?.xSpace, 16)}px`,
              marginTop: `${asNumber(player.layout?.ySpace, 0)}px`,
              marginBottom: `${asNumber(player.layout?.ySpace, 0)}px`,
            }}
          >
            <span
              className="font-bold text-white text-4xl tracking-wide text-left select-none cursor-move pl-4"
              onMouseDown={(event) => startDrag(event, player, 'name')}
              style={{
                transform: `translate(${asNumber(player.layout?.nameX, 0)}px, ${asNumber(player.layout?.nameY, 0)}px)`,
                textShadow: '0 1px 2px rgba(0,0,0,0.45)',
              }}
            >
              {player.name}
            </span>
            <span
              className="font-extrabold text-6xl text-yellow-300 text-right select-none cursor-move"
              onMouseDown={(event) => startDrag(event, player, 'score')}
              style={{
                transform: `translate(${asNumber(player.layout?.scoreX, 0)}px, ${asNumber(player.layout?.scoreY, 0)}px)`,
                textShadow: '0 0 6px rgba(255, 215, 0, 0.9), 0 0 14px rgba(255, 193, 7, 0.7), 0 0 24px rgba(245, 158, 11, 0.55)',
              }}
            >
              {player.score != null ? player.score.toLocaleString() : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
