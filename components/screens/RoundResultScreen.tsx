'use client';

import { motion } from 'framer-motion';
import { Skull, UserCheck, AlertTriangle, ArrowRight, Trophy } from 'lucide-react';
import Button from '@/components/ui/Button';
import { GameState, GameActions } from '@/types/game';

interface RoundResultScreenProps {
  state: GameState;
  actions: GameActions;
}

export default function RoundResultScreen({ state, actions }: RoundResultScreenProps) {
  const lastRound = state.rounds[state.rounds.length - 1];
  if (!lastRound) return null;

  const eliminated = lastRound.eliminatedPlayer;
  const wasImpostor = eliminated?.role === 'impostor';
  const playerMap = new Map(state.config.players.map(p => [p.id, p]));

  const voteCounts = new Map<string, number>();
  for (const vote of lastRound.votes) {
    if (vote.targetId) {
      voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) || 0) + 1);
    }
  }

  const skippedVotes = lastRound.votes.filter(v => !v.targetId).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-sm">
        {/* Elimination result */}
        {lastRound.wasTie ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center mx-auto mb-4"
            >
              <AlertTriangle size={32} className="text-amber-500" />
            </motion.div>
            <h2 className="font-display text-4xl text-zinc-100 mb-2">EMPATE</h2>
            <p className="text-zinc-500 text-sm">Nadie fue eliminado esta ronda.</p>
          </motion.div>
        ) : eliminated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`
                w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto mb-4
                ${wasImpostor
                  ? 'bg-red-950/60 border-red-700'
                  : 'bg-amber-950/40 border-amber-700'
                }
              `}
            >
              {wasImpostor
                ? <Skull size={32} className="text-red-400" />
                : <UserCheck size={32} className="text-amber-400" />
              }
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-display text-3xl text-zinc-100 mb-1">
                {eliminated.name.toUpperCase()}
              </h2>
              <p className="text-zinc-500 text-sm mb-2">ha sido eliminado</p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className={`
                  inline-block px-4 py-1.5 rounded-full text-sm font-bold
                  ${wasImpostor
                    ? 'bg-red-900/60 text-red-300 border border-red-700/50'
                    : 'bg-amber-900/40 text-amber-300 border border-amber-700/50'
                  }
                `}
              >
                {wasImpostor ? '🎭 Era IMPOSTOR' : '✨ Era INOCENTE'}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}

        {/* Vote breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 mb-8"
        >
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Desglose de votos
          </h3>
          <div className="space-y-2">
            {lastRound.votes.map((vote, i) => {
              const voter = playerMap.get(vote.voterId);
              const target = vote.targetId ? playerMap.get(vote.targetId) : null;
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{voter?.name}</span>
                  <span className="text-zinc-600 mx-2">→</span>
                  <span className={vote.targetId ? 'text-zinc-200' : 'text-zinc-600'}>
                    {target?.name || 'Skip'}
                  </span>
                </div>
              );
            })}
          </div>
          {skippedVotes > 0 && (
            <p className="text-xs text-zinc-600 mt-2">
              {skippedVotes} voto{skippedVotes > 1 ? 's' : ''} en blanco
            </p>
          )}
        </motion.div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {state.winner ? (
            <Button
              onClick={actions.showGameOver}
              fullWidth
              size="lg"
              icon={<Trophy size={20} />}
            >
              Ver resultado final
            </Button>
          ) : (
            <Button
              onClick={actions.nextRound}
              fullWidth
              size="lg"
              icon={<ArrowRight size={20} />}
            >
              Siguiente ronda
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
