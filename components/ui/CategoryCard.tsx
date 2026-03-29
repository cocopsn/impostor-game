'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { CATEGORY_EMOJIS } from '@/components/WordBank';

interface CategoryCardProps {
  category: string;
  selected: boolean;
  onToggle: () => void;
  wordCount: number;
}

export default function CategoryCard({ category, selected, onToggle, wordCount }: CategoryCardProps) {
  const emoji = CATEGORY_EMOJIS[category] || '📦';

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3
        transition-colors duration-150 cursor-pointer select-none min-h-[80px]
        ${selected
          ? 'bg-red-950/40 border-red-600/60 shadow-sm shadow-red-900/20'
          : 'bg-zinc-900/60 border-zinc-700/40 hover:border-zinc-600'
        }
      `}
    >
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      )}
      <span className="text-2xl">{emoji}</span>
      <span className={`text-xs font-medium text-center leading-tight ${selected ? 'text-red-200' : 'text-zinc-400'}`}>
        {category}
      </span>
      <span className="text-[10px] text-zinc-600">{wordCount}</span>
    </motion.button>
  );
}
