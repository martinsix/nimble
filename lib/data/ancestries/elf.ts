import { AncestryDefinition } from '../../types/ancestry';

export const elf: AncestryDefinition = {
  id: 'elf',
  name: 'Elf',
  description: 'Graceful and long-lived, elves are deeply connected to magic and nature. Their keen senses and natural agility make them excellent scouts and spellcasters.',
  size: 'medium',
  baseSpeed: 30,
  languages: ['Common', 'Elvish'],
  lifespan: '400-750 years',
  culture: 'Elven societies value art, magic, and harmony with nature. They often live in forest communities or magical cities.',
  physicalTraits: 'Elves are slender and graceful, typically 5-6 feet tall with pointed ears, sharp features, and an otherworldly beauty.',
  features: [
    {
      type: 'stat_boost',
      name: 'Elven Grace',
      description: 'Elves gain a +2 bonus to Dexterity.',
      statBoosts: [
        { attribute: 'dexterity', amount: 2 }
      ]
    },
    {
      type: 'darkvision',
      name: 'Darkvision',
      description: 'Elves can see in darkness within 60 feet as if it were dim light.',
      range: 60
    },
    {
      type: 'proficiency',
      name: 'Keen Senses',
      description: 'Elves have proficiency with Perception checks.',
      proficiencies: [
        { type: 'skill', name: 'perception', bonus: 2 }
      ]
    },
    {
      type: 'resistance',
      name: 'Fey Ancestry',
      description: 'Elves have resistance to charm effects and cannot be magically put to sleep.',
      resistances: [
        { type: 'condition', name: 'charm', description: 'Resistance to charm effects' },
        { type: 'condition', name: 'magical sleep', description: 'Immunity to magical sleep' }
      ]
    },
    {
      type: 'passive_feature',
      name: 'Trance',
      description: 'Elves do not sleep but instead enter a trance for 4 hours, gaining the benefits of a full rest.',
      category: 'biological'
    }
  ]
};