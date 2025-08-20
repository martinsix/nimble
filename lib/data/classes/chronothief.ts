import { ClassDefinition } from '../../types/class';

export const chronothief: ClassDefinition = {
  id: 'chronothief',
  name: 'Chronothief',
  description: 'A temporal manipulator who steals moments from time itself, hoarding seconds and minutes like a traditional thief hoards gold.',
  hitDieSize: 6,
  keyAttributes: ['dexterity', 'intelligence'],
  startingHP: 9,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' }
  ],
  weaponProficiencies: [
    { type: 'dexterity_weapons' },
    { type: 'freeform', name: 'Temporal Weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'resource',
      name: 'Stolen Time',
      description: 'You accumulate stolen moments that can be spent to manipulate the flow of time.',
      resource: {
        resourceName: 'Time Fragments',
        amount: 3,
        rechargeType: 'long_rest'
      }
    },
    {
      level: 1,
      type: 'ability',
      name: 'Temporal Pocket',
      description: 'Steal a moment from an opponent, briefly slowing their actions while quickening your own.',
      ability: {
        id: 'chronothief-temporal-pocket',
        name: 'Temporal Pocket',
        description: 'Steal initiative from a target, gaining an extra action while they lose one.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2
      }
    },
    {
      level: 2,
      type: 'ability',
      name: 'Rewind',
      description: 'Briefly reverse time to undo the last few seconds, allowing you to retry a failed action.',
      ability: {
        id: 'chronothief-rewind',
        name: 'Rewind',
        description: 'Reverse the last action taken, allowing for a retry with advantage.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 3,
      type: 'passive_feature',
      name: 'Temporal Awareness',
      description: 'Your perception of time grants you supernatural reflexes and the ability to act in stopped time.',
      category: 'combat'
    },
    {
      level: 4,
      type: 'ability',
      name: 'Time Trap',
      description: 'Create a temporal snare that freezes anything that enters it in a bubble of stopped time.',
      ability: {
        id: 'chronothief-time-trap',
        name: 'Time Trap',
        description: 'Create a 5-foot cube of frozen time that traps anything entering it.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    }
  ]
};