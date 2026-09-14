export interface DeckState {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly rotation: number;
}

export const DECK_STATES: readonly DeckState[] = [
  { x: 0, y: 0, scale: 1, rotation: 0 },
  { x: 14, y: 12, scale: 0.975, rotation: 1 },
  { x: 28, y: 24, scale: 0.95, rotation: -1 },
  { x: 42, y: 36, scale: 0.925, rotation: 1 },
] as const;

export const DECK_Z_BASE = 13;