export type AttributeName = 'strength' | 'dexterity' | 'intelligence' | 'will';

export interface Attributes {
  strength: number;
  dexterity: number;
  intelligence: number;
  will: number;
}

export type SaveAdvantageType = 'advantage' | 'disadvantage' | 'normal';

export type SaveAdvantageMap = Partial<Record<AttributeName, SaveAdvantageType>>;

export interface Skill {
  name: string;
  associatedAttribute: AttributeName;
  modifier: number;
}

import { Inventory } from './inventory';
import { Ability } from './abilities';
import { ArmorProficiency, WeaponProficiency, ClassFeature } from './class';
import { ResourceInstance } from './resources';
import { AncestryTrait } from './ancestry';
import { BackgroundTrait } from './background';

// Tracks features selected from pools by the character
export interface SelectedPoolFeature {
  poolId: string; // ID of the pool the feature was selected from
  featureId: string; // Unique ID of the selected feature within the pool
  feature: ClassFeature; // The actual feature that was selected
  selectedAt: Date; // When this feature was selected
  grantedByFeatureId: string; // ID of the PickFeatureFromPoolFeature that granted this selection
}

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
  background: BackgroundTrait; // Character's background with granted features
  level: number; // Character level (starting at 1)
  classId: string; // Character's class (e.g., 'fighter', 'wizard')
  subclassId?: string; // Character's subclass (e.g., 'fighter-champion', 'wizard-evocation')
  grantedFeatures: string[]; // IDs of class features already granted to this character
  selectedPoolFeatures: SelectedPoolFeature[]; // Features selected from pools
  spellTierAccess: number; // Highest tier of spells character can access (1-9, 0 for no spell access)
  proficiencies: Proficiencies; // Armor and weapon proficiencies
  attributes: Attributes;
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
  skills: Skills;
  inventory: Inventory;
  abilities: Ability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCharacterData {
  name: string;
  ancestry: AncestryTrait;
  background: BackgroundTrait;
  level: number;
  classId: string;
  subclassId?: string;
  grantedFeatures: string[];
  selectedPoolFeatures: SelectedPoolFeature[]; // Features selected from pools
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
  skills: Skills;
  inventory: Inventory;
  abilities: Ability[];
}

export type SkillName = keyof Skills;

export type Skills = Record<string, Skill>;