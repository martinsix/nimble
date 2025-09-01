import { SpellAbility } from '../../types/abilities';

export const frostSchoolSpells: SpellAbility[] = [
  // Tier 1
  {
    id: 'frost-bolt',
    name: 'Frost Bolt',
    description: 'A beam of crackling blue energy streaks toward a creature within range, slowing their movement.',
    type: 'spell',
    school: 'frost',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 }
    }
    // No resource cost - cantrip
  },
  {
    id: 'ice-knife',
    name: 'Ice Knife',
    description: 'You create a shard of ice and fling it at one creature within range.',
    type: 'spell',
    school: 'frost',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 10 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  
  // Tier 2
  {
    id: 'ice-storm',
    name: 'Ice Storm',
    description: 'A hail of rock-hard ice pounds to the ground in a 20-foot-radius cylinder.',
    type: 'spell',
    school: 'frost',
    tier: 2,
    actionCost: 1,
    roll: {
      dice: { count: 2, sides: 8 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 2
    }
  },
  
  // Tier 3
  {
    id: 'cone-of-cold',
    name: 'Cone of Cold',
    description: 'A blast of cold air erupts from your hands in a 60-foot cone.',
    type: 'spell',
    school: 'frost',
    tier: 3,
    actionCost: 1,
    roll: {
      dice: { count: 8, sides: 8 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 3
    }
  },
  
  // Tier 4
  {
    id: 'wall-of-ice',
    name: 'Wall of Ice',
    description: 'You create a wall of ice on a solid surface within range.',
    type: 'spell',
    school: 'frost',
    tier: 4,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 4
    }
  }
];