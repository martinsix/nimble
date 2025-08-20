import { ClassDefinition } from '../../types/class';

export const dreamweaver: ClassDefinition = {
  id: 'dreamweaver',
  name: 'Dreamweaver',
  description: 'A master of the realm between sleep and waking, who spins nightmares and fantasies into reality.',
  hitDieSize: 6,
  keyAttributes: ['will', 'intelligence'],
  startingHP: 9,
  armorProficiencies: [
    { type: 'cloth' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Dream Manifestations' }
  ],
  features: [
    {
      level: 1,
      type: 'spell_access',
      name: 'Dream Magic',
      description: 'Your spells come from the collective unconscious and shift between reality and illusion.',
      spellAccess: {
        spellLevel: 1,
        spellsKnown: 3,
        cantrips: 2,
        spellList: 'dreamweaver'
      }
    },
    {
      level: 1,
      type: 'ability',
      name: 'Waking Dream',
      description: 'Overlay a dreamscape onto reality, changing the perceived environment for all nearby.',
      ability: {
        id: 'dreamweaver-waking-dream',
        name: 'Waking Dream',
        description: 'Alter the appearance and feel of a 20-foot area, making it match a dream or nightmare.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2
      }
    },
    {
      level: 2,
      type: 'resource',
      name: 'Dream Essence',
      description: 'Harvest the emotional energy from dreams and nightmares to fuel your abilities.',
      resource: {
        resourceName: 'Dream Essence',
        amount: 4,
        rechargeType: 'long_rest'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Nightmare Manifest',
      description: 'Pull a creature\'s deepest fear from their subconscious and make it temporarily real.',
      ability: {
        id: 'dreamweaver-nightmare-manifest',
        name: 'Nightmare Manifest',
        description: 'Manifest a target\'s fear as a semi-real creature that attacks them.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '2d6',
          attribute: 'will'
        }
      }
    },
    {
      level: 4,
      type: 'passive_feature',
      name: 'Lucid Reality',
      description: 'You exist partially in the dream realm, gaining resistance to many physical effects.',
      category: 'utility'
    }
  ]
};