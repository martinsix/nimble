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
    items: [],
  };
};