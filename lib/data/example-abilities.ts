import { ActionAbility } from '../types/abilities';

/**
 * Example spell abilities that consume mana
 * These can be manually added to characters for testing the resource consumption system
 */
export const exampleSpellAbilities: ActionAbility[] = [
  {
    id: 'magic-missile',
    name: 'Magic Missile',
    description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice within range.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 3,
    currentUses: 3,
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
    id: 'healing-word',
    name: 'Healing Word',
    description: 'A creature of your choice regains hit points equal to 1d4 + your spellcasting ability modifier.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 2,
    currentUses: 2,
    actionCost: 0, // Bonus action
    roll: {
      dice: { count: 1, sides: 4 },
      attribute: 'will'
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  {
    id: 'fireball',
    name: 'Fireball',
    description: 'A bright streak flashes from your pointing finger to a point within range and blossoms into a burst of flame.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 1,
    currentUses: 1,
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
  {
    id: 'cure-wounds',
    name: 'Cure Wounds',
    description: 'A creature you touch regains hit points. You can spend additional spell energy to increase the healing.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 5,
    currentUses: 5,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 },
      attribute: 'will'
    },
    resourceCost: {
      type: 'variable',
      resourceId: 'mana',
      minAmount: 1,
      maxAmount: 3
    }
  },
  {
    id: 'eldritch-blast',
    name: 'Eldritch Blast',
    description: 'A beam of crackling energy streaks toward a creature within range. This is a cantrip that requires no mana.',
    type: 'action',
    frequency: 'at_will',
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 10 },
      attribute: 'intelligence'
    }
    // No resource cost - at-will cantrip
  },
  {
    id: 'shield-spell',
    name: 'Shield',
    description: 'An invisible barrier of magical force appears and protects you, granting +5 AC until the start of your next turn.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 4,
    currentUses: 4,
    actionCost: 0, // Reaction
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  }
];

/**
 * Helper function to add these example abilities to a character's ability list
 * This can be used in testing or character creation
 */
export function addExampleSpellsToCharacter(currentAbilities: ActionAbility[], spellIds: string[]): ActionAbility[] {
  const spellsToAdd = exampleSpellAbilities.filter(spell => spellIds.includes(spell.id));
  return [...currentAbilities, ...spellsToAdd];
}

/**
 * Example cleric spells that use divine magic
 */
export const exampleClericSpells: ActionAbility[] = [
  {
    id: 'cure-wounds',
    name: 'Cure Wounds',
    description: 'A creature you touch regains hit points. You can spend additional divine energy to increase the healing.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 5,
    currentUses: 5,
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 },
      attribute: 'will'
    },
    resourceCost: {
      type: 'variable',
      resourceId: 'mana',
      minAmount: 1,
      maxAmount: 3
    }
  },
  {
    id: 'healing-word',
    name: 'Healing Word',
    description: 'A creature of your choice regains hit points equal to 1d4 + your spellcasting ability modifier.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 3,
    currentUses: 3,
    actionCost: 0, // Bonus action
    roll: {
      dice: { count: 1, sides: 4 },
      attribute: 'will'
    },
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  {
    id: 'bless',
    name: 'Bless',
    description: 'You bless up to three creatures of your choice, granting them divine favor.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 2,
    currentUses: 2,
    actionCost: 1,
    resourceCost: {
      type: 'fixed',
      resourceId: 'mana',
      amount: 1
    }
  },
  {
    id: 'spiritual-weapon',
    name: 'Spiritual Weapon',
    description: 'You create a floating, spectral weapon that can attack enemies.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 2,
    currentUses: 2,
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
    id: 'guiding-bolt',
    name: 'Guiding Bolt',
    description: 'A flash of light streaks toward a creature of your choice, dealing radiant damage.',
    type: 'action',
    frequency: 'per_safe_rest',
    maxUses: 3,
    currentUses: 3,
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
    id: 'sacred-flame',
    name: 'Sacred Flame',
    description: 'Flame-like radiance descends on a creature that you can see. This is a cantrip that requires no mana.',
    type: 'action',
    frequency: 'at_will',
    actionCost: 1,
    roll: {
      dice: { count: 1, sides: 8 },
      attribute: 'will'
    }
    // No resource cost - at-will cantrip
  }
];

/**
 * Get all spell abilities that require a specific resource
 */
export function getSpellsByResource(resourceId: string): ActionAbility[] {
  return exampleSpellAbilities.filter(spell => 
    spell.resourceCost?.resourceId === resourceId
  );
}

/**
 * Get cleric spells by resource
 */
export function getClericSpellsByResource(resourceId: string): ActionAbility[] {
  return exampleClericSpells.filter(spell => 
    spell.resourceCost?.resourceId === resourceId
  );
}