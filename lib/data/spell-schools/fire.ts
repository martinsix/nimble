import { SpellAbility } from '../../types/abilities';

export const fireSchoolSpells: SpellAbility[] = [
  // Tier 1 (Cantrips & Low-level spells)
  {
    id: 'fire-bolt',
    name: 'Fire Bolt',
    description: 'You hurl a mote of fire at a creature or object within range. This is a cantrip that requires no mana.',
    type: 'spell',
    school: 'fire',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 10 }
    }
    // No resource cost - cantrip
  },
  {
    id: 'burning-hands',
    name: 'Burning Hands',
    description: 'A thin sheet of flames shoots forth from your outstretched fingertips.',
    type: 'spell',
    school: 'fire',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 3, sides: 6 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  
  // Tier 2
  {
    id: 'scorching-ray',
    name: 'Scorching Ray',
    description: 'You create three rays of fire and hurl them at targets within range.',
    type: 'spell',
    school: 'fire',
    tier: 2,
    actionCost: 1,
    roll: {
      dice: { count: 2, sides: 6 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 2
    }
  },
  {
    id: 'flame-sphere',
    name: 'Flame Sphere',
    description: 'A 5-foot-diameter sphere of fire appears and rolls across the battlefield.',
    type: 'spell',
    school: 'fire',
    tier: 2,
    actionCost: 1,
    roll: {
      dice: { count: 2, sides: 6 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 2
    }
  },
  
  // Tier 3
  {
    id: 'fireball',
    name: 'Fireball',
    description: 'A bright streak flashes from your pointing finger to a point within range and blossoms into a burst of flame.',
    type: 'spell',
    school: 'fire',
    tier: 3,
    actionCost: 1,
    roll: {
      dice: { count: 8, sides: 6 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 3
    }
  },
  
  // Tier 4
  {
    id: 'fire-shield',
    name: 'Fire Shield',
    description: 'Thin and wispy flames wreathe your body, providing protection and dealing fire damage to attackers.',
    type: 'spell',
    school: 'fire',
    tier: 4,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 4
    }
  },
  
  // Tier 5
  {
    id: 'wall-of-fire',
    name: 'Wall of Fire',
    description: 'You create a wall of fire on a solid surface within range.',
    type: 'spell',
    school: 'fire',
    tier: 5,
    actionCost: 1,
    roll: {
      dice: { count: 5, sides: 8 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 5
    }
  },
  
  // Tier 6
  {
    id: 'flame-strike',
    name: 'Flame Strike',
    description: 'A vertical column of divine fire roars down from the heavens in a location you specify.',
    type: 'spell',
    school: 'fire',
    tier: 6,
    actionCost: 1,
    roll: {
      dice: { count: 4, sides: 6 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 6
    }
  }
];