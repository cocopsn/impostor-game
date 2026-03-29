'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Eye, Users, Vote, Trophy } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HomeScreenProps {
  onStart: () => void;
}

const instructions = [
  { icon: <Users size={18} />, title: 'Configura la partida', desc: 'Agrega jugadores, elige categorías y el número de impostores.' },
  { icon: <Eye size={18} />, title: 'Descubre tu rol', desc: 'Cada jugador ve su palabra en secreto. Los impostores no conocen la palabra.' },
  { icon: <Users size={18} />, title: 'Discutan', desc: 'Hablen sobre la palabra sin decirla directamente. El impostor debe fingir que la conoce.' },
  { icon: <Vote size={18} />, title: 'Voten', desc: 'Voten para eliminar a quien crean que es el impostor.' },
  { icon: <Trophy size={18} />, title: 'Gana', desc: 'Inocentes ganan si eliminan a todos los impostores. Impostores ganan si sobreviven.' },
];

export default function HomeScreen({ onStart }: HomeScreenProps) {
  const [showRules, setShowRules] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex flex-col items-center justify-center min-h-dvh px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-4"
        >
          🎭
        </motion.div>
        <h1 className="font-display text-7xl sm:text-8xl tracking-tight text-zinc-100 leading-none">
          IMPOSTOR
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-500 text-lg mt-3 font-body"
        >
          El juego de la palabra secreta
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs"
      >
        <Button onClick={onStart} fullWidth size="lg" icon={<Play size={20} />}>
          Nueva Partida
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm mt-10"
      >
        <button
          onClick={() => setShowRules(!showRules)}
          className="flex items-center justify-center gap-2 w-full text-zinc-500 hover:text-zinc-300 transition-colors py-2"
        >
          <span className="text-sm font-medium">Cómo jugar</span>
          <motion.span animate={{ rotate: showRules ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-3">
                {instructions.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-red-500">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{step.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
