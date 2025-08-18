export interface SingleDie {
  type: number; // e.g., 6 for d6
  result: number;
  isCritical?: boolean; // True if this die was a critical hit
}

export interface DiceRoll {
  id: string;
  timestamp: Date;
  dice: SingleDie[]; // Array of individual dice
  modifier: number;
  total: number;
  description: string; // e.g., "Strength check" or "Sword attack"
  isMiss?: boolean; // For attack rolls
  criticalHits?: number; // Number of critical hits that occurred
}

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export interface DiceExpression {
  count: number; // number of dice
  sides: DiceType; // type of dice
}