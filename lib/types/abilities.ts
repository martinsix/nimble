export type AbilityFrequency = 'per_turn' | 'per_encounter';

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
  maxUses: number;
  currentUses: number;
}

export type Ability = FreeformAbility | ActionAbility;

export interface Abilities {
  abilities: Ability[];
}