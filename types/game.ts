export interface Player {
  id: string;
  name: string;
  role: 'innocent' | 'impostor' | null;
  isAlive: boolean;
  eliminatedInRound: number | null;
}

export interface GameConfig {
  players: Player[];
  impostorCount: number;
  selectedCategories: string[];
  customWords: string[];
  timerEnabled: boolean;
  timerDuration: number;
  votingMode: 'app' | 'manual';
}

export interface Vote {
  voterId: string;
  targetId: string | null;
}

export interface RoundResult {
  roundNumber: number;
  votes: Vote[];
  eliminatedPlayer: Player | null;
  wasTie: boolean;
}

export type GamePhase =
  | 'home'
  | 'setup'
  | 'role-reveal'
  | 'playing'
  | 'voting'
  | 'manual-vote'
  | 'round-result'
  | 'game-over';

export interface GameState {
  phase: GamePhase;
  config: GameConfig;
  secretWord: string;
  secretCategory: string;
  currentRound: number;
  currentPlayerIndex: number;
  revealStep: 'passing' | 'showing';
  votingStep: 'passing' | 'voting';
  currentRoundVotes: Vote[];
  rounds: RoundResult[];
  winner: 'impostors' | 'innocents' | null;
}

export type GameAction =
  | { type: 'GO_TO_SETUP' }
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'SET_IMPOSTOR_COUNT'; count: number }
  | { type: 'TOGGLE_CATEGORY'; category: string }
  | { type: 'SELECT_ALL_CATEGORIES' }
  | { type: 'DESELECT_ALL_CATEGORIES' }
  | { type: 'SET_CUSTOM_WORDS'; words: string[] }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'SET_TIMER_DURATION'; duration: number }
  | { type: 'START_GAME' }
  | { type: 'PLAYER_READY' }
  | { type: 'PLAYER_SEEN' }
  | { type: 'GO_TO_VOTING' }
  | { type: 'VOTER_READY' }
  | { type: 'CAST_VOTE'; targetId: string | null }
  | { type: 'TOGGLE_VOTING_MODE' }
  | { type: 'MANUAL_ELIMINATE'; playerId: string | null }
  | { type: 'NEXT_ROUND' }
  | { type: 'SHOW_GAME_OVER' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'NEW_GAME' };

export interface GameActions {
  goToSetup: () => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setImpostorCount: (count: number) => void;
  toggleCategory: (category: string) => void;
  selectAllCategories: () => void;
  deselectAllCategories: () => void;
  setCustomWords: (words: string[]) => void;
  toggleTimer: () => void;
  setTimerDuration: (duration: number) => void;
  startGame: () => void;
  playerReady: () => void;
  playerSeen: () => void;
  goToVoting: () => void;
  voterReady: () => void;
  castVote: (targetId: string | null) => void;
  toggleVotingMode: () => void;
  manualEliminate: (playerId: string | null) => void;
  nextRound: () => void;
  showGameOver: () => void;
  playAgain: () => void;
  newGame: () => void;
}
