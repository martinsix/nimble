import { ClassDefinition } from '../../types/class';

export const monk: ClassDefinition = {
  id: 'monk',
  name: 'Monk',
  description: 'A master of martial arts who harnesses inner power to achieve supernatural feats.',
  hitDieSize: 8,
  keyAttributes: ['dexterity', 'will'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Monk Weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'passive_feature',
      name: 'Unarmored Defense',
      description: 'While unarmored, your AC equals 10 + Dex modifier + Will modifier.',
      category: 'combat'
    },
    {
      level: 1,
      type: 'ability',
      name: 'Martial Arts',
      description: 'Your unarmed strikes and monk weapons deal increased damage.',
      ability: {
        id: 'monk-martial-arts',
        name: 'Martial Arts',
        description: 'Make an unarmed strike as a bonus action after attacking.',
        type: 'action',
        frequency: 'at_will',
        roll: {
          dice: '1d4',
          attribute: 'dexterity'
        }
      }
    },
    {
      level: 2,
      type: 'resource',
      name: 'Ki Points',
      description: 'You can harness your inner energy to fuel supernatural abilities.',
      resource: {
        resourceName: 'Ki Points',
        amount: 2,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 2,
      type: 'ability',
      name: 'Flurry of Blows',
      description: 'Spend 1 ki point to make two unarmed strikes as a bonus action.',
      ability: {
        id: 'monk-flurry-of-blows',
        name: 'Flurry of Blows',
        description: 'Spend 1 ki point to make two unarmed strikes as a bonus action.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2,
        roll: {
          dice: '2d4',
          attribute: 'dexterity'
        }
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Deflect Missiles',
      description: 'Use your reaction to deflect or catch ranged attacks.',
      ability: {
        id: 'monk-deflect-missiles',
        name: 'Deflect Missiles',
        description: 'Reduce damage from ranged attacks and potentially throw the projectile back.',
        type: 'action',
        frequency: 'at_will'
      }
    }
  ]
};