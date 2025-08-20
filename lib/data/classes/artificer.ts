import { ClassDefinition } from '../../types/class';

export const artificer: ClassDefinition = {
  id: 'artificer',
  name: 'Artificer',
  description: 'A magical inventor who infuses mundane items with arcane power through craftsmanship.',
  hitDieSize: 8,
  keyAttributes: ['intelligence', 'dexterity'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' },
    { type: 'mail' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' },
    { type: 'freeform', name: 'Crossbows and Firearms' }
  ],
  features: [
    {
      level: 1,
      type: 'proficiency',
      name: 'Magical Tinkering',
      description: 'You gain proficiency with tinker\'s tools and can imbue objects with minor magical properties.',
      proficiencies: [
        { type: 'tool', name: 'Tinker\'s Tools' },
        { type: 'tool', name: 'Thieves\' Tools' }
      ]
    },
    {
      level: 1,
      type: 'ability',
      name: 'Magical Tinkering',
      description: 'Imbue a tiny object with a minor magical effect.',
      ability: {
        id: 'artificer-magical-tinkering',
        name: 'Magical Tinkering',
        description: 'Imbue a tiny object with a minor magical effect like light, sound, or smell.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 3,
        currentUses: 3
      }
    },
    {
      level: 2,
      type: 'spell_access',
      name: 'Infuse Item',
      description: 'You can infuse mundane items with magical properties.',
      spellAccess: {
        spellLevel: 1,
        spellsKnown: 2,
        spellList: 'artificer'
      }
    },
    {
      level: 3,
      type: 'resource',
      name: 'Magical Inventions',
      description: 'You can create temporary magical devices.',
      resource: {
        resourceName: 'Invention Points',
        amount: 3,
        rechargeType: 'long_rest'
      }
    }
  ]
};