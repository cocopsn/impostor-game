'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import VoteCard from '@/components/ui/VoteCard';
import { GameState, GameActions } from '@/types/game';

interface VotingScreenProps {
  state: GameState;
  actions: GameActions;
}

export default function VotingScreen({ state, actions }: VotingScreenProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [hasSelected, setHasSelected] = useState(false);

  const alivePlayers = state.config.players.filter(p => p.isAlive);
  const currentVoter = alivePlayers[state.currentPlayerIndex];
  const otherPlayers = alivePlayers.filter(p => p.id !== currentVoter?.id);
  const progress = ((state.currentPlayerIndex + (state.votingStep === 'voting' ? 0.5 : 0)) / alivePlayers.length) * 100;

  if (!currentVoter) return null;

  const handleConfirmVote = () => {
    actions.castVote(selectedTarget);
    setSelectedTarget(null);
    setHasSelected(false);
  };

  const handleSelectTarget = (targetId: string | null) => {
    setSelectedTarget(targetId);
    setHasSelected(true);
  };

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
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          {state.votingStep === 'passing' ? (
            <motion.div
              key={`vote-passing-${currentVoter.id}`}
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

              <p className="text-zinc-500 text-sm mb-2">Es turno de votar de</p>
              <h2 className="font-display text-5xl text-zinc-100 mb-2">
                {currentVoter.name.toUpperCase()}
              </h2>
              <p className="text-zinc-600 text-sm mb-8">
                Voto {state.currentPlayerIndex + 1} de {alivePlayers.length}
              </p>

              <Button onClick={actions.voterReady} fullWidth size="lg">
                Estoy listo
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`vote-choosing-${currentVoter.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <p className="text-zinc-500 text-sm">
                  <span className="text-zinc-300 font-semibold">{currentVoter.name}</span>, ¿a quién eliminas?
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {otherPlayers.map(p => (
                  <VoteCard
                    key={p.id}
                    name={p.name}
                    selected={selectedTarget === p.id}
                    onSelect={() => handleSelectTarget(p.id)}
                  />
                ))}
                <VoteCard
                  name="No votar"
                  selected={selectedTarget === null && hasSelected}
                  onSelect={() => handleSelectTarget(null)}
                  isSkip
                />
              </div>

              <Button
                onClick={handleConfirmVote}
                disabled={!hasSelected}
                fullWidth
                size="lg"
                icon={<Check size={20} />}
              >
                Confirmar voto
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
