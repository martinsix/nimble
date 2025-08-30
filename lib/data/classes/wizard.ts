import { ClassDefinition } from '../../types/class';

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
  features: [
    {
      level: 1,
      type: 'spell_access',
      name: 'Cantrips',
      description: 'You know three cantrips of your choice from the wizard spell list.',
      spellAccess: {
        spellLevel: 0,
        cantrips: 3,
        spellList: 'wizard'
      }
    },
    {
      level: 1,
      type: 'spell_access',
      name: 'Spellcasting',
      description: 'You have learned to cast spells through study and preparation.',
      spellAccess: {
        spellLevel: 1,
        spellsKnown: 6,
        spellList: 'wizard'
      }
    },
    {
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
      level: 2,
      type: 'subclass_choice',
      name: 'Arcane Tradition',
      description: 'Choose a school of magic to focus your studies and shape your magical abilities.',
      availableSubclasses: ['wizard-evocation']
    },
    {
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