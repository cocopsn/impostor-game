'use client';

import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  progress: number;
  isRunning: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TimerDisplay({ timeLeft, progress, isRunning }: TimerProps) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const isLow = timeLeft <= 10 && timeLeft > 0;
  const isExpired = timeLeft === 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-zinc-800"
          />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={isExpired ? 'text-zinc-600' : isLow ? 'text-red-500' : 'text-red-600'}
            animate={isLow && isRunning ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
            transition={isLow ? { duration: 0.8, repeat: Infinity } : undefined}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`
            font-display text-2xl font-bold
            ${isExpired ? 'text-zinc-500' : isLow ? 'text-red-400' : 'text-zinc-100'}
          `}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      {isExpired && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 font-medium"
        >
          Tiempo agotado
        </motion.span>
      )}
    </div>
  );
}
