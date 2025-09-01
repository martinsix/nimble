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
      id: 'fighter-second-wind',
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
          dice: { count: 1, sides: 10 },
          attribute: 'strength'
        }
      }
    },
    {
      id: 'fighter-fighting-style',
      level: 1,
      type: 'passive_feature',
      name: 'Fighting Style',
      description: 'You adopt a particular style of fighting as your specialty.',
      category: 'combat'
    },
    {
      id: 'fighter-action-surge',
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
      id: 'fighter-battlefield-fury',
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
      id: 'fighter-asi-4',
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
      id: 'fighter-martial-archetype',
      level: 3,
      type: 'subclass_choice',
      name: 'Martial Archetype',
      description: 'Choose a martial archetype that defines your fighting style and specialization.',
      availableSubclasses: ['fighter-champion', 'fighter-battlemaster']
    },
    {
      id: 'fighter-martial-training',
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
      id: 'fighter-extra-attack',
      level: 5,
      type: 'passive_feature',
      name: 'Extra Attack',
      description: 'You can attack twice, instead of once, whenever you take the Attack action.',
      category: 'combat'
    },
    {
      id: 'fighter-combat-maneuvers-3',
      level: 3,
      type: 'pick_feature_from_pool',
      name: 'Learn Combat Maneuvers',
      description: 'You learn 2 combat maneuvers of your choice from the Fighter Combat Maneuvers pool.',
      poolId: 'fighter-combat-maneuvers',
      choicesAllowed: 2
    },
    {
      id: 'fighter-additional-maneuvers-6',
      level: 6,
      type: 'pick_feature_from_pool',
      name: 'Additional Combat Maneuvers',
      description: 'You learn 1 additional combat maneuver of your choice.',
      poolId: 'fighter-combat-maneuvers',
      choicesAllowed: 1
    },
    {
      id: 'fighter-master-maneuvers-10',
      level: 10,
      type: 'pick_feature_from_pool',
      name: 'Master Combat Techniques',
      description: 'You learn 2 additional combat maneuvers, expanding your tactical repertoire.',
      poolId: 'fighter-combat-maneuvers',
      choicesAllowed: 2
    }
  ],
  featurePools: [
    {
      id: 'fighter-combat-maneuvers',
      name: 'Combat Maneuvers',
      description: 'Tactical combat techniques that leverage battlefield positioning and timing to gain advantages over opponents.',
      features: [
        {
          id: 'fighter-maneuver-trip-attack',
          level: 3,
          type: 'ability',
          name: 'Trip Attack',
          description: 'When you hit a creature with a weapon attack, you can attempt to knock the target down.',
          ability: {
            id: 'trip-attack',
            name: 'Trip Attack',
            description: 'Expend a superiority die to attempt to trip your target. Target must make a Strength saving throw or be knocked prone.',
            type: 'action',
            frequency: 'per_encounter',
            maxUses: 3,
            currentUses: 3,
            roll: {
              dice: { count: 1, sides: 8 },
              attribute: 'strength'
            }
          }
        },
        {
          id: 'fighter-maneuver-precision-attack',
          level: 3,
          type: 'ability',
          name: 'Precision Attack',
          description: 'When you make a weapon attack roll, you can add a superiority die to the roll.',
          ability: {
            id: 'precision-attack',
            name: 'Precision Attack',
            description: 'Add a superiority die to your attack roll to improve accuracy.',
            type: 'action',
            frequency: 'per_encounter',
            maxUses: 3,
            currentUses: 3,
            roll: {
              dice: { count: 1, sides: 8 },
              modifier: 0
            }
          }
        },
        {
          id: 'fighter-maneuver-parry',
          level: 3,
          type: 'ability',
          name: 'Parry',
          description: 'When another creature damages you with a melee attack, you can reduce the damage by using your reaction.',
          ability: {
            id: 'parry',
            name: 'Parry',
            description: 'Use your reaction and a superiority die to reduce incoming melee damage.',
            type: 'action',
            frequency: 'per_encounter',
            maxUses: 3,
            currentUses: 3,
            roll: {
              dice: { count: 1, sides: 8 },
              attribute: 'dexterity'
            }
          }
        },
        {
          id: 'fighter-maneuver-riposte',
          level: 3,
          type: 'ability',
          name: 'Riposte',
          description: 'When a creature misses you with a melee attack, you can use your reaction to make a melee weapon attack.',
          ability: {
            id: 'riposte',
            name: 'Riposte',
            description: 'Counterattack after an enemy misses you. Add superiority die to damage.',
            type: 'action',
            frequency: 'per_encounter',
            maxUses: 3,
            currentUses: 3,
            roll: {
              dice: { count: 1, sides: 8 },
              attribute: 'strength'
            }
          }
        },
        {
          id: 'fighter-maneuver-disarming-attack',
          level: 3,
          type: 'ability',
          name: 'Disarming Attack',
          description: 'When you hit a creature with a weapon attack, you can attempt to disarm the target.',
          ability: {
            id: 'disarming-attack',
            name: 'Disarming Attack',
            description: 'Force target to drop one item. Target makes Strength saving throw or drops a held object.',
            type: 'action',
            frequency: 'per_encounter',
            maxUses: 3,
            currentUses: 3,
            roll: {
              dice: { count: 1, sides: 8 },
              attribute: 'strength'
            }
          }
        },
        {
          id: 'fighter-maneuver-pushing-attack',
          level: 3,
          type: 'ability',
          name: 'Pushing Attack',
          description: 'When you hit a creature with a weapon attack, you can attempt to drive the target back.',
          ability: {
            id: 'pushing-attack',
            name: 'Pushing Attack',
            description: 'Push target up to 15 feet away. Large or smaller creatures make Strength save or be pushed.',
            type: 'action',
            frequency: 'per_encounter',
            maxUses: 3,
            currentUses: 3,
            roll: {
              dice: { count: 1, sides: 8 },
              attribute: 'strength'
            }
          }
        }
      ]
    }
  ]
};