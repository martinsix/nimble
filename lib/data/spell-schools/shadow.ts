import { SpellAbility } from '../../types/abilities';

export const shadowSchoolSpells: SpellAbility[] = [
  // Tier 0 (Cantrips)
  {
    id: 'chill-touch',
    name: 'Chill Touch',
    description: 'You create a ghostly, skeletal hand in the space of a creature within range.',
    type: 'spell',
    school: 'shadow',
    tier: 0,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 }
    }
    // No resource cost - cantrip
  },
  
  // Tier 1
  {
    id: 'inflict-wounds',
    name: 'Inflict Wounds',
    description: 'You channel negative energy through your touch to deal necrotic damage.',
    type: 'spell',
    school: 'shadow',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 3, sides: 10 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  
  // Tier 2
  {
    id: 'darkness',
    name: 'Darkness',
    description: 'Magical darkness spreads from a point you choose within range.',
    type: 'spell',
    school: 'shadow',
    tier: 2,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 2
    }
  },
  
  // Tier 3
  {
    id: 'vampiric-touch',
    name: 'Vampiric Touch',
    description: 'The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds.',
    type: 'spell',
    school: 'shadow',
    tier: 3,
    actionCost: 1,
    roll: {
      dice: { count: 3, sides: 6 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 3
    }
  }
];