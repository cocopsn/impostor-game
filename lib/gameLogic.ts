import { Player, Vote, RoundResult, GameConfig } from '@/types/game';
import { WORD_BANK } from '@/components/WordBank';

export function selectWord(config: GameConfig): { word: string; category: string } {
  const pool: { word: string; category: string }[] = [];

  for (const cat of config.selectedCategories) {
    const words = WORD_BANK[cat];
    if (words) {
      for (const w of words) {
        pool.push({ word: w, category: cat });
      }
    }
  }

  for (const w of config.customWords) {
    if (w.trim()) {
      pool.push({ word: w.trim(), category: 'Personalizada' });
    }
  }

  if (pool.length === 0) {
    return { word: 'Error', category: 'Sin categoría' };
  }

  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function assignRoles(players: Player[], impostorCount: number): Player[] {
  const indices = players.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  const impostorIndices = new Set(shuffled.slice(0, impostorCount));

  return players.map((p, i) => ({
    ...p,
    role: impostorIndices.has(i) ? 'impostor' as const : 'innocent' as const,
  }));
}

export function resolveVotes(
  votes: Vote[],
  players: Player[],
  roundNumber: number
): RoundResult {
  const counts = new Map<string, number>();

  for (const vote of votes) {
    if (vote.targetId) {
      counts.set(vote.targetId, (counts.get(vote.targetId) || 0) + 1);
    }
  }

  if (counts.size === 0) {
    return { roundNumber, votes, eliminatedPlayer: null, wasTie: true };
  }

  let maxVotes = 0;
  for (const count of counts.values()) {
    if (count > maxVotes) maxVotes = count;
  }

  const topVoted: string[] = [];
  for (const [id, count] of counts.entries()) {
    if (count === maxVotes) topVoted.push(id);
  }

  if (topVoted.length > 1) {
    return { roundNumber, votes, eliminatedPlayer: null, wasTie: true };
  }

  const eliminated = players.find(p => p.id === topVoted[0]) || null;
  return { roundNumber, votes, eliminatedPlayer: eliminated, wasTie: false };
}

export function checkWinCondition(players: Player[]): 'impostors' | 'innocents' | null {
  const alive = players.filter(p => p.isAlive);
  const aliveImpostors = alive.filter(p => p.role === 'impostor').length;
  const aliveInnocents = alive.filter(p => p.role === 'innocent').length;

  if (aliveImpostors === 0) return 'innocents';
  if (aliveImpostors >= aliveInnocents) return 'impostors';
  return null;
}

export function getMaxImpostors(playerCount: number): number {
  return Math.max(1, Math.floor(playerCount / 3));
}
