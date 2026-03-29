'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserX, Ban, Check, Skull } from 'lucide-react';
import Button from '@/components/ui/Button';
import { GameState, GameActions } from '@/types/game';

interface ManualVoteScreenProps {
  state: GameState;
  actions: GameActions;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ManualVoteScreen({ state, actions }: ManualVoteScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isNobody, setIsNobody] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const alivePlayers = state.config.players.filter(p => p.isAlive);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsNobody(false);
  };

  const handleNobody = () => {
    setSelectedId(null);
    setIsNobody(true);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      actions.manualEliminate(isNobody ? null : selectedId);
    }, 300);
  };

  const hasSelection = selectedId !== null || isNobody;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-red-950/50 border border-red-800/40 flex items-center justify-center mx-auto mb-4">
            <Skull size={28} className="text-red-400" />
          </div>
          <h2 className="font-display text-4xl text-zinc-100 mb-1">
            ELIMINACIÓN
          </h2>
          <p className="text-zinc-500 text-sm">
            ¿A quién eliminó el grupo?
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-2 mb-4"
        >
          {alivePlayers.map(p => (
            <motion.button
              key={p.id}
              variants={itemVariants}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(p.id)}
              className={`
                flex items-center gap-3 w-full p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none
                ${selectedId === p.id
                  ? 'bg-red-950/50 border-red-600 ring-2 ring-red-600 shadow-lg shadow-red-900/20'
                  : 'bg-zinc-900/60 border-zinc-700/50 hover:border-zinc-600'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                ${selectedId === p.id ? 'bg-red-900 text-red-300' : 'bg-zinc-800 text-zinc-500'}
              `}>
                <UserX size={18} />
              </div>
              <span className={`text-base font-medium flex-1 text-left ${selectedId === p.id ? 'text-zinc-100' : 'text-zinc-400'}`}>
                {p.name}
              </span>
              {selectedId === p.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center"
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Nobody option */}
        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.97 }}
          onClick={handleNobody}
          className={`
            flex items-center gap-3 w-full p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none mb-8
            ${isNobody
              ? 'bg-zinc-800 border-zinc-500 ring-2 ring-zinc-500'
              : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-600'
            }
          `}
        >
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
            ${isNobody ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-800/50 text-zinc-600'}
          `}>
            <Ban size={18} />
          </div>
          <span className={`text-base font-medium ${isNobody ? 'text-zinc-200' : 'text-zinc-600'}`}>
            Nadie (empate)
          </span>
          {isNobody && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-zinc-500 flex items-center justify-center ml-auto"
            >
              <Check size={14} className="text-white" />
            </motion.div>
          )}
        </motion.button>

        <Button
          onClick={handleConfirm}
          disabled={!hasSelection || confirmed}
          fullWidth
          size="lg"
          icon={<Check size={20} />}
        >
          Confirmar
        </Button>
      </div>
    </motion.div>
  );
}
