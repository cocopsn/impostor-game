'use client';

import { motion } from 'framer-motion';
import { Trophy, Skull, RotateCcw, Home, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import PlayerBadge from '@/components/ui/PlayerBadge';
import Modal from '@/components/ui/Modal';
import { GameState, GameActions } from '@/types/game';
import { useState } from 'react';

interface GameOverScreenProps {
  state: GameState;
  actions: GameActions;
}

const confettiColors = ['#DC2626', '#F59E0B', '#EF4444', '#FBBF24', '#FCA5A5'];

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window?.innerHeight + 20 || 800,
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
            x: Math.random() * 200 - 100,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export default function GameOverScreen({ state, actions }: GameOverScreenProps) {
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const impostorsWon = state.winner === 'impostors';
  const impostors = state.config.players.filter(p => p.role === 'impostor');
  const innocents = state.config.players.filter(p => p.role === 'innocent');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh px-4 py-8 max-w-lg mx-auto relative"
    >
      <Confetti />

      {/* Victory announcement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          className={`
            w-24 h-24 rounded-full border-2 flex items-center justify-center mx-auto mb-4
            ${impostorsWon
              ? 'bg-red-950/60 border-red-600 shadow-lg shadow-red-900/40'
              : 'bg-amber-950/40 border-amber-600 shadow-lg shadow-amber-900/30'
            }
          `}
        >
          {impostorsWon
            ? <Skull size={40} className="text-red-400" />
            : <Trophy size={40} className="text-amber-400" />
          }
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`font-display text-5xl sm:text-6xl mb-2 ${impostorsWon ? 'text-red-400' : 'text-amber-400'}`}
        >
          {impostorsWon ? 'IMPOSTORES GANAN' : 'INOCENTES GANAN'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-zinc-500 text-sm"
        >
          {impostorsWon
            ? 'Los impostores lograron sobrevivir'
            : 'Todos los impostores fueron descubiertos'
          }
        </motion.p>
      </motion.div>

      {/* Secret word */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 mb-6 text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs uppercase tracking-wider mb-2">
          <Eye size={14} />
          <span>La palabra secreta era</span>
        </div>
        <h2 className="font-display text-4xl text-zinc-100 text-glow-word">
          {state.secretWord.toUpperCase()}
        </h2>
        <p className="text-zinc-600 text-xs mt-1">{state.secretCategory}</p>
      </motion.div>

      {/* Impostors reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mb-6 relative z-10"
      >
        <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Skull size={14} />
          {impostors.length > 1 ? 'Los impostores eran' : 'El impostor era'}
        </h3>
        <div className="space-y-2">
          {impostors.map(p => (
            <PlayerBadge
              key={p.id}
              name={p.name}
              role={p.role}
              showRole
              isAlive={p.isAlive}
              eliminatedInRound={p.eliminatedInRound}
            />
          ))}
        </div>
      </motion.div>

      {/* Full summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 mb-8 relative z-10"
      >
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Resumen de la partida
        </h3>
        <div className="space-y-2">
          {state.config.players.map(p => (
            <div
              key={p.id}
              className={`flex items-center justify-between text-sm py-1.5 border-b border-zinc-800/50 last:border-0
                ${!p.isAlive ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <span className={p.role === 'impostor' ? 'text-red-400' : 'text-zinc-200'}>
                  {p.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.role === 'impostor'
                    ? 'bg-red-900/50 text-red-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {p.role === 'impostor' ? 'Impostor' : 'Inocente'}
                </span>
              </div>
              <span className="text-xs text-zinc-600">
                {p.isAlive ? 'Sobrevivió' : `Ronda ${p.eliminatedInRound}`}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="space-y-3 relative z-10 pb-4"
      >
        <Button
          onClick={actions.playAgain}
          fullWidth
          size="lg"
          icon={<RotateCcw size={20} />}
        >
          Jugar de nuevo
        </Button>
        <Button
          onClick={() => setShowNewGameModal(true)}
          variant="secondary"
          fullWidth
          size="lg"
          icon={<Home size={20} />}
        >
          Nueva partida
        </Button>
      </motion.div>

      <Modal
        open={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onConfirm={() => {
          setShowNewGameModal(false);
          actions.newGame();
        }}
        title="¿Nueva partida?"
        description="Se perderá la configuración actual de jugadores y categorías."
        confirmText="Sí, nueva partida"
        variant="danger"
      />
    </motion.div>
  );
}
