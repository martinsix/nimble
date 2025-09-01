import { SpellAbility } from '../../types/abilities';

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