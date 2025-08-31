export type AttributeName = 'strength' | 'dexterity' | 'intelligence' | 'will';

export type SaveAdvantageType = 'advantage' | 'disadvantage' | 'normal';

export type SaveAdvantageMap = Partial<Record<AttributeName, SaveAdvantageType>>;

export interface Skill {
  name: string;
  associatedAttribute: AttributeName;
  modifier: number;
}

import { Inventory } from './inventory';
import { Abilities } from './abilities';
import { ArmorProficiency, WeaponProficiency } from './class';
import { ResourceInstance } from './resources';
import { AncestryTrait } from './ancestry';

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

export interface Proficiencies {
  armor: ArmorProficiency[]; // Armor types character is proficient with
  weapons: WeaponProficiency[]; // Weapon categories character is proficient with
}

export interface CharacterConfiguration {
  maxWounds: number; // Maximum wounds before death (default 6)
  maxInventorySize: number; // Base inventory size before strength bonus (default 10)
}

export interface Character {
  id: string;
  name: string;
  ancestry: AncestryTrait; // Character's ancestry with granted features
  level: number; // Character level (starting at 1)
  classId: string; // Character's class (e.g., 'fighter', 'wizard')
  subclassId?: string; // Character's subclass (e.g., 'fighter-champion', 'wizard-evocation')
  grantedFeatures: string[]; // IDs of class features already granted to this character
  spellTierAccess: number; // Highest tier of spells character can access (1-9, 0 for no spell access)
  proficiencies: Proficiencies; // Armor and weapon proficiencies
  attributes: {
    strength: number;
    dexterity: number;
    intelligence: number;
    will: number;
  };
  saveAdvantages: SaveAdvantageMap; // Permanent advantage/disadvantage on saves
  hitPoints: {
    current: number;
    max: number;
    temporary: number;
  };
  hitDice: HitDice; // Hit dice for healing and recovery
  wounds: Wounds; // Wounds sustained from reaching 0 HP
  resources: ResourceInstance[]; // Character's resources (mana, fury, etc.)
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
  ancestry: AncestryTrait;
  level: number;
  classId: string;
  subclassId?: string;
  grantedFeatures: string[];
  spellTierAccess: number; // Highest tier of spells character can access (1-9, 0 for no spell access)
  proficiencies: Proficiencies;
  attributes: {
    strength: number;
    dexterity: number;
    intelligence: number;
    will: number;
  };
  saveAdvantages: SaveAdvantageMap;
  hitPoints: {
    current: number;
    max: number;
    temporary: number;
  };
  hitDice: HitDice;
  wounds: Wounds;
  resources: ResourceInstance[];
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