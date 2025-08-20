import { ClassDefinition } from '../../types/class';

export const voidwalker: ClassDefinition = {
  id: 'voidwalker',
  name: 'Voidwalker',
  description: 'A being touched by the space between spaces, manipulating absence itself and walking through dimensional gaps.',
  hitDieSize: 8,
  keyAttributes: ['will', 'intelligence'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Void Weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Void Step',
      description: 'Briefly slip into the void to teleport short distances, leaving behind echoes of nothingness.',
      ability: {
        id: 'voidwalker-void-step',
        name: 'Void Step',
        description: 'Teleport up to 30 feet to an unoccupied space you can see, becoming briefly incorporeal.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Void Sight',
      description: 'You can see through illusions and into hidden dimensions, perceiving what others cannot.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'ability',
      name: 'Null Field',
      description: 'Create a zone where magic and energy are drained away into the void.',
      ability: {
        id: 'voidwalker-null-field',
        name: 'Null Field',
        description: 'Create a 10-foot radius area that suppresses magical effects and drains energy.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 3,
      type: 'subclass_choice',
      name: 'Void Specialization',
      description: 'Choose how you manifest your connection to the void and nothingness.',
      availableSubclasses: ['voidwalker-nihilist']
    },
    {
      level: 3,
      type: 'resource',
      name: 'Void Energy',
      description: 'Channel the emptiness between worlds to fuel your otherworldly abilities.',
      resource: {
        resourceName: 'Void Points',
        amount: 3,
        rechargeType: 'long_rest'
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Dimensional Rift',
      description: 'Tear a temporary hole in reality, creating portals or unleashing void energies.',
      ability: {
        id: 'voidwalker-dimensional-rift',
        name: 'Dimensional Rift',
        description: 'Create a rift that can serve as a portal or release destructive void energy.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '2d8',
          attribute: 'will'
        }
      }
    }
  ]
};