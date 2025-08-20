import { ClassDefinition } from '../../types/class';

export const echomancer: ClassDefinition = {
  id: 'echomancer',
  name: 'Echomancer',
  description: 'A manipulator of sound and vibration who can create temporal echoes of actions and experiences.',
  hitDieSize: 8,
  keyAttributes: ['will', 'dexterity'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' }
  ],
  weaponProficiencies: [
    { type: 'dexterity_weapons' },
    { type: 'freeform', name: 'Resonant Weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Action Echo',
      description: 'Create a temporal echo of your last action, allowing you to repeat it with reduced effect.',
      ability: {
        id: 'echomancer-action-echo',
        name: 'Action Echo',
        description: 'Repeat your last action immediately at half effectiveness.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2
      }
    },
    {
      level: 1,
      type: 'proficiency',
      name: 'Sonic Mastery',
      description: 'You can manipulate sound waves and vibrations with supernatural precision.',
      proficiencies: [
        { type: 'skill', name: 'Perception', bonus: 2 },
        { type: 'skill', name: 'Stealth', bonus: 2 }
      ]
    },
    {
      level: 2,
      type: 'resource',
      name: 'Resonance',
      description: 'Build up harmonic resonance that amplifies your sonic abilities.',
      resource: {
        resourceName: 'Resonance Points',
        amount: 3,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Memory Echo',
      description: 'Create an echo of a past event in this location, allowing others to perceive what happened here.',
      ability: {
        id: 'echomancer-memory-echo',
        name: 'Memory Echo',
        description: 'Reveal the sonic imprint of events that occurred in this location up to 24 hours ago.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Shatter Point',
      description: 'Identify and exploit the resonant frequency that can destroy any object or barrier.',
      ability: {
        id: 'echomancer-shatter-point',
        name: 'Shatter Point',
        description: 'Find the exact frequency needed to destroy or disable a target structure or object.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '3d6',
          attribute: 'intelligence'
        }
      }
    }
  ]
};