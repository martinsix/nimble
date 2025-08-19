import { Skill, AttributeName } from '../types/character';
import { Inventory } from '../types/inventory';

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

export const createDefaultInventory = (): Inventory => {
  return {
    maxSize: 10,
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