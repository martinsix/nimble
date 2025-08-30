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
      level: 1,
      type: 'ability',
      name: 'Magic Missile',
      description: 'You learn the Magic Missile spell, a reliable force projectile.',
      ability: {
        id: 'magic-missile',
        name: 'Magic Missile',
        description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice within range.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 3,
        currentUses: 3,
        actionCost: 1,
        roll: {
          dice: { count: 3, sides: 4 },
          modifier: 3
        },
        resourceCost: {
          type: 'fixed',
          resourceId: 'mana',
          amount: 1
        }
      }
    },
    {
      level: 1,
      type: 'ability',
      name: 'Eldritch Blast',
      description: 'You learn a powerful cantrip that requires no mana.',
      ability: {
        id: 'eldritch-blast',
        name: 'Eldritch Blast',
        description: 'A beam of crackling energy streaks toward a creature within range. This is a cantrip that requires no mana.',
        type: 'action',
        frequency: 'at_will',
        actionCost: 1,
        roll: {
          dice: { count: 1, sides: 10 },
          attribute: 'intelligence'
        }
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
      level: 3,
      type: 'ability',
      name: 'Fireball',
      description: 'You learn the devastating Fireball spell.',
      ability: {
        id: 'fireball',
        name: 'Fireball',
        description: 'A bright streak flashes from your pointing finger to a point within range and blossoms into a burst of flame.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        actionCost: 1,
        roll: {
          dice: { count: 8, sides: 6 }
        },
        resourceCost: {
          type: 'fixed',
          resourceId: 'mana',
          amount: 3
        }
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