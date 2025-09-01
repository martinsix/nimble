import { SpellAbility } from '../../types/abilities';

export const radiantSchoolSpells: SpellAbility[] = [
  // Tier 1 (Cantrips & Low-level spells)
  {
    id: 'sacred-flame',
    name: 'Sacred Flame',
    description: 'Flame-like radiance descends on a creature that you can see. This is a cantrip that requires no mana.',
    type: 'spell',
    school: 'radiant',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 },
      attribute: 'will'
    }
    // No resource cost - cantrip
  },
  {
    id: 'guiding-bolt',
    name: 'Guiding Bolt',
    description: 'A flash of light streaks toward a creature of your choice, dealing radiant damage.',
    type: 'spell',
    school: 'radiant',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 4, sides: 6 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  {
    id: 'cure-wounds',
    name: 'Cure Wounds',
    description: 'A creature you touch regains hit points equal to 1d8 + your spellcasting ability modifier.',
    type: 'spell',
    school: 'radiant',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 },
      attribute: 'will'
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  
  // Tier 2
  {
    id: 'spiritual-weapon',
    name: 'Spiritual Weapon',
    description: 'You create a floating, spectral weapon that can attack enemies.',
    type: 'spell',
    school: 'radiant',
    tier: 2,
    actionCost: 0, // Bonus action
    roll: {
      dice: { count: 1, sides: 8 },
      attribute: 'will'
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 2
    }
  },
  {
    id: 'healing-word',
    name: 'Healing Word',
    description: 'A creature of your choice regains hit points equal to 1d4 + your spellcasting ability modifier.',
    type: 'spell',
    school: 'radiant',
    tier: 2,
    actionCost: 0, // Bonus action
    roll: {
      dice: { count: 1, sides: 4 },
      attribute: 'will'
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 2
    }
  },
  
  // Tier 3
  {
    id: 'daylight',
    name: 'Daylight',
    description: 'A 60-foot-radius sphere of light spreads out from a point you choose within range.',
    type: 'spell',
    school: 'radiant',
    tier: 3,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 3
    }
  },
  
  // Tier 4
  {
    id: 'guardian-of-faith',
    name: 'Guardian of Faith',
    description: 'A Large spectral guardian hovers near you for the duration.',
    type: 'spell',
    school: 'radiant',
    tier: 4,
    actionCost: 1,
    roll: {
      dice: { count: 6, sides: 8 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 4
    }
  },
  
  // Tier 5
  {
    id: 'greater-restoration',
    name: 'Greater Restoration',
    description: 'You imbue a creature you touch with positive energy to undo a debilitating effect.',
    type: 'spell',
    school: 'radiant',
    tier: 5,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 5
    }
  }
];