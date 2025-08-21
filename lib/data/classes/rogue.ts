import { ClassDefinition } from '../../types/class';

export const rogue: ClassDefinition = {
  id: 'rogue',
  name: 'Rogue',
  description: 'A scoundrel who uses stealth and trickery to overcome obstacles.',
  hitDieSize: 8,
  keyAttributes: ['dexterity', 'intelligence'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' }
  ],
  weaponProficiencies: [
    { type: 'dexterity_weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'proficiency',
      name: 'Expertise',
      description: 'Choose two skills in which you have proficiency. Your proficiency bonus is doubled for those skills.',
      proficiencies: [
        { type: 'skill', name: 'Stealth', bonus: 2 },
        { type: 'skill', name: 'Sleight of Hand', bonus: 2 }
      ]
    },
    {
      level: 1,
      type: 'ability',
      name: 'Sneak Attack',
      description: 'Deal extra damage when you have advantage on your attack roll.',
      ability: {
        id: 'rogue-sneak-attack',
        name: 'Sneak Attack',
        description: 'Deal extra damage when you have advantage on your attack roll.',
        type: 'action',
        frequency: 'per_turn',
        roll: {
          dice: '1d6',
          modifier: 0
        }
      }
    },
    {
      level: 2,
      type: 'ability',
      name: 'Cunning Action',
      description: 'You can take a bonus action to Dash, Disengage, or Hide.',
      ability: {
        id: 'rogue-cunning-action',
        name: 'Cunning Action',
        description: 'You can take a bonus action to Dash, Disengage, or Hide.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      level: 3,
      type: 'resource',
      name: 'Focus Pool',
      description: 'You gain the ability to focus your energy for special techniques.',
      resourceDefinition: {
        id: 'focus',
        name: 'Focus',
        description: 'Mental energy used for precise techniques and concentration',
        colorScheme: 'teal-focus',
        icon: 'eye',
        resetCondition: 'encounter_end',
        resetType: 'to_max',
        minValue: 0,
        maxValue: 3
      }
    },
    {
      level: 3,
      type: 'subclass_choice',
      name: 'Roguish Archetype',
      description: 'Choose an archetype that defines your rogue abilities and specialization.',
      availableSubclasses: ['rogue-assassin']
    },
    {
      level: 4,
      type: 'stat_boost',
      name: 'Ability Score Improvement',
      description: 'You can increase one ability score by 2, or two ability scores by 1 each.',
      statBoosts: [
        { attribute: 'dexterity', amount: 2 }
      ]
    }
  ]
};