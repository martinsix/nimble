import { ClassDefinition } from '../../types/class';

export const werewolf: ClassDefinition = {
  id: 'werewolf',
  name: 'Werewolf',
  description: 'A lycanthrope who balances their human nature with a bestial wolf form, gaining power from both civilization and wilderness.',
  hitDieSize: 10,
  keyAttributes: ['strength', 'will'],
  startingHP: 13,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' },
    { type: 'freeform', name: 'Natural Weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Lupine Transformation',
      description: 'Shift between human and wolf forms, gaining different abilities based on your current form.',
      ability: {
        id: 'werewolf-transformation',
        name: 'Lupine Transformation',
        description: 'Transform between human, hybrid, and wolf forms. Each form grants different bonuses and abilities.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 3,
        currentUses: 3
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Enhanced Senses',
      description: 'Your supernatural senses allow you to track by scent and detect hidden enemies.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'resource',
      name: 'Lunar Rage',
      description: 'Channel the moon\'s power to fuel your lycanthropic abilities and transformations.',
      resource: {
        resourceName: 'Rage Points',
        amount: 2,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 2,
      type: 'ability',
      name: 'Pack Hunter',
      description: 'Call upon the spirit of the pack to coordinate attacks with allies or summon spectral wolves.',
      ability: {
        id: 'werewolf-pack-hunter',
        name: 'Pack Hunter',
        description: 'Grant yourself and nearby allies pack tactics, or summon a spectral wolf companion.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Feral Instincts',
      description: 'In moments of danger, your beast nature takes over, granting supernatural reflexes and savagery.',
      ability: {
        id: 'werewolf-feral-instincts',
        name: 'Feral Instincts',
        description: 'Enter a feral state that enhances your combat abilities and grants damage resistance.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Howl of the Moon',
      description: 'Release a supernatural howl that can terrify enemies, call distant allies, or invoke lunar power.',
      ability: {
        id: 'werewolf-howl',
        name: 'Howl of the Moon',
        description: 'A powerful howl that can fear enemies, boost allies, or draw upon lunar energies.',
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