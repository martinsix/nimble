export interface SingleDie {
  type: number; // e.g., 6 for d6
  result: number;
  isCritical?: boolean; // True if this die was a critical hit
}

// Base interface for all log entries
export interface BaseLogEntry {
  id: string;
  timestamp: Date;
  description: string;
}

// Dice roll log entry
export interface DiceRoll extends BaseLogEntry {
  type: 'roll';
  dice: SingleDie[]; // Array of individual dice (after advantage/disadvantage applied)
  droppedDice?: SingleDie[]; // Dice that were dropped due to advantage/disadvantage
  modifier: number;
  total: number;
  isMiss?: boolean; // For attack rolls
  criticalHits?: number; // Number of critical hits that occurred
  advantageLevel?: number; // Positive for advantage, negative for disadvantage, 0/undefined for normal
}

// Damage log entry
export interface DamageEntry extends BaseLogEntry {
  type: 'damage';
  amount: number; // Amount of damage taken
  targetType: 'hp' | 'temp_hp'; // What type of HP was affected
}

// Healing log entry
export interface HealingEntry extends BaseLogEntry {
  type: 'healing';
  amount: number; // Amount healed
}

// Temporary HP log entry
export interface TempHPEntry extends BaseLogEntry {
  type: 'temp_hp';
  amount: number; // Amount of temporary HP gained
  previous?: number; // Previous temp HP amount (if replacing)
}

// Initiative entry for combat tracking
export interface InitiativeEntry extends BaseLogEntry {
  type: 'initiative';
  total: number; // Initiative roll result
  actionsGranted: number; // Number of actions granted by this roll
}

// Union type for all log entries
export type LogEntry = DiceRoll | DamageEntry | HealingEntry | TempHPEntry | InitiativeEntry;

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export interface DiceExpression {
  count: number; // number of dice
  sides: DiceType; // type of dice
}