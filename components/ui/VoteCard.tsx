'use client';

import { motion } from 'framer-motion';
import { User, Ban } from 'lucide-react';

interface VoteCardProps {
  name: string;
  selected: boolean;
  onSelect: () => void;
  isSkip?: boolean;
}

export default function VoteCard({ name, selected, onSelect, isSkip = false }: VoteCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-3 p-4 rounded-xl border w-full
        transition-colors duration-150 cursor-pointer select-none
        ${selected
          ? isSkip
            ? 'bg-zinc-800 border-zinc-500 ring-2 ring-zinc-500'
            : 'bg-red-950/50 border-red-600 ring-2 ring-red-600'
          : 'bg-zinc-900/60 border-zinc-700/50 hover:border-zinc-600'
        }
      `}
    >
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full shrink-0
        ${selected
          ? isSkip ? 'bg-zinc-700 text-zinc-300' : 'bg-red-900 text-red-300'
          : 'bg-zinc-800 text-zinc-500'
        }
      `}>
        {isSkip ? <Ban size={18} /> : <User size={18} />}
      </div>
      <span className={`text-base font-medium ${selected ? 'text-zinc-100' : 'text-zinc-400'}`}>
        {isSkip ? 'No votar (skip)' : name}
      </span>
    </motion.button>
  );
}
