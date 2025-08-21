import { HitDieSize, AttributeName } from './character';
import { Ability } from './abilities';
import { ResourceDefinition } from './resources';

export type ClassFeatureType = 'ability' | 'passive_feature' | 'stat_boost' | 'proficiency' | 'spell_access' | 'resource' | 'subclass_choice';

export interface StatBoost {
  attribute: AttributeName;
  amount: number;
}

export interface ProficiencyGrant {
  type: 'skill' | 'save' | 'tool' | 'language';
  name: string;
  bonus?: number; // Optional bonus beyond proficiency
}

export interface SpellAccess {
  spellLevel: number;
  spellsKnown?: number; // Number of spells learned at this level
  cantrips?: number; // Number of cantrips learned
  spellList?: string; // Which spell list to use (e.g., 'wizard', 'cleric')
}


// Base interface for all class features
interface BaseClassFeature {
  level: number;
  name: string;
  description: string;
}

// Ability feature - grants a new ability to the character
export interface AbilityFeature extends BaseClassFeature {
  type: 'ability';
  ability: Ability; // The actual ability definition
}

// Passive feature - background benefits, rules modifications
export interface PassiveFeature extends BaseClassFeature {
  type: 'passive_feature';
  category?: 'combat' | 'exploration' | 'social' | 'utility'; // Optional categorization
}

// Stat boost - permanent attribute increases
export interface StatBoostFeature extends BaseClassFeature {
  type: 'stat_boost';
  statBoosts: StatBoost[];
}

// Proficiency - grants new proficiencies
export interface ProficiencyFeature extends BaseClassFeature {
  type: 'proficiency';
  proficiencies: ProficiencyGrant[];
}

// Spell access - grants spellcasting or new spells
export interface SpellAccessFeature extends BaseClassFeature {
  type: 'spell_access';
  spellAccess: SpellAccess;
}

// Resource - grants new resources (like Ki, Bardic Inspiration, etc.)
export interface ResourceFeature extends BaseClassFeature {
  type: 'resource';
  resourceDefinition: ResourceDefinition;
  startingAmount?: number; // Optional override for initial current amount (defaults to maxValue)
}

// Subclass Choice - allows player to choose a subclass specialization
export interface SubclassChoiceFeature extends BaseClassFeature {
  type: 'subclass_choice';
  availableSubclasses: string[]; // Array of subclass IDs that can be chosen
}

export type ClassFeature = 
  | AbilityFeature 
  | PassiveFeature 
  | StatBoostFeature 
  | ProficiencyFeature 
  | SpellAccessFeature 
  | ResourceFeature
  | SubclassChoiceFeature;

export type ArmorProficiency = 
  | { type: 'cloth' }
  | { type: 'leather' } 
  | { type: 'mail' }
  | { type: 'plate' }
  | { type: 'shields' }
  | { type: 'freeform'; name: string };

export type WeaponProficiency = 
  | { type: 'strength_weapons' }
  | { type: 'dexterity_weapons' }
  | { type: 'freeform'; name: string };

export interface SubclassDefinition {
  id: string; // Unique identifier for the subclass
  name: string; // Display name (e.g., "Champion", "Battle Master")
  description: string; // Brief description of the subclass
  parentClassId: string; // Which class this subclass belongs to
  features: ClassFeature[]; // Features provided by this subclass
}

export interface ClassDefinition {
  id: string; // Unique identifier for the class
  name: string; // Display name (e.g., "Fighter", "Wizard")
  description: string; // Brief description of the class
  hitDieSize: HitDieSize; // Hit die size for this class (d6, d8, d10, etc.)
  keyAttributes: [AttributeName, AttributeName]; // Two primary attributes for the class
  startingHP: number; // Fixed starting hit points at level 1
  armorProficiencies: ArmorProficiency[]; // Armor types the class is proficient with
  weaponProficiencies: WeaponProficiency[]; // Weapon categories the class is proficient with
  features: ClassFeature[]; // All features available to this class
  subclasses?: SubclassDefinition[]; // Available subclasses for this class
}

// Helper types for working with class data
export interface ClassFeatureGrant {
  featureId: string; // Unique ID for this feature grant
  classId: string;
  level: number;
  feature: ClassFeature;
  grantedAt: Date; // When this feature was granted to the character
}