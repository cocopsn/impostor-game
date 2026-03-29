'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Vote, AlertTriangle, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import TimerDisplay from '@/components/ui/Timer';
import Modal from '@/components/ui/Modal';
import { GameState, GameActions } from '@/types/game';
import { useTimer } from '@/hooks/useTimer';

interface GameRoundScreenProps {
  state: GameState;
  actions: GameActions;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function GameRoundScreen({ state, actions }: GameRoundScreenProps) {
  const [timerExpired, setTimerExpired] = useState(false);
  const [showVoteConfirm, setShowVoteConfirm] = useState(false);

  const timer = useTimer({
    duration: state.config.timerDuration,
    onExpire: () => setTimerExpired(true),
    autoStart: state.config.timerEnabled,
  });

  const alivePlayers = state.config.players.filter(p => p.isAlive);
  const deadPlayers = state.config.players.filter(p => !p.isAlive);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="min-h-dvh px-4 py-6 pb-32 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-display text-4xl text-zinc-100">
          RONDA {state.currentRound}
        </h2>
        <p className="text-zinc-600 text-sm mt-1">
          {alivePlayers.length} jugadores vivos
          {state.config.impostorCount > 0 && ` · ${state.config.impostorCount} impostor${state.config.impostorCount > 1 ? 'es' : ''}`}
        </p>
      </div>

      {/* Timer */}
      {state.config.timerEnabled && (
        <div className="flex justify-center mb-6">
          <TimerDisplay
            timeLeft={timer.timeLeft}
            progress={timer.progress}
            isRunning={timer.isRunning}
          />
        </div>
      )}

      {timerExpired && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 rounded-xl p-3 mb-6"
        >
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">¡Se acabó el tiempo de discusión!</p>
        </motion.div>
      )}

      {/* Discussion prompt */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 mb-6 text-center"
      >
        <MessageCircle size={24} className="text-red-500 mx-auto mb-2" />
        <p className="text-zinc-300 text-sm font-medium">
          Discutan entre ustedes.
        </p>
        <p className="text-zinc-500 text-xs mt-1">
          ¿Quién es el impostor?
        </p>
      </motion.div>

      {/* Alive players */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-zinc-500" />
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Jugadores en juego
          </h3>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {alivePlayers.map(p => (
            <motion.div
              key={p.id}
              variants={itemVariants}
              className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Users size={14} />
              </div>
              <span className="text-sm font-medium text-zinc-200">{p.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dead players */}
      {deadPlayers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
            Eliminados
          </h3>
          <div className="space-y-1">
            {deadPlayers.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-4 py-2 text-zinc-600 text-sm line-through"
              >
                <span>{p.name}</span>
                <span className="text-xs">(Ronda {p.eliminatedInRound})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vote button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => setShowVoteConfirm(true)}
            fullWidth
            size="lg"
            icon={<Vote size={20} />}
          >
            Ir a Votación
          </Button>
        </div>
      </div>

      <Modal
        open={showVoteConfirm}
        onClose={() => setShowVoteConfirm(false)}
        onConfirm={() => {
          setShowVoteConfirm(false);
          actions.goToVoting();
        }}
        title="¿Ir a votación?"
        description="Todos los jugadores vivos votarán a quién quieren eliminar."
        confirmText="Votar"
      />
    </motion.div>
  );
}
