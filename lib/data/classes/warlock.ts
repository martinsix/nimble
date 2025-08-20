import { ClassDefinition } from '../../types/class';

export const warlock: ClassDefinition = {
  id: 'warlock',
  name: 'Warlock',
  description: 'A wielder of dark magic who has made a pact with an otherworldly patron.',
  hitDieSize: 8,
  keyAttributes: ['will', 'intelligence'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'leather' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' }
  ],
  features: [
    {
      level: 1,
      type: 'spell_access',
      name: 'Pact Magic',
      description: 'Your magic comes from your otherworldly patron.',
      spellAccess: {
        spellLevel: 1,
        spellsKnown: 2,
        cantrips: 2,
        spellList: 'warlock'
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Otherworldly Patron',
      description: 'You have made a pact with a being from another plane of existence.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'ability',
      name: 'Eldritch Invocations',
      description: 'Your patron grants you magical knowledge in the form of eldritch invocations.',
      ability: {
        id: 'warlock-eldritch-blast',
        name: 'Eldritch Blast',
        description: 'A crackling beam of energy that grows stronger as you level.',
        type: 'action',
        frequency: 'at_will',
        roll: {
          dice: '1d10',
          attribute: 'will'
        }
      }
    },
    {
      level: 3,
      type: 'resource',
      name: 'Pact Boon',
      description: 'Your patron bestows a gift to aid you in your service.',
      resource: {
        resourceName: 'Pact Slots',
        amount: 2,
        rechargeType: 'short_rest'
      }
    }
  ]
};