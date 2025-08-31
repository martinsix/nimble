import { AncestryDefinition } from '../../types/ancestry';

export const human: AncestryDefinition = {
  id: 'human',
  name: 'Human',
  description: 'Versatile and ambitious, humans are found in every corner of the world. Their adaptability and drive make them capable in any profession.',
  size: 'medium',
  baseSpeed: 30,
  languages: ['Common'],
  lifespan: '80-100 years',
  culture: 'Humans form diverse societies and cultures, adapting to their environment and circumstances.',
  physicalTraits: 'Humans vary widely in height, weight, and appearance. They typically stand 5-6 feet tall with varied skin, hair, and eye colors.',
  features: [
    {
      type: 'stat_boost',
      name: 'Human Versatility',
      description: 'Humans gain a +1 bonus to two different attributes of their choice.',
      statBoosts: [
        { attribute: 'strength', amount: 1 },
        { attribute: 'dexterity', amount: 1 }
      ]
    },
    {
      type: 'proficiency',
      name: 'Extra Skill',
      description: 'Humans gain proficiency in one additional skill of their choice.',
      proficiencies: [
        { type: 'skill', name: 'Any skill of choice' }
      ]
    },
    {
      type: 'passive_feature',
      name: 'Determination',
      description: 'Humans can push through adversity with sheer determination. Once per day, they can reroll a failed skill check or saving throw.',
      category: 'cultural'
    }
  ]
};