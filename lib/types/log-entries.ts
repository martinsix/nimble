import { DiceType } from './dice';

// Base interface for all log entries
export interface BaseLogEntry {
  id: string;
  timestamp: Date;
  description: string;
}

// Single die interface (used in dice rolls)
export interface SingleDie {
  type: DiceType; // e.g., 6 for d6, 20 for d20
  result: number;
  isCritical?: boolean; // True if this die was a critical hit
}

// Dice roll log entry
export interface DiceRollEntry extends BaseLogEntry {
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

// Ability usage entry
export interface AbilityUsageEntry extends BaseLogEntry {
  type: 'ability_usage';
  abilityName: string; // Name of the ability used
  frequency: 'per_turn' | 'per_encounter' | 'per_safe_rest' | 'at_will'; // Frequency of the ability
  usesRemaining: number; // Uses remaining after this usage
  maxUses: number; // Maximum uses for this ability
}

// Safe rest entry
export interface SafeRestEntry extends BaseLogEntry {
  type: 'safe_rest';
  healingAmount: number; // Amount of HP restored
  hitDiceRestored: number; // Number of hit dice restored
  woundsRemoved: number; // Number of wounds removed
  abilitiesReset: number; // Number of abilities reset
}

// Union type for all log entries
export type LogEntry = DiceRollEntry | DamageEntry | HealingEntry | TempHPEntry | InitiativeEntry | AbilityUsageEntry | SafeRestEntry;