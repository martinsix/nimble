import { ClassDefinition } from '../../types/class';

export const fighter: ClassDefinition = {
  id: 'fighter',
  name: 'Fighter',
  description: 'A master of martial combat, skilled with a variety of weapons and armor.',
  hitDieSize: 10,
  keyAttributes: ['strength', 'dexterity'],
  startingHP: 14,
  armorProficiencies: [
    { type: 'leather' },
    { type: 'mail' },
    { type: 'plate' },
    { type: 'shields' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' },
    { type: 'dexterity_weapons' }
  ],
  saveAdvantages: {
    strength: 'advantage'
  },
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Second Wind',
      description: 'You can use a bonus action to regain hit points equal to 1d10 + your fighter level.',
      ability: {
        id: 'fighter-second-wind',
        name: 'Second Wind',
        description: 'You can use a bonus action to regain hit points equal to 1d10 + your fighter level.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '1d10',
          attribute: 'strength'
        }
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Fighting Style',
      description: 'You adopt a particular style of fighting as your specialty.',
      category: 'combat'
    },
    {
      level: 2,
      type: 'ability',
      name: 'Action Surge',
      description: 'You can push yourself beyond your normal limits. You can take one additional action.',
      ability: {
        id: 'fighter-action-surge',
        name: 'Action Surge',
        description: 'You can push yourself beyond your normal limits. You can take one additional action.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 2,
      type: 'resource',
      name: 'Battlefield Fury',
      description: 'You can channel your combat experience into bursts of tactical fury.',
      resourceDefinition: {
        id: 'battlefield-fury',
        name: 'Battlefield Fury',
        description: 'Combat rage that builds during intense fighting',
        colorScheme: 'red-fury',
        icon: 'fire',
        resetCondition: 'encounter_end',
        resetType: 'to_max',
        minValue: 0,
        maxValue: 2
      }
    },
    {
      level: 4,
      type: 'stat_boost',
      name: 'Ability Score Improvement',
      description: 'You can increase one ability score by 2, or two ability scores by 1 each.',
      statBoosts: [
        { attribute: 'strength', amount: 1 },
        { attribute: 'dexterity', amount: 1 }
      ]
    },
    {
      level: 3,
      type: 'subclass_choice',
      name: 'Martial Archetype',
      description: 'Choose a martial archetype that defines your fighting style and specialization.',
      availableSubclasses: ['fighter-champion', 'fighter-battlemaster']
    },
    {
      level: 3,
      type: 'proficiency',
      name: 'Martial Training',
      description: 'You gain proficiency with martial weapons and heavy armor.',
      proficiencies: [
        { type: 'tool', name: 'Martial Weapons' },
        { type: 'tool', name: 'Heavy Armor' }
      ]
    },
    {
      level: 5,
      type: 'passive_feature',
      name: 'Extra Attack',
      description: 'You can attack twice, instead of once, whenever you take the Attack action.',
      category: 'combat'
    }
  ]
};