import { ClassDefinition } from '../../types/class';
import { getSpellSchoolDefinition } from '../spell-schools';

export const wizard: ClassDefinition = {
  id: 'wizard',
  name: 'Wizard',
  description: 'A scholarly magic-user capable of manipulating the structures of spellcasting.',
  hitDieSize: 6,
  keyAttributes: ['intelligence', 'will'],
  startingHP: 8,
  armorProficiencies: [
    { type: 'cloth' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Staves and Wands' }
  ],
  saveAdvantages: {
    intelligence: 'advantage'
  },
  startingEquipment: [
    'quarterstaff',
    'dagger',
    'cloth-robes',
    'spellbook',
    'component-pouch',
    'backpack',
    'ink-and-quill',
    'parchment',
    'rations',
    'rations'
  ],
  features: [
    {
      id: 'wizard-fire-magic',
      level: 1,
      type: 'spell_school',
      name: 'Fire Magic',
      description: 'You gain access to the Fire school of magic, learning to harness the power of flame.',
      spellSchool: getSpellSchoolDefinition('fire')!
    },
    {
      id: 'wizard-ritual-casting',
      level: 1,
      type: 'ability',
      name: 'Ritual Casting',
      description: 'You can cast a spell as a ritual if that spell has the ritual tag.',
      ability: {
        id: 'wizard-ritual-casting',
        name: 'Ritual Casting',
        description: 'You can cast a spell as a ritual if that spell has the ritual tag.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      id: 'wizard-arcane-tradition',
      level: 2,
      type: 'subclass_choice',
      name: 'Arcane Tradition',
      description: 'Choose a school of magic to focus your studies and shape your magical abilities.',
      availableSubclasses: ['wizard-evocation']
    },
    {
      id: 'wizard-spellcasting',
      level: 1,
      type: 'spell_tier_access',
      name: 'Spellcasting',
      description: 'You learn to cast spells of 1st tier.',
      maxTier: 1
    },
    {
      id: 'wizard-mana-pool',
      level: 2,
      type: 'resource',
      name: 'Mana Pool',
      description: 'You have learned to harness and store magical energy for casting spells.',
      resourceDefinition: {
        id: 'mana',
        name: 'Mana',
        description: 'Magical energy used to cast spells',
        colorScheme: 'blue-magic',
        icon: 'sparkles',
        resetCondition: 'safe_rest',
        resetType: 'to_max',
        minValue: 0,
        maxValue: 5
      }
    },
    {
      id: 'wizard-advanced-spellcasting',
      level: 3,
      type: 'spell_tier_access',
      name: 'Advanced Spellcasting',
      description: 'You learn to cast spells of 2nd tier.',
      maxTier: 2
    },
    {
      id: 'wizard-asi-4',
      level: 4,
      type: 'stat_boost',
      name: 'Ability Score Improvement',
      description: 'You can increase one ability score by 2, or two ability scores by 1 each.',
      statBoosts: [
        { attribute: 'intelligence', amount: 2 }
      ]
    }
  ]
};