'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import Background from '@/components/ui/Background';
import HomeScreen from '@/components/screens/HomeScreen';
import SetupScreen from '@/components/screens/SetupScreen';
import RoleRevealScreen from '@/components/screens/RoleRevealScreen';
import GameRoundScreen from '@/components/screens/GameRoundScreen';
import VotingScreen from '@/components/screens/VotingScreen';
import ManualVoteScreen from '@/components/screens/ManualVoteScreen';
import RoundResultScreen from '@/components/screens/RoundResultScreen';
import GameOverScreen from '@/components/screens/GameOverScreen';

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25 },
};

export default function Home() {
  const { state, actions } = useGameState();

  return (
    <main className="min-h-dvh">
      <Background />
      <AnimatePresence mode="wait">
        {state.phase === 'home' && (
          <motion.div key="home" {...pageTransition}>
            <HomeScreen onStart={actions.goToSetup} />
          </motion.div>
        )}

        {state.phase === 'setup' && (
          <motion.div key="setup" {...pageTransition}>
            <SetupScreen state={state} actions={actions} />
          </motion.div>
        )}

        {state.phase === 'role-reveal' && (
          <motion.div key="role-reveal" {...pageTransition}>
            <RoleRevealScreen state={state} actions={actions} />
          </motion.div>
        )}

        {state.phase === 'playing' && (
          <motion.div key="playing" {...pageTransition}>
            <GameRoundScreen state={state} actions={actions} />
          </motion.div>
        )}

        {state.phase === 'voting' && (
          <motion.div key="voting" {...pageTransition}>
            <VotingScreen state={state} actions={actions} />
          </motion.div>
        )}

        {state.phase === 'manual-vote' && (
          <motion.div key="manual-vote" {...pageTransition}>
            <ManualVoteScreen state={state} actions={actions} />
          </motion.div>
        )}

        {state.phase === 'round-result' && (
          <motion.div key="round-result" {...pageTransition}>
            <RoundResultScreen state={state} actions={actions} />
          </motion.div>
        )}

        {state.phase === 'game-over' && (
          <motion.div key="game-over" {...pageTransition}>
            <GameOverScreen state={state} actions={actions} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
