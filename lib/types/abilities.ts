import { AttributeName } from './character';

export type AbilityFrequency = 'per_turn' | 'per_encounter' | 'per_safe_rest' | 'at_will';

export interface AbilityRoll {
  dice: string; // e.g., "2d4", "1d6"
  modifier?: number; // fixed modifier, e.g., +2
  attribute?: AttributeName; // attribute to add to the roll
}

export interface BaseAbility {
  id: string;
  name: string;
  description: string;
}

export interface FreeformAbility extends BaseAbility {
  type: 'freeform';
}

export interface ActionAbility extends BaseAbility {
  type: 'action';
  frequency: AbilityFrequency;
  maxUses?: number; // Optional for at-will abilities
  currentUses?: number; // Optional for at-will abilities
  roll?: AbilityRoll; // Optional roll information
}

export type Ability = FreeformAbility | ActionAbility;

export interface Abilities {
  abilities: Ability[];
}