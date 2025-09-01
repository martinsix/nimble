import { ClassDefinition } from '../../types/class';
import { getSpellSchoolDefinition } from '../spell-schools';

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
  startingEquipment: [
    'mace',
    'scale-mail',
    'shield',
    'light-crossbow',
    'crossbow-bolts',
    'crossbow-bolts',
    'holy-symbol',
    'backpack',
    'bedroll',
    'rations',
    'rations',
    'rations'
  ],
  features: [
    {
      id: 'cleric-radiant-magic',
      level: 1,
      type: 'spell_school',
      name: 'Radiant Magic',
      description: 'You gain access to the Radiant school of magic, wielding divine light.',
      spellSchool: getSpellSchoolDefinition('radiant')!
    },
    {
      id: 'cleric-divine-spellcasting',
      level: 1,
      type: 'spell_tier_access',
      name: 'Divine Spellcasting',
      description: 'You learn to cast divine spells of 1st tier.',
      maxTier: 1
    },
    {
      id: 'cleric-divine-mana',
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
      id: 'cleric-advanced-divine-spellcasting',
      level: 3,
      type: 'spell_tier_access',
      name: 'Advanced Divine Spellcasting',
      description: 'You learn to cast divine spells of 2nd tier.',
      maxTier: 2
    },
    {
      id: 'cleric-divine-domain',
      level: 1,
      type: 'passive_feature',
      name: 'Divine Domain',
      description: 'You choose a domain related to your deity that grants additional spells and features.',
      category: 'utility'
    },
    {
      id: 'cleric-channel-divinity',
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
      id: 'cleric-divine-blessing',
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
      id: 'cleric-asi-4',
      level: 4,
      type: 'stat_boost',
      name: 'Ability Score Improvement',
      description: 'You can increase one ability score by 2, or two ability scores by 1 each.',
      statBoosts: [
        { attribute: 'will', amount: 2 }
      ]
    },
    {
      id: 'cleric-destroy-undead',
      level: 5,
      type: 'passive_feature',
      name: 'Destroy Undead',
      description: 'Your Channel Divinity can destroy undead creatures.',
      category: 'combat'
    }
  ]
};