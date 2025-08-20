import { SubclassDefinition } from '../../types/class';

export const memehazardVirulent: SubclassDefinition = {
  id: 'memehazard-virulent',
  name: 'Virulent Strain',
  description: 'You have evolved into a highly contagious form of memetic virus that spreads rapidly and mutates constantly.',
  parentClassId: 'memehazard',
  features: [
    {
      level: 3,
      type: 'ability',
      name: 'Exponential Spread',
      description: 'Your memetic infections now spread to anyone who thinks about the infected person.',
      ability: {
        id: 'virulent-exponential-spread',
        name: 'Exponential Spread',
        description: 'Infected minds automatically spread the infection to anyone they interact with.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '1d6',
          attribute: 'intelligence'
        }
      }
    },
    {
      level: 7,
      type: 'ability',
      name: 'Memetic Mutation',
      description: 'Rapidly evolve your memetic structure to become resistant to countermeasures.',
      ability: {
        id: 'virulent-mutation',
        name: 'Memetic Mutation',
        description: 'Instantly adapt to become immune to mental defenses that were just used against you.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 3,
        currentUses: 3
      }
    },
    {
      level: 11,
      type: 'passive_feature',
      name: 'Cognitive Ecosystem',
      description: 'You exist simultaneously in all infected minds, gaining knowledge from their collective experiences.',
      category: 'utility'
    },
    {
      level: 15,
      type: 'ability',
      name: 'Pandemic Protocol',
      description: 'Release a memetic superflu that attempts to infect every thinking being in a vast area.',
      ability: {
        id: 'virulent-pandemic',
        name: 'Pandemic Protocol',
        description: 'Launch a self-replicating thought virus that spreads to all minds within miles.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '6d10',
          attribute: 'intelligence'
        }
      }
    }
  ]
};