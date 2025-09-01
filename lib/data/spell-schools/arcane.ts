import { SpellAbility } from '../../types/abilities';

export const arcaneSchoolSpells: SpellAbility[] = [
  // Tier 1
  {
    id: 'magic-missile',
    name: 'Magic Missile',
    description: 'You create three glowing darts of magical force that automatically hit their targets.',
    type: 'spell',
    school: 'arcane',
    tier: 1,
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
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'An invisible barrier of magical force appears and protects you.',
    type: 'spell',
    school: 'arcane',
    tier: 1,
    actionCost: 0, // Reaction
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  
  // Tier 2
  {
    id: 'misty-step',
    name: 'Misty Step',
    description: 'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space.',
    type: 'spell',
    school: 'arcane',
    tier: 2,
    actionCost: 0, // Bonus action
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 2
    }
  },
  
  // Tier 3
  {
    id: 'counterspell',
    name: 'Counterspell',
    description: 'You attempt to interrupt a creature in the process of casting a spell.',
    type: 'spell',
    school: 'arcane',
    tier: 3,
    actionCost: 0, // Reaction
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 3
    }
  },
  
  // Tier 4
  {
    id: 'dimension-door',
    name: 'Dimension Door',
    description: 'You teleport yourself from your current location to any other spot within range.',
    type: 'spell',
    school: 'arcane',
    tier: 4,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 4
    }
  }
];