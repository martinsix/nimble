import { ClassDefinition } from '../../types/class';

export const bard: ClassDefinition = {
  id: 'bard',
  name: 'Bard',
  description: 'A master performer whose magic flows through music, stories, and artistic expression.',
  hitDieSize: 8,
  keyAttributes: ['will', 'dexterity'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' },
    { type: 'dexterity_weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'spell_access',
      name: 'Spellcasting',
      description: 'You cast spells through performance and artistic expression.',
      spellAccess: {
        spellLevel: 1,
        spellsKnown: 4,
        cantrips: 2,
        spellList: 'bard'
      }
    },
    {
      level: 1,
      type: 'resource',
      name: 'Bardic Inspiration',
      description: 'You can inspire others through stirring words or music.',
      resource: {
        resourceName: 'Bardic Inspiration',
        amount: 3,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 2,
      type: 'proficiency',
      name: 'Jack of All Trades',
      description: 'You gain half proficiency bonus to any ability check that doesn\'t use your proficiency.',
      proficiencies: [
        { type: 'skill', name: 'All Skills', bonus: 1 }
      ]
    },
    {
      level: 3,
      type: 'passive_feature',
      name: 'Expertise',
      description: 'Choose two skills. Your proficiency bonus is doubled for those skills.',
      category: 'utility'
    }
  ]
};