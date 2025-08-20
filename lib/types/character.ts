export type AttributeName = 'strength' | 'dexterity' | 'intelligence' | 'will';

export interface Skill {
  name: string;
  associatedAttribute: AttributeName;
  modifier: number;
}

import { Inventory } from './inventory';
import { Abilities } from './abilities';
import { ArmorProficiency, WeaponProficiency } from './class';

export interface ActionTracker {
  current: number; // Currently available actions
  base: number; // Base actions per turn (default 3)
  bonus: number; // Additional permanent actions gained
}

export type HitDieSize = 4 | 6 | 8 | 10 | 12;

export interface HitDice {
  size: HitDieSize; // Die size (d4, d6, d8, d10, d12)
  current: number; // Currently available hit dice
  max: number; // Maximum hit dice (equals level)
}

export interface Wounds {
  current: number; // Current wounds sustained
  max: number; // Maximum wounds before death (default 6)
}

export interface ManaConfiguration {
  enabled: boolean; // Whether this character uses mana
  attribute: AttributeName; // Which attribute determines mana pool size
}

export interface Mana {
  current: number; // Current mana available
  max: number; // Maximum mana (3 * mana attribute + level)
}

export interface Proficiencies {
  armor: ArmorProficiency[]; // Armor types character is proficient with
  weapons: WeaponProficiency[]; // Weapon categories character is proficient with
}

export interface CharacterConfiguration {
  maxWounds: number; // Maximum wounds before death (default 6)
  maxHP: number; // Maximum hit points (default 10)
  maxInventorySize: number; // Base inventory size before strength bonus (default 10)
  mana: ManaConfiguration; // Mana system configuration
}

export interface Character {
  id: string;
  name: string;
  level: number; // Character level (starting at 1)
  classId: string; // Character's class (e.g., 'fighter', 'wizard')
  grantedFeatures: string[]; // IDs of class features already granted to this character
  proficiencies: Proficiencies; // Armor and weapon proficiencies
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
  hitDice: HitDice; // Hit dice for healing and recovery
  wounds: Wounds; // Wounds sustained from reaching 0 HP
  mana?: Mana; // Mana pool (optional - only if enabled in config)
  config: CharacterConfiguration; // Character configuration settings
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
  level: number;
  classId: string;
  grantedFeatures: string[];
  proficiencies: Proficiencies;
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
  hitDice: HitDice;
  wounds: Wounds;
  mana?: Mana;
  config: CharacterConfiguration;
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