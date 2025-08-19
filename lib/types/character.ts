export type AttributeName = 'strength' | 'dexterity' | 'intelligence' | 'will';

export interface Skill {
  name: string;
  associatedAttribute: AttributeName;
  modifier: number;
}

import { Inventory } from './inventory';

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
}

export type SkillName = keyof Character['skills'];