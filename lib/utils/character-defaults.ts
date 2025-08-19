import { Skill, AttributeName, HitDice, Wounds, CharacterConfiguration, Mana } from '../types/character';
import { Inventory } from '../types/inventory';
import { Abilities } from '../types/abilities';

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

export const createDefaultHitPoints = () => {
  return {
    current: 10,
    max: 10,
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

export const createDefaultHitDice = (level: number = 1): HitDice => {
  return {
    size: 8, // Default to d8 hit dice
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
    maxHP: 10, // Default to 10 max hit points
    maxInventorySize: 10, // Default to 10 base inventory slots (before strength bonus)
    mana: {
      enabled: false, // Mana disabled by default
      attribute: 'intelligence', // Default to intelligence if enabled
    },
  };
};

export const createDefaultMana = (attribute: number, level: number): Mana => {
  const maxMana = 3 * attribute + level;
  return {
    current: maxMana, // Start with full mana
    max: maxMana, // 3 * mana attribute + level
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