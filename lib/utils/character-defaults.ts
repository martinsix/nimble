import { Character, AttributeName, HitDice, Wounds, CharacterConfiguration, Proficiencies, HitDieSize } from '../types/character';
import { Inventory } from '../types/inventory';
import { Abilities } from '../types/abilities';
import { ClassDefinition } from '../types/class';
import { ResourceInstance, ResourceDefinition, createResourceInstance } from '../types/resources';

export const createDefaultSkills = () => {
  const defaultSkills = {
    arcana: { name: 'Arcana', associatedAttribute: 'intelligence' as AttributeName, modifier: 0 },
    examination: { name: 'Examination', associatedAttribute: 'intelligence' as AttributeName, modifier: 0 },
    finesse: { name: 'Finesse', associatedAttribute: 'dexterity' as AttributeName, modifier: 0 },
    influence: { name: 'Influence', associatedAttribute: 'will' as AttributeName, modifier: 0 },
    insight: { name: 'Insight', associatedAttribute: 'will' as AttributeName, modifier: 0 },
    might: { name: 'Might', associatedAttribute: 'strength' as AttributeName, modifier: 0 },
    lore: { name: 'Lore', associatedAttribute: 'intelligence' as AttributeName, modifier: 0 },
    naturecraft: { name: 'Naturecraft', associatedAttribute: 'will' as AttributeName, modifier: 0 },
    perception: { name: 'Perception', associatedAttribute: 'will' as AttributeName, modifier: 0 },
    stealth: { name: 'Stealth', associatedAttribute: 'will' as AttributeName, modifier: 0 },
  };
  
  return defaultSkills;
};

export const createDefaultInventory = (strength: number = 0): Inventory => {
  return {
    maxSize: 10 + strength,
    items: [
      {
        id: 'sample-leather-armor',
        name: 'Leather Armor',
        size: 2,
        type: 'armor',
        armor: 2,
        maxDexBonus: 3,
        properties: ['Light'],
      },
      {
        id: 'sample-sword',
        name: 'Sword',
        size: 1,
        type: 'weapon',
        attribute: 'strength',
        damage: '1d8',
        properties: ['Versatile'],
      },
    ],
  };
};

export const createDefaultHitPoints = (startingHP: number = 10) => {
  return {
    current: startingHP,
    max: startingHP,
    temporary: 0,
  };
};

export const createDefaultInitiative = () => {
  return {
    name: 'Initiative',
    associatedAttribute: 'dexterity' as AttributeName,
    modifier: 0,
  };
};

export const createDefaultActionTracker = () => {
  return {
    current: 3,
    base: 3,
    bonus: 0,
  };
};

export const createDefaultHitDice = (level: number = 1, hitDieSize: HitDieSize = 8): HitDice => {
  return {
    size: hitDieSize,
    current: level,
    max: level,
  };
};

export const createDefaultWounds = (maxWounds: number = 6): Wounds => {
  return {
    current: 0, // Start with no wounds
    max: maxWounds, // Default to 6 max wounds before death
  };
};

export const createDefaultCharacterConfiguration = (): CharacterConfiguration => {
  return {
    maxWounds: 6, // Default to 6 max wounds before death
    maxInventorySize: 10, // Default to 10 base inventory slots (before strength bonus)
  };
};

export const createDefaultResources = (): ResourceInstance[] => {
  const manaDefinition: ResourceDefinition = {
    id: 'mana',
    name: 'Mana',
    description: 'Magical energy used to cast spells',
    colorScheme: 'blue-magic',
    icon: 'sparkles',
    resetCondition: 'safe_rest',
    resetType: 'to_max',
    minValue: 0,
    maxValue: 10,
  };

  return [
    createResourceInstance(manaDefinition, 10, 1),
  ];
};

export const createDefaultProficiencies = (classDefinition?: ClassDefinition): Proficiencies => {
  return {
    armor: classDefinition?.armorProficiencies || [],
    weapons: classDefinition?.weaponProficiencies || [],
  };
};

export const createDefaultAbilities = (): Abilities => {
  return {
    abilities: [
      {
        id: 'sample-healing-potion',
        name: 'Healing Potion',
        description: 'Restore 1d8+2 hit points',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 1,
        currentUses: 1,
        actionCost: 1,
      },
      {
        id: 'sample-backstory',
        name: 'Character Background',
        description: 'A brave adventurer with a mysterious past.',
        type: 'freeform',
      },
    ],
  };
};

/**
 * Creates a complete default character template for merging with invalid characters
 * This provides fallback values for all required character fields
 */
export const createDefaultCharacterTemplate = (): Omit<Character, 'id'> => {
  const defaultAttributes = { strength: 0, dexterity: 0, intelligence: 0, will: 0 };
  
  return {
    name: 'Unnamed Character',
    ancestry: { ancestryId: 'human', grantedFeatures: [] },
    background: { backgroundId: 'folk-hero', grantedFeatures: [] },
    level: 1,
    classId: 'fighter', // Default to fighter as the most basic class
    subclassId: undefined,
    grantedFeatures: [],
    spellTierAccess: 0,
    proficiencies: createDefaultProficiencies(),
    attributes: defaultAttributes,
    saveAdvantages: {
      strength: 'normal',
      dexterity: 'normal',
      intelligence: 'normal',
      will: 'normal',
    },
    hitPoints: createDefaultHitPoints(10),
    hitDice: createDefaultHitDice(1, 8),
    wounds: createDefaultWounds(6),
    resources: createDefaultResources(),
    config: createDefaultCharacterConfiguration(),
    initiative: createDefaultInitiative(),
    actionTracker: createDefaultActionTracker(),
    inEncounter: false,
    skills: createDefaultSkills(),
    inventory: createDefaultInventory(0),
    abilities: createDefaultAbilities(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Deep merge utility for merging partial character data with defaults
 * This ensures all required fields exist while preserving valid existing data
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] != null) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key]) && !(source[key] instanceof Date)) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

/**
 * Merges partial character data with default template to create a valid character
 * This is used for graceful recovery from validation errors or missing fields
 */
export const mergeWithDefaultCharacter = (partialCharacter: any, characterId: string): Character => {
  const defaultTemplate = createDefaultCharacterTemplate();
  
  // Merge the partial character data with defaults
  const mergedCharacter = deepMerge(defaultTemplate, partialCharacter);
  
  // Ensure the character has the correct ID
  mergedCharacter.id = characterId;
  
  // Update timestamps to indicate this was recovered
  mergedCharacter.updatedAt = new Date();
  
  return mergedCharacter as Character;
};