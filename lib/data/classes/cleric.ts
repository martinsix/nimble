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
      resource: {
        resourceName: 'Channel Divinity',
        amount: 1,
        rechargeType: 'short_rest'
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