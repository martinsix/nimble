import { ClassDefinition } from '../types/class';

// Sample class definitions for the Nimble RPG system
export const classDefinitions: Record<string, ClassDefinition> = {
  fighter: {
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
  },

  wizard: {
    id: 'wizard',
    name: 'Wizard',
    description: 'A scholarly magic-user capable of manipulating the structures of spellcasting.',
    hitDieSize: 6,
    keyAttributes: ['intelligence', 'will'],
    startingHP: 8,
    armorProficiencies: [
      { type: 'cloth' }
    ],
    weaponProficiencies: [
      { type: 'freeform', name: 'Staves and Wands' }
    ],
    features: [
      {
        level: 1,
        type: 'spell_access',
        name: 'Cantrips',
        description: 'You know three cantrips of your choice from the wizard spell list.',
        spellAccess: {
          spellLevel: 0,
          cantrips: 3,
          spellList: 'wizard'
        }
      },
      {
        level: 1,
        type: 'spell_access',
        name: 'Spellcasting',
        description: 'You have learned to cast spells through study and preparation.',
        spellAccess: {
          spellLevel: 1,
          spellsKnown: 6,
          spellList: 'wizard'
        }
      },
      {
        level: 1,
        type: 'ability',
        name: 'Ritual Casting',
        description: 'You can cast a spell as a ritual if that spell has the ritual tag.',
        ability: {
          id: 'wizard-ritual-casting',
          name: 'Ritual Casting',
          description: 'You can cast a spell as a ritual if that spell has the ritual tag.',
          type: 'action',
          frequency: 'at_will'
        }
      },
      {
        level: 2,
        type: 'resource',
        name: 'Arcane Recovery',
        description: 'You can recover some of your magical energy by studying your spellbook.',
        resource: {
          resourceName: 'Spell Slots',
          amount: 2,
          rechargeType: 'long_rest'
        }
      },
      {
        level: 4,
        type: 'stat_boost',
        name: 'Ability Score Improvement',
        description: 'You can increase one ability score by 2, or two ability scores by 1 each.',
        statBoosts: [
          { attribute: 'intelligence', amount: 2 }
        ]
      }
    ]
  },

  rogue: {
    id: 'rogue',
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles.',
    hitDieSize: 8,
    keyAttributes: ['dexterity', 'intelligence'],
    startingHP: 11,
    armorProficiencies: [
      { type: 'cloth' },
      { type: 'leather' }
    ],
    weaponProficiencies: [
      { type: 'dexterity_weapons' }
    ],
    features: [
      {
        level: 1,
        type: 'proficiency',
        name: 'Expertise',
        description: 'Choose two skills in which you have proficiency. Your proficiency bonus is doubled for those skills.',
        proficiencies: [
          { type: 'skill', name: 'Stealth', bonus: 2 },
          { type: 'skill', name: 'Sleight of Hand', bonus: 2 }
        ]
      },
      {
        level: 1,
        type: 'ability',
        name: 'Sneak Attack',
        description: 'Deal extra damage when you have advantage on your attack roll.',
        ability: {
          id: 'rogue-sneak-attack',
          name: 'Sneak Attack',
          description: 'Deal extra damage when you have advantage on your attack roll.',
          type: 'action',
          frequency: 'per_turn',
          roll: {
            dice: '1d6',
            modifier: 0
          }
        }
      },
      {
        level: 2,
        type: 'ability',
        name: 'Cunning Action',
        description: 'You can take a bonus action to Dash, Disengage, or Hide.',
        ability: {
          id: 'rogue-cunning-action',
          name: 'Cunning Action',
          description: 'You can take a bonus action to Dash, Disengage, or Hide.',
          type: 'action',
          frequency: 'at_will'
        }
      },
      {
        level: 3,
        type: 'passive_feature',
        name: 'Roguish Archetype',
        description: 'You choose an archetype that defines your rogue abilities.',
        category: 'utility'
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
  },

  cleric: {
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
  }
};

// Helper function to get a class definition by ID
export function getClassDefinition(classId: string): ClassDefinition | null {
  return classDefinitions[classId] || null;
}

// Helper function to get all available classes
export function getAllClasses(): ClassDefinition[] {
  return Object.values(classDefinitions);
}

// Helper function to get features for a specific class and level
export function getClassFeaturesForLevel(classId: string, level: number): ClassDefinition['features'] {
  const classDef = getClassDefinition(classId);
  if (!classDef) return [];
  
  return classDef.features.filter(feature => feature.level === level);
}

// Helper function to get all features up to a specific level
export function getAllClassFeaturesUpToLevel(classId: string, level: number): ClassDefinition['features'] {
  const classDef = getClassDefinition(classId);
  if (!classDef) return [];
  
  return classDef.features.filter(feature => feature.level <= level);
}