import { AncestryDefinition } from '../../types/ancestry';
import { halflingNames } from '../name-configs';

export const halfling: AncestryDefinition = {
  id: 'halfling',
  name: 'Halfling',
  description: 'Small but brave, halflings are known for their luck, nimbleness, and love of comfort. They make excellent rogues, rangers, and companions.',
  size: 'small',
  baseSpeed: 25,
  languages: ['Common', 'Halfling'],
  lifespan: '120-150 years',
  culture: 'Halfling communities value friendship, family, and simple pleasures. They often live in peaceful rural settlements.',
  physicalTraits: 'Halflings are small and nimble, typically 3-4 feet tall with curly hair, large feet, and cheerful dispositions.',
  features: [
    {
      type: 'stat_boost',
      name: 'Halfling Nimbleness',
      description: 'Halflings gain a +2 bonus to Dexterity.',
      statBoosts: [
        { attribute: 'dexterity', amount: 2 }
      ]
    },
    {
      type: 'passive_feature',
      name: 'Lucky',
      description: 'When you roll a 1 on a d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
      category: 'cultural'
    },
    {
      type: 'passive_feature',
      name: 'Brave',
      description: 'You have advantage on saving throws against being frightened.',
      category: 'cultural'
    },
    {
      type: 'passive_feature',
      name: 'Halfling Nimbleness',
      description: 'You can move through the space of any creature that is of a size larger than yours.',
      category: 'biological'
    },
    {
      type: 'proficiency',
      name: 'Naturally Stealthy',
      description: 'Halflings have proficiency with Stealth checks.',
      proficiencies: [
        { type: 'skill', name: 'stealth', bonus: 2 }
      ]
    }
  ],
  nameConfig: halflingNames
};