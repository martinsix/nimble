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