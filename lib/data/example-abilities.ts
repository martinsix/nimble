import { SpellAbility } from '../types/abilities';

/**
 * Fire School Spells (Wizard)
 */
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

/**
 * Radiant School Spells (Cleric)
 */
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

/**
 * Frost School Spells
 */
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

/**
 * Nature School Spells
 */
export const natureSchoolSpells: SpellAbility[] = [
  // Tier 1
  {
    id: 'thorn-whip',
    name: 'Thorn Whip',
    description: 'You create a long, vine-like whip covered in thorns that lashes out at your command.',
    type: 'spell',
    school: 'nature',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 6 }
    }
    // No resource cost - cantrip
  },
  {
    id: 'entangle',
    name: 'Entangle',
    description: 'Grasping weeds and vines sprout from the ground to slow creatures in the area.',
    type: 'spell',
    school: 'nature',
    tier: 1,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  
  // Tier 2
  {
    id: 'barkskin',
    name: 'Barkskin',
    description: 'You touch a willing creature and grant them natural armor.',
    type: 'spell',
    school: 'nature',
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
    id: 'call-lightning',
    name: 'Call Lightning',
    description: 'A storm cloud appears in the shape of a cylinder and calls down bolts of lightning.',
    type: 'spell',
    school: 'nature',
    tier: 3,
    actionCost: 1,
    roll: {
      dice: { count: 3, sides: 10 }
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 3
    }
  }
];

/**
 * Shadow School Spells
 */
export const shadowSchoolSpells: SpellAbility[] = [
  // Tier 1
  {
    id: 'chill-touch',
    name: 'Chill Touch',
    description: 'You create a ghostly, skeletal hand in the space of a creature within range.',
    type: 'spell',
    school: 'shadow',
    tier: 1,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 }
    }
    // No resource cost - cantrip
  },
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

/**
 * Arcane School Spells
 */
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


/**
 * Get spells from a specific school
 */
export function getSpellsBySchool(schoolId: string): SpellAbility[] {
  switch (schoolId) {
    case 'fire':
      return fireSchoolSpells;
    case 'radiant':
      return radiantSchoolSpells;
    case 'frost':
      return frostSchoolSpells;
    case 'nature':
      return natureSchoolSpells;
    case 'shadow':
      return shadowSchoolSpells;
    case 'arcane':
      return arcaneSchoolSpells;
    default:
      return [];
  }
}

/**
 * Get all available spell schools
 */
export function getAllSpellSchools(): { id: string; name: string; spells: SpellAbility[] }[] {
  return [
    { id: 'fire', name: 'Fire Magic', spells: fireSchoolSpells },
    { id: 'radiant', name: 'Radiant Magic', spells: radiantSchoolSpells },
    { id: 'frost', name: 'Frost Magic', spells: frostSchoolSpells },
    { id: 'nature', name: 'Nature Magic', spells: natureSchoolSpells },
    { id: 'shadow', name: 'Shadow Magic', spells: shadowSchoolSpells },
    { id: 'arcane', name: 'Arcane Magic', spells: arcaneSchoolSpells }
  ];
}