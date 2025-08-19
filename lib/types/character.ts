export type AttributeName = 'strength' | 'dexterity' | 'intelligence' | 'will';

export interface Skill {
  name: string;
  associatedAttribute: AttributeName;
  modifier: number;
}

import { Inventory } from './inventory';
import { Abilities } from './abilities';

export interface ActionTracker {
  current: number; // Currently available actions
  base: number; // Base actions per turn (default 3)
  bonus: number; // Additional permanent actions gained
}

export interface Character {
  id: string;
  name: string;
  attributes: {
    strength: number;
    dexterity: number;
    intelligence: number;
    will: number;
  };
  hitPoints: {
    current: number;
    max: number;
    temporary: number;
  };
  initiative: Skill;
  actionTracker: ActionTracker;
  inEncounter: boolean; // Whether currently in an encounter/combat
  skills: {
    arcana: Skill;
    examination: Skill;
    finesse: Skill;
    influence: Skill;
    insight: Skill;
    might: Skill;
    lore: Skill;
    naturecraft: Skill;
    perception: Skill;
    stealth: Skill;
  };
  inventory: Inventory;
  abilities: Abilities;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCharacterData {
  name: string;
  attributes: {
    strength: number;
    dexterity: number;
    intelligence: number;
    will: number;
  };
  hitPoints: {
    current: number;
    max: number;
    temporary: number;
  };
  initiative: Skill;
  actionTracker: ActionTracker;
  inEncounter: boolean;
  skills: {
    arcana: Skill;
    examination: Skill;
    finesse: Skill;
    influence: Skill;
    insight: Skill;
    might: Skill;
    lore: Skill;
    naturecraft: Skill;
    perception: Skill;
    stealth: Skill;
  };
  inventory: Inventory;
  abilities: Abilities;
}

export type SkillName = keyof Character['skills'];