import { ClassDefinition } from '../../types/class';

export const cleric: ClassDefinition = {
  id: 'cleric',
  name: 'Cleric',
  description: 'A priestly champion who wields divine magic in service of a higher power.',
  hitDieSize: 8,
  keyAttributes: ['will', 'strength'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' },
    { type: 'mail' },
    { type: 'shields' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' }
  ],
  saveAdvantages: {
    will: 'advantage'
  },
  features: [
    {
      level: 1,
      type: 'spell_access',
      name: 'Spellcasting',
      description: 'You can cast cleric spells using your wisdom as your spellcasting ability.',
      spellAccess: {
        spellLevel: 1,
        spellsKnown: 3,
        cantrips: 3,
        spellList: 'cleric'
      }
    },
    {
      level: 1,
      type: 'resource',
      name: 'Divine Mana',
      description: 'You gain a pool of divine energy to power your spells.',
      resourceDefinition: {
        id: 'mana',
        name: 'Mana',
        description: 'Divine energy used to cast spells',
        colorScheme: 'yellow-divine',
        icon: 'sun',
        resetCondition: 'safe_rest',
        resetType: 'to_max',
        minValue: 0,
        maxValue: 4
      }
    },
    {
      level: 1,
      type: 'ability',
      name: 'Sacred Flame',
      description: 'You learn a divine cantrip that requires no mana.',
      ability: {
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
      }
    },
    {
      level: 1,
      type: 'ability',
      name: 'Cure Wounds',
      description: 'You learn to heal wounds with divine magic.',
      ability: {
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
      }
    },
    {
      level: 1,
      type: 'ability',
      name: 'Guiding Bolt',
      description: 'You learn to strike enemies with divine light.',
      ability: {
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
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Divine Domain',
      description: 'You choose a domain related to your deity that grants additional spells and features.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'resource',
      name: 'Channel Divinity',
      description: 'You can channel divine energy to fuel magical effects.',
      resourceDefinition: {
        id: 'channel-divinity',
        name: 'Channel Divinity',
        description: 'Divine power channeled through your connection to your deity',
        colorScheme: 'yellow-divine',
        icon: 'sun',
        resetCondition: 'encounter_end',
        resetType: 'to_max',
        minValue: 0,
        maxValue: 1
      }
    },
    {
      level: 2,
      type: 'ability',
      name: 'Spiritual Weapon',
      description: 'You learn to summon a divine weapon.',
      ability: {
        id: 'spiritual-weapon',
        name: 'Spiritual Weapon',
        description: 'You create a floating, spectral weapon that can attack enemies.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 2,
        currentUses: 2,
        actionCost: 0,
        roll: {
          dice: { count: 1, sides: 8 },
          attribute: 'will'
        },
        resourceCost: {
          type: 'fixed',
          resourceId: 'mana',
          amount: 2
        }
      }
    },
    {
      level: 3,
      type: 'resource',
      name: 'Divine Blessing',
      description: 'You gain divine blessings that can aid you and your allies.',
      resourceDefinition: {
        id: 'divine-blessing',
        name: 'Divine Blessing',
        description: 'Sacred blessings granted by your deity for special occasions',
        colorScheme: 'yellow-divine',
        icon: 'star',
        resetCondition: 'safe_rest',
        resetType: 'to_max',
        minValue: 0,
        maxValue: 3
      }
    },
    {
      level: 4,
      type: 'stat_boost',
      name: 'Ability Score Improvement',
      description: 'You can increase one ability score by 2, or two ability scores by 1 each.',
      statBoosts: [
        { attribute: 'will', amount: 2 }
      ]
    },
    {
      level: 5,
      type: 'passive_feature',
      name: 'Destroy Undead',
      description: 'Your Channel Divinity can destroy undead creatures.',
      category: 'combat'
    }
  ]
};