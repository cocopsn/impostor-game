'use client';

import { motion } from 'framer-motion';
import { Trash2, Skull, User, X as XIcon } from 'lucide-react';

interface PlayerBadgeProps {
  name: string;
  onRemove?: () => void;
  isAlive?: boolean;
  role?: 'innocent' | 'impostor' | null;
  showRole?: boolean;
  eliminatedInRound?: number | null;
  compact?: boolean;
}

export default function PlayerBadge({
  name,
  onRemove,
  isAlive = true,
  role,
  showRole = false,
  eliminatedInRound,
  compact = false,
}: PlayerBadgeProps) {
  const isImpostor = showRole && role === 'impostor';
  const isInnocent = showRole && role === 'innocent';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isAlive ? 1 : 0.4, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`
        flex items-center gap-3 rounded-xl border px-4
        ${compact ? 'py-2' : 'py-3'}
        ${isImpostor
          ? 'bg-red-950/60 border-red-800/60'
          : isInnocent
            ? 'bg-amber-950/30 border-amber-800/40'
            : 'bg-zinc-900/80 border-zinc-700/50'
        }
        ${!isAlive ? 'line-through decoration-zinc-500' : ''}
      `}
    >
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-full shrink-0
        ${isImpostor ? 'bg-red-900/80 text-red-400' : isInnocent ? 'bg-amber-900/60 text-amber-400' : 'bg-zinc-800 text-zinc-400'}
      `}>
        {isImpostor ? <Skull size={16} /> : <User size={16} />}
      </div>

      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium truncate block ${!isAlive ? 'text-zinc-500' : 'text-zinc-100'}`}>
          {name}
        </span>
        {showRole && (
          <span className={`text-xs ${isImpostor ? 'text-red-400' : 'text-amber-400'}`}>
            {isImpostor ? 'Impostor' : 'Inocente'}
          </span>
        )}
        {!isAlive && eliminatedInRound && (
          <span className="text-xs text-zinc-600"> - Ronda {eliminatedInRound}</span>
        )}
      </div>

      {onRemove && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onRemove}
          className="shrink-0 p-1.5 rounded-lg hover:bg-red-900/40 text-zinc-500 hover:text-red-400 transition-colors"
          aria-label={`Eliminar a ${name}`}
        >
          <Trash2 size={16} />
        </motion.button>
      )}

      {!isAlive && !onRemove && (
        <XIcon size={16} className="text-zinc-600 shrink-0" />
      )}
    </motion.div>
  );
}
