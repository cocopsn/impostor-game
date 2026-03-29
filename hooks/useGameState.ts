import { useReducer, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { GameState, GameAction, GameActions, Player } from '@/types/game';
import { selectWord, assignRoles, resolveVotes, checkWinCondition } from '@/lib/gameLogic';
import { ALL_CATEGORIES } from '@/components/WordBank';

const initialState: GameState = {
  phase: 'home',
  config: {
    players: [],
    impostorCount: 1,
    selectedCategories: [...ALL_CATEGORIES],
    customWords: [],
    timerEnabled: false,
    timerDuration: 120,
  },
  secretWord: '',
  secretCategory: '',
  currentRound: 1,
  currentPlayerIndex: 0,
  revealStep: 'passing',
  votingStep: 'passing',
  currentRoundVotes: [],
  rounds: [],
  winner: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_TO_SETUP':
      return {
        ...initialState,
        phase: 'setup',
        config: {
          ...initialState.config,
          selectedCategories: [...ALL_CATEGORIES],
        },
      };

    case 'ADD_PLAYER': {
      const name = action.name.trim();
      if (!name || name.length > 20) return state;
      if (state.config.players.some(p => p.name.toLowerCase() === name.toLowerCase())) return state;
      if (state.config.players.length >= 15) return state;

      return {
        ...state,
        config: {
          ...state.config,
          players: [
            ...state.config.players,
            { id: nanoid(8), name, role: null, isAlive: true, eliminatedInRound: null },
          ],
        },
      };
    }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        config: {
          ...state.config,
          players: state.config.players.filter(p => p.id !== action.id),
        },
      };

    case 'SET_IMPOSTOR_COUNT':
      return {
        ...state,
        config: { ...state.config, impostorCount: action.count },
      };

    case 'TOGGLE_CATEGORY': {
      const cats = state.config.selectedCategories;
      const newCats = cats.includes(action.category)
        ? cats.filter(c => c !== action.category)
        : [...cats, action.category];
      return {
        ...state,
        config: { ...state.config, selectedCategories: newCats },
      };
    }

    case 'SELECT_ALL_CATEGORIES':
      return {
        ...state,
        config: { ...state.config, selectedCategories: [...ALL_CATEGORIES] },
      };

    case 'DESELECT_ALL_CATEGORIES':
      return {
        ...state,
        config: { ...state.config, selectedCategories: [] },
      };

    case 'SET_CUSTOM_WORDS':
      return {
        ...state,
        config: { ...state.config, customWords: action.words },
      };

    case 'TOGGLE_TIMER':
      return {
        ...state,
        config: { ...state.config, timerEnabled: !state.config.timerEnabled },
      };

    case 'SET_TIMER_DURATION':
      return {
        ...state,
        config: { ...state.config, timerDuration: action.duration },
      };

    case 'START_GAME': {
      const { word, category } = selectWord(state.config);
      const playersWithRoles = assignRoles(state.config.players, state.config.impostorCount);
      return {
        ...state,
        phase: 'role-reveal',
        config: { ...state.config, players: playersWithRoles },
        secretWord: word,
        secretCategory: category,
        currentRound: 1,
        currentPlayerIndex: 0,
        revealStep: 'passing',
        currentRoundVotes: [],
        rounds: [],
        winner: null,
      };
    }

    case 'PLAYER_READY':
      return { ...state, revealStep: 'showing' };

    case 'PLAYER_SEEN': {
      const nextIndex = state.currentPlayerIndex + 1;
      if (nextIndex >= state.config.players.length) {
        return { ...state, phase: 'playing', currentPlayerIndex: 0 };
      }
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        revealStep: 'passing',
      };
    }

    case 'GO_TO_VOTING': {
      return {
        ...state,
        phase: 'voting',
        currentPlayerIndex: 0,
        votingStep: 'passing',
        currentRoundVotes: [],
      };
    }

    case 'VOTER_READY':
      return { ...state, votingStep: 'voting' };

    case 'CAST_VOTE': {
      const alivePlayers = state.config.players.filter(p => p.isAlive);
      const voter = alivePlayers[state.currentPlayerIndex];
      if (!voter) return state;

      const newVotes = [
        ...state.currentRoundVotes,
        { voterId: voter.id, targetId: action.targetId },
      ];

      const nextVoterIndex = state.currentPlayerIndex + 1;
      if (nextVoterIndex >= alivePlayers.length) {
        const result = resolveVotes(newVotes, state.config.players, state.currentRound);
        const updatedPlayers = result.eliminatedPlayer
          ? state.config.players.map(p =>
              p.id === result.eliminatedPlayer!.id
                ? { ...p, isAlive: false, eliminatedInRound: state.currentRound }
                : p
            )
          : [...state.config.players];

        const winCondition = checkWinCondition(updatedPlayers);

        return {
          ...state,
          phase: 'round-result',
          config: { ...state.config, players: updatedPlayers },
          currentRoundVotes: newVotes,
          rounds: [...state.rounds, result],
          winner: winCondition,
        };
      }

      return {
        ...state,
        currentPlayerIndex: nextVoterIndex,
        votingStep: 'passing',
        currentRoundVotes: newVotes,
      };
    }

    case 'NEXT_ROUND':
      return {
        ...state,
        phase: 'playing',
        currentRound: state.currentRound + 1,
        currentPlayerIndex: 0,
        currentRoundVotes: [],
      };

    case 'SHOW_GAME_OVER':
      return { ...state, phase: 'game-over' };

    case 'PLAY_AGAIN': {
      const resetPlayers = state.config.players.map(p => ({
        ...p,
        role: null as Player['role'],
        isAlive: true,
        eliminatedInRound: null,
      }));
      const { word, category } = selectWord({ ...state.config, players: resetPlayers });
      const playersWithRoles = assignRoles(resetPlayers, state.config.impostorCount);
      return {
        ...state,
        phase: 'role-reveal',
        config: { ...state.config, players: playersWithRoles },
        secretWord: word,
        secretCategory: category,
        currentRound: 1,
        currentPlayerIndex: 0,
        revealStep: 'passing',
        votingStep: 'passing',
        currentRoundVotes: [],
        rounds: [],
        winner: null,
      };
    }

    case 'NEW_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

export function useGameState(): { state: GameState; actions: GameActions } {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const actions: GameActions = {
    goToSetup: useCallback(() => dispatch({ type: 'GO_TO_SETUP' }), []),
    addPlayer: useCallback((name: string) => dispatch({ type: 'ADD_PLAYER', name }), []),
    removePlayer: useCallback((id: string) => dispatch({ type: 'REMOVE_PLAYER', id }), []),
    setImpostorCount: useCallback((count: number) => dispatch({ type: 'SET_IMPOSTOR_COUNT', count }), []),
    toggleCategory: useCallback((category: string) => dispatch({ type: 'TOGGLE_CATEGORY', category }), []),
    selectAllCategories: useCallback(() => dispatch({ type: 'SELECT_ALL_CATEGORIES' }), []),
    deselectAllCategories: useCallback(() => dispatch({ type: 'DESELECT_ALL_CATEGORIES' }), []),
    setCustomWords: useCallback((words: string[]) => dispatch({ type: 'SET_CUSTOM_WORDS', words }), []),
    toggleTimer: useCallback(() => dispatch({ type: 'TOGGLE_TIMER' }), []),
    setTimerDuration: useCallback((duration: number) => dispatch({ type: 'SET_TIMER_DURATION', duration }), []),
    startGame: useCallback(() => dispatch({ type: 'START_GAME' }), []),
    playerReady: useCallback(() => dispatch({ type: 'PLAYER_READY' }), []),
    playerSeen: useCallback(() => dispatch({ type: 'PLAYER_SEEN' }), []),
    goToVoting: useCallback(() => dispatch({ type: 'GO_TO_VOTING' }), []),
    voterReady: useCallback(() => dispatch({ type: 'VOTER_READY' }), []),
    castVote: useCallback((targetId: string | null) => dispatch({ type: 'CAST_VOTE', targetId }), []),
    nextRound: useCallback(() => dispatch({ type: 'NEXT_ROUND' }), []),
    showGameOver: useCallback(() => dispatch({ type: 'SHOW_GAME_OVER' }), []),
    playAgain: useCallback(() => dispatch({ type: 'PLAY_AGAIN' }), []),
    newGame: useCallback(() => dispatch({ type: 'NEW_GAME' }), []),
  };

  return { state, actions };
}
