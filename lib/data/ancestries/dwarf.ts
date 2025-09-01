import { AncestryDefinition } from '../../types/ancestry';
import { dwarfNames } from '../name-configs';

export const dwarf: AncestryDefinition = {
  id: 'dwarf',
  name: 'Dwarf',
  description: 'Hardy and resilient, dwarves are known for their craftsmanship, loyalty, and resistance to magic. They excel in combat and working with stone and metal.',
  size: 'medium',
  baseSpeed: 25,
  languages: ['Common', 'Dwarvish'],
  lifespan: '250-400 years',
  culture: 'Dwarven clans value honor, tradition, and masterful craftsmanship. They typically live in mountain strongholds or underground cities.',
  physicalTraits: 'Dwarves are short and stocky, typically 4-5 feet tall with broad builds, thick beards, and sturdy constitutions.',
  features: [
    {
      type: 'stat_boost',
      name: 'Dwarven Fortitude',
      description: 'Dwarves gain a +2 bonus to Strength and +1 to Will.',
      statBoosts: [
        { attribute: 'strength', amount: 2 },
        { attribute: 'will', amount: 1 }
      ]
    },
    {
      type: 'darkvision',
      name: 'Darkvision',
      description: 'Dwarves can see in darkness within 60 feet as if it were dim light.',
      range: 60
    },
    {
      type: 'resistance',
      name: 'Dwarven Resilience',
      description: 'Dwarves have resistance to poison damage and advantage on saving throws against poison.',
      resistances: [
        { type: 'damage', name: 'poison', description: 'Resistance to poison damage' }
      ]
    },
    {
      type: 'proficiency',
      name: 'Stonecunning',
      description: 'Dwarves have proficiency with stonework and gain bonuses when examining stone structures.',
      proficiencies: [
        { type: 'tool', name: 'Mason\'s tools' },
        { type: 'skill', name: 'examination', bonus: 2 }
      ]
    },
    {
      type: 'proficiency',
      name: 'Dwarven Combat Training',
      description: 'Dwarves have proficiency with battleaxes, handaxes, light hammers, and warhammers.',
      proficiencies: [
        { type: 'tool', name: 'Battleaxe' },
        { type: 'tool', name: 'Handaxe' },
        { type: 'tool', name: 'Light hammer' },
        { type: 'tool', name: 'Warhammer' }
      ]
    },
    {
      type: 'passive_feature',
      name: 'Dwarven Will',
      description: 'Dwarves have advantage on Will saving throws.',
      category: 'biological'
    }
  ],
  nameConfig: dwarfNames
};