'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Eye, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { GameState, GameActions } from '@/types/game';

interface RoleRevealScreenProps {
  state: GameState;
  actions: GameActions;
}

function DecryptText({ text, duration = 1200 }: { text: string; duration?: number }) {
  const [displayed, setDisplayed] = useState('');
  const chars = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ#$%&@!?';

  useEffect(() => {
    let frame = 0;
    const totalFrames = duration / 30;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * text.length);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealed) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayed(result);
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayed(text);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, duration]);

  return <span>{displayed}</span>;
}

export default function RoleRevealScreen({ state, actions }: RoleRevealScreenProps) {
  const currentPlayer = state.config.players[state.currentPlayerIndex];
  const isImpostor = currentPlayer?.role === 'impostor';
  const progress = ((state.currentPlayerIndex + (state.revealStep === 'showing' ? 0.5 : 0)) / state.config.players.length) * 100;

  if (!currentPlayer) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col"
    >
      {/* Progress bar */}
      <div className="h-1 bg-zinc-900">
        <motion.div
          className="h-full bg-red-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {state.revealStep === 'passing' ? (
            <motion.div
              key={`passing-${currentPlayer.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full max-w-sm"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center mx-auto mb-6"
              >
                <Shield size={32} className="text-zinc-400" />
              </motion.div>

              <p className="text-zinc-500 text-sm mb-2">Pasa el celular a</p>
              <h2 className="font-display text-5xl text-zinc-100 mb-2">
                {currentPlayer.name.toUpperCase()}
              </h2>
              <p className="text-zinc-600 text-sm mb-8">
                Jugador {state.currentPlayerIndex + 1} de {state.config.players.length}
              </p>

              <Button onClick={actions.playerReady} fullWidth size="lg" icon={<Eye size={20} />}>
                Estoy listo
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`showing-${currentPlayer.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center w-full max-w-sm"
            >
              {isImpostor ? (
                /* Impostor reveal */
                <motion.div
                  className="rounded-2xl border border-red-800/60 p-8 relative overflow-hidden"
                  animate={{
                    backgroundColor: ['rgba(127,29,29,0.3)', 'rgba(153,27,27,0.5)', 'rgba(127,29,29,0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none" />
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="text-6xl mb-4">🎭</div>
                    <h2 className="font-display text-4xl text-red-400 mb-3 text-glow-red">
                      ERES EL IMPOSTOR
                    </h2>
                    <p className="text-red-300/70 text-sm">
                      No conoces la palabra. Finge que sí.
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                /* Innocent reveal */
                <div>
                  <p className="text-zinc-500 text-sm mb-2">Tu palabra es:</p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="my-6"
                  >
                    <h2 className="font-display text-5xl sm:text-6xl text-zinc-100 text-glow-word mb-3">
                      <DecryptText text={state.secretWord.toUpperCase()} />
                    </h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-zinc-600 text-sm"
                    >
                      Categoría: {state.secretCategory}
                    </motion.p>
                  </motion.div>
                </div>
              )}

              <div className="mt-8">
                <Button
                  onClick={actions.playerSeen}
                  fullWidth
                  size="lg"
                  variant={isImpostor ? 'danger' : 'primary'}
                  icon={<ChevronRight size={20} />}
                >
                  Entendido
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
