import { ClassDefinition } from '../../types/class';

export const memehazard: ClassDefinition = {
  id: 'memehazard',
  name: 'Memehazard',
  description: 'A living viral idea that spreads through minds, existing as both concept and entity. You are simultaneously a person and an infectious meme.',
  hitDieSize: 6,
  keyAttributes: ['intelligence', 'will'],
  startingHP: 9,
  armorProficiencies: [
    { type: 'freeform', name: 'Conceptual Barriers' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Viral Thoughts' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Cognitive Infection',
      description: 'Implant a harmful idea into someone\'s mind that spreads to others who think about it.',
      ability: {
        id: 'memehazard-cognitive-infection',
        name: 'Cognitive Infection',
        description: 'Plant a memetic virus that damages minds and can jump between hosts who discuss it.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2,
        roll: {
          dice: '1d8',
          attribute: 'intelligence'
        }
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Idea-Form',
      description: 'You exist partially as a concept, making you resistant to physical damage but vulnerable to forgetting.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'resource',
      name: 'Viral Potency',
      description: 'Accumulate memetic energy from minds you\'ve infected to fuel stronger cognitive attacks.',
      resource: {
        resourceName: 'Meme Points',
        amount: 3,
        rechargeType: 'long_rest'
      }
    },
    {
      level: 3,
      type: 'subclass_choice',
      name: 'Memetic Evolution',
      description: 'Choose how your memetic structure evolves and adapts to spread more effectively.',
      availableSubclasses: ['memehazard-virulent']
    },
    {
      level: 3,
      type: 'ability',
      name: 'Reality Glitch',
      description: 'Cause a localized breakdown in logical consistency, making impossible things briefly possible.',
      ability: {
        id: 'memehazard-reality-glitch',
        name: 'Reality Glitch',
        description: 'Create a zone where contradictory statements can both be true simultaneously.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Basilisk Protocol',
      description: 'Become a thought so dangerous that merely perceiving you causes psychological damage.',
      ability: {
        id: 'memehazard-basilisk-protocol',
        name: 'Basilisk Protocol',
        description: 'Transform into a cognitohazardous entity that harms anyone who looks at or thinks about you.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '3d6',
          attribute: 'will'
        }
      }
    }
  ]
};