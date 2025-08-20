import { ClassDefinition } from '../../types/class';

export const ranger: ClassDefinition = {
  id: 'ranger',
  name: 'Ranger',
  description: 'A master tracker and survivalist who blends martial prowess with nature magic.',
  hitDieSize: 10,
  keyAttributes: ['dexterity', 'will'],
  startingHP: 13,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' },
    { type: 'mail' },
    { type: 'shields' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' },
    { type: 'dexterity_weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'proficiency',
      name: 'Survival Expertise',
      description: 'You have expertise in tracking, survival, and nature skills.',
      proficiencies: [
        { type: 'skill', name: 'Survival', bonus: 2 },
        { type: 'skill', name: 'Animal Handling', bonus: 2 }
      ]
    },
    {
      level: 1,
      type: 'ability',
      name: 'Favored Enemy',
      description: 'Choose a type of creature you have studied extensively. You have advantage against them.',
      ability: {
        id: 'ranger-favored-enemy',
        name: 'Favored Enemy',
        description: 'Gain advantage on tracking and combat against your chosen enemy type.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      level: 2,
      type: 'spell_access',
      name: 'Ranger Spells',
      description: 'You begin to learn nature magic.',
      spellAccess: {
        spellLevel: 1,
        spellsKnown: 2,
        spellList: 'ranger'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Hunter\'s Mark',
      description: 'Mark a target for additional damage and easier tracking.',
      ability: {
        id: 'ranger-hunters-mark',
        name: 'Hunter\'s Mark',
        description: 'Mark a target for additional damage and easier tracking.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 3,
        currentUses: 3,
        roll: {
          dice: '1d6',
          modifier: 0
        }
      }
    },
    {
      level: 4,
      type: 'stat_boost',
      name: 'Ability Score Improvement',
      description: 'You can increase one ability score by 2, or two ability scores by 1 each.',
      statBoosts: [
        { attribute: 'dexterity', amount: 2 }
      ]
    }
  ]
};