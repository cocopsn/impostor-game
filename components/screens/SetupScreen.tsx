'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Minus, Play, ToggleLeft, ToggleRight,
  Clock, Pencil, ArrowLeft, CheckCheck, XCircle,
  Smartphone, Hand
} from 'lucide-react';
import Button from '@/components/ui/Button';
import PlayerBadge from '@/components/ui/PlayerBadge';
import CategoryCard from '@/components/ui/CategoryCard';
import Modal from '@/components/ui/Modal';
import { GameState, GameActions } from '@/types/game';
import { WORD_BANK, ALL_CATEGORIES } from '@/components/WordBank';
import { getMaxImpostors } from '@/lib/gameLogic';

interface SetupScreenProps {
  state: GameState;
  actions: GameActions;
}

const TIMER_OPTIONS = [30, 60, 90, 120, 180];

export default function SetupScreen({ state, actions }: SetupScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [showCustomWords, setShowCustomWords] = useState(false);
  const [customWordText, setCustomWordText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { config } = state;

  const maxImpostors = getMaxImpostors(config.players.length);
  const hasEnoughPlayers = config.players.length >= 3;
  const hasCategories = config.selectedCategories.length > 0 || config.customWords.length > 0;
  const canStart = hasEnoughPlayers && hasCategories;

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (!name) return;
    actions.addPlayer(name);
    setPlayerName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  const handleCustomWordsChange = (text: string) => {
    setCustomWordText(text);
    const words = text.split(',').map(w => w.trim()).filter(Boolean);
    actions.setCustomWords(words);
  };

  const handleStartGame = () => {
    if (config.impostorCount > maxImpostors) {
      actions.setImpostorCount(Math.max(1, maxImpostors));
    }
    setShowConfirmModal(true);
  };

  const totalWords = config.selectedCategories.reduce(
    (sum, cat) => sum + (WORD_BANK[cat]?.length || 0), 0
  ) + config.customWords.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="min-h-dvh px-4 py-6 pb-32 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={actions.newGame}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-display text-3xl text-zinc-100">CONFIGURACIÓN</h2>
      </div>

      {/* Players section */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Jugadores ({config.players.length}/15)
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nombre del jugador..."
            maxLength={20}
            className="flex-1 h-12 px-4 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-100
              placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
          <Button
            onClick={handleAddPlayer}
            disabled={!playerName.trim() || config.players.length >= 15}
            icon={<Plus size={18} />}
            size="md"
          >
            Agregar
          </Button>
        </div>
        {config.players.length < 3 && config.players.length > 0 && (
          <p className="text-xs text-amber-500 mb-3">Mínimo 3 jugadores para iniciar</p>
        )}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {config.players.map(p => (
              <PlayerBadge
                key={p.id}
                name={p.name}
                onRemove={() => actions.removePlayer(p.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Impostor count */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Número de impostores
        </h3>
        <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <button
            onClick={() => actions.setImpostorCount(Math.max(1, config.impostorCount - 1))}
            disabled={config.impostorCount <= 1}
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300
              hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={18} />
          </button>
          <div className="flex-1 text-center">
            <span className="text-3xl font-display text-red-500">{config.impostorCount}</span>
            <p className="text-xs text-zinc-600 mt-1">
              Máximo: {hasEnoughPlayers ? maxImpostors : '-'}
            </p>
          </div>
          <button
            onClick={() => actions.setImpostorCount(Math.min(maxImpostors, config.impostorCount + 1))}
            disabled={!hasEnoughPlayers || config.impostorCount >= maxImpostors}
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300
              hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Categorías ({config.selectedCategories.length}/{ALL_CATEGORIES.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={actions.selectAllCategories}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <CheckCheck size={14} /> Todas
            </button>
            <button
              onClick={actions.deselectAllCategories}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <XCircle size={14} /> Ninguna
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {ALL_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat}
              category={cat}
              selected={config.selectedCategories.includes(cat)}
              onToggle={() => actions.toggleCategory(cat)}
              wordCount={WORD_BANK[cat]?.length || 0}
            />
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-2 text-center">{totalWords} palabras en el banco</p>
      </section>

      {/* Custom words */}
      <section className="mb-8">
        <button
          onClick={() => setShowCustomWords(!showCustomWords)}
          className="flex items-center gap-3 w-full text-left"
        >
          <div className="text-zinc-400">
            <Pencil size={16} />
          </div>
          <span className="flex-1 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Palabras personalizadas
          </span>
          {showCustomWords
            ? <ToggleRight size={24} className="text-red-500" />
            : <ToggleLeft size={24} className="text-zinc-600" />
          }
        </button>
        <AnimatePresence>
          {showCustomWords && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <textarea
                value={customWordText}
                onChange={e => handleCustomWordsChange(e.target.value)}
                placeholder="Escribe palabras separadas por comas: perro, gato, elefante..."
                rows={3}
                className="w-full mt-3 px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-100
                  placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600
                  transition-colors resize-none text-sm"
              />
              {config.customWords.length > 0 && (
                <p className="text-xs text-zinc-500 mt-1">
                  {config.customWords.length} palabra{config.customWords.length !== 1 ? 's' : ''} agregada{config.customWords.length !== 1 ? 's' : ''}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Timer */}
      <section className="mb-8">
        <button
          onClick={actions.toggleTimer}
          className="flex items-center gap-3 w-full text-left mb-3"
        >
          <div className="text-zinc-400">
            <Clock size={16} />
          </div>
          <span className="flex-1 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Timer de discusión
          </span>
          {config.timerEnabled
            ? <ToggleRight size={24} className="text-red-500" />
            : <ToggleLeft size={24} className="text-zinc-600" />
          }
        </button>
        <AnimatePresence>
          {config.timerEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 flex-wrap">
                {TIMER_OPTIONS.map(sec => (
                  <button
                    key={sec}
                    onClick={() => actions.setTimerDuration(sec)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${config.timerDuration === sec
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }
                    `}
                  >
                    {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Voting mode */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Modo de votación
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { if (config.votingMode !== 'manual') actions.toggleVotingMode(); }}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-150
              ${config.votingMode === 'manual'
                ? 'bg-red-950/40 border-red-600/60 shadow-sm shadow-red-900/20'
                : 'bg-zinc-900/60 border-zinc-700/40 hover:border-zinc-600'
              }
            `}
          >
            <Hand size={22} className={config.votingMode === 'manual' ? 'text-red-400' : 'text-zinc-500'} />
            <span className={`text-sm font-medium ${config.votingMode === 'manual' ? 'text-red-200' : 'text-zinc-500'}`}>
              En persona
            </span>
            <span className="text-[10px] text-zinc-600 text-center leading-tight">
              Votan hablando y eligen quién sale
            </span>
          </button>
          <button
            onClick={() => { if (config.votingMode !== 'app') actions.toggleVotingMode(); }}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-150
              ${config.votingMode === 'app'
                ? 'bg-red-950/40 border-red-600/60 shadow-sm shadow-red-900/20'
                : 'bg-zinc-900/60 border-zinc-700/40 hover:border-zinc-600'
              }
            `}
          >
            <Smartphone size={22} className={config.votingMode === 'app' ? 'text-red-400' : 'text-zinc-500'} />
            <span className={`text-sm font-medium ${config.votingMode === 'app' ? 'text-red-200' : 'text-zinc-500'}`}>
              En la app
            </span>
            <span className="text-[10px] text-zinc-600 text-center leading-tight">
              Cada jugador vota en secreto
            </span>
          </button>
        </div>
      </section>

      {/* Start button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleStartGame}
            disabled={!canStart}
            fullWidth
            size="lg"
            icon={<Play size={20} />}
          >
            Iniciar Partida
          </Button>
        </div>
      </div>

      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          actions.startGame();
        }}
        title="¿Iniciar partida?"
        description={`${config.players.length} jugadores, ${config.impostorCount} impostor${config.impostorCount > 1 ? 'es' : ''}, ${totalWords} palabras disponibles.`}
        confirmText="¡Jugar!"
      />
    </motion.div>
  );
}
