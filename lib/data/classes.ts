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
  },

  ranger: {
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
  },

  artificer: {
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
  },

  monk: {
    id: 'monk',
    name: 'Monk',
    description: 'A master of martial arts who harnesses inner power to achieve supernatural feats.',
    hitDieSize: 8,
    keyAttributes: ['dexterity', 'will'],
    startingHP: 11,
    armorProficiencies: [
      { type: 'cloth' }
    ],
    weaponProficiencies: [
      { type: 'freeform', name: 'Monk Weapons' }
    ],
    features: [
      {
        level: 1,
        type: 'passive_feature',
        name: 'Unarmored Defense',
        description: 'While unarmored, your AC equals 10 + Dex modifier + Will modifier.',
        category: 'combat'
      },
      {
        level: 1,
        type: 'ability',
        name: 'Martial Arts',
        description: 'Your unarmed strikes and monk weapons deal increased damage.',
        ability: {
          id: 'monk-martial-arts',
          name: 'Martial Arts',
          description: 'Make an unarmed strike as a bonus action after attacking.',
          type: 'action',
          frequency: 'at_will',
          roll: {
            dice: '1d4',
            attribute: 'dexterity'
          }
        }
      },
      {
        level: 2,
        type: 'resource',
        name: 'Ki Points',
        description: 'You can harness your inner energy to fuel supernatural abilities.',
        resource: {
          resourceName: 'Ki Points',
          amount: 2,
          rechargeType: 'short_rest'
        }
      },
      {
        level: 2,
        type: 'ability',
        name: 'Flurry of Blows',
        description: 'Spend 1 ki point to make two unarmed strikes as a bonus action.',
        ability: {
          id: 'monk-flurry-of-blows',
          name: 'Flurry of Blows',
          description: 'Spend 1 ki point to make two unarmed strikes as a bonus action.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 2,
          currentUses: 2,
          roll: {
            dice: '2d4',
            attribute: 'dexterity'
          }
        }
      },
      {
        level: 3,
        type: 'ability',
        name: 'Deflect Missiles',
        description: 'Use your reaction to deflect or catch ranged attacks.',
        ability: {
          id: 'monk-deflect-missiles',
          name: 'Deflect Missiles',
          description: 'Reduce damage from ranged attacks and potentially throw the projectile back.',
          type: 'action',
          frequency: 'at_will'
        }
      }
    ]
  },

  warlock: {
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
  },

  bard: {
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
  },

  voidwalker: {
    id: 'voidwalker',
    name: 'Voidwalker',
    description: 'A being touched by the space between spaces, manipulating absence itself and walking through dimensional gaps.',
    hitDieSize: 8,
    keyAttributes: ['will', 'intelligence'],
    startingHP: 11,
    armorProficiencies: [
      { type: 'cloth' }
    ],
    weaponProficiencies: [
      { type: 'freeform', name: 'Void Weapons' }
    ],
    features: [
      {
        level: 1,
        type: 'ability',
        name: 'Void Step',
        description: 'Briefly slip into the void to teleport short distances, leaving behind echoes of nothingness.',
        ability: {
          id: 'voidwalker-void-step',
          name: 'Void Step',
          description: 'Teleport up to 30 feet to an unoccupied space you can see, becoming briefly incorporeal.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 2,
          currentUses: 2
        }
      },
      {
        level: 1,
        type: 'passive_feature',
        name: 'Void Sight',
        description: 'You can see through illusions and into hidden dimensions, perceiving what others cannot.',
        category: 'utility'
      },
      {
        level: 2,
        type: 'ability',
        name: 'Null Field',
        description: 'Create a zone where magic and energy are drained away into the void.',
        ability: {
          id: 'voidwalker-null-field',
          name: 'Null Field',
          description: 'Create a 10-foot radius area that suppresses magical effects and drains energy.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1
        }
      },
      {
        level: 3,
        type: 'resource',
        name: 'Void Energy',
        description: 'Channel the emptiness between worlds to fuel your otherworldly abilities.',
        resource: {
          resourceName: 'Void Points',
          amount: 3,
          rechargeType: 'long_rest'
        }
      },
      {
        level: 4,
        type: 'ability',
        name: 'Dimensional Rift',
        description: 'Tear a temporary hole in reality, creating portals or unleashing void energies.',
        ability: {
          id: 'voidwalker-dimensional-rift',
          name: 'Dimensional Rift',
          description: 'Create a rift that can serve as a portal or release destructive void energy.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1,
          roll: {
            dice: '2d8',
            attribute: 'will'
          }
        }
      }
    ]
  },

  chronothief: {
    id: 'chronothief',
    name: 'Chronothief',
    description: 'A temporal manipulator who steals moments from time itself, hoarding seconds and minutes like a traditional thief hoards gold.',
    hitDieSize: 6,
    keyAttributes: ['dexterity', 'intelligence'],
    startingHP: 9,
    armorProficiencies: [
      { type: 'cloth' },
      { type: 'leather' }
    ],
    weaponProficiencies: [
      { type: 'dexterity_weapons' },
      { type: 'freeform', name: 'Temporal Weapons' }
    ],
    features: [
      {
        level: 1,
        type: 'resource',
        name: 'Stolen Time',
        description: 'You accumulate stolen moments that can be spent to manipulate the flow of time.',
        resource: {
          resourceName: 'Time Fragments',
          amount: 3,
          rechargeType: 'long_rest'
        }
      },
      {
        level: 1,
        type: 'ability',
        name: 'Temporal Pocket',
        description: 'Steal a moment from an opponent, briefly slowing their actions while quickening your own.',
        ability: {
          id: 'chronothief-temporal-pocket',
          name: 'Temporal Pocket',
          description: 'Steal initiative from a target, gaining an extra action while they lose one.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 2,
          currentUses: 2
        }
      },
      {
        level: 2,
        type: 'ability',
        name: 'Rewind',
        description: 'Briefly reverse time to undo the last few seconds, allowing you to retry a failed action.',
        ability: {
          id: 'chronothief-rewind',
          name: 'Rewind',
          description: 'Reverse the last action taken, allowing for a retry with advantage.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1
        }
      },
      {
        level: 3,
        type: 'passive_feature',
        name: 'Temporal Awareness',
        description: 'Your perception of time grants you supernatural reflexes and the ability to act in stopped time.',
        category: 'combat'
      },
      {
        level: 4,
        type: 'ability',
        name: 'Time Trap',
        description: 'Create a temporal snare that freezes anything that enters it in a bubble of stopped time.',
        ability: {
          id: 'chronothief-time-trap',
          name: 'Time Trap',
          description: 'Create a 5-foot cube of frozen time that traps anything entering it.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1
        }
      }
    ]
  },

  dreamweaver: {
    id: 'dreamweaver',
    name: 'Dreamweaver',
    description: 'A master of the realm between sleep and waking, who spins nightmares and fantasies into reality.',
    hitDieSize: 6,
    keyAttributes: ['will', 'intelligence'],
    startingHP: 9,
    armorProficiencies: [
      { type: 'cloth' }
    ],
    weaponProficiencies: [
      { type: 'freeform', name: 'Dream Manifestations' }
    ],
    features: [
      {
        level: 1,
        type: 'spell_access',
        name: 'Dream Magic',
        description: 'Your spells come from the collective unconscious and shift between reality and illusion.',
        spellAccess: {
          spellLevel: 1,
          spellsKnown: 3,
          cantrips: 2,
          spellList: 'dreamweaver'
        }
      },
      {
        level: 1,
        type: 'ability',
        name: 'Waking Dream',
        description: 'Overlay a dreamscape onto reality, changing the perceived environment for all nearby.',
        ability: {
          id: 'dreamweaver-waking-dream',
          name: 'Waking Dream',
          description: 'Alter the appearance and feel of a 20-foot area, making it match a dream or nightmare.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 2,
          currentUses: 2
        }
      },
      {
        level: 2,
        type: 'resource',
        name: 'Dream Essence',
        description: 'Harvest the emotional energy from dreams and nightmares to fuel your abilities.',
        resource: {
          resourceName: 'Dream Essence',
          amount: 4,
          rechargeType: 'long_rest'
        }
      },
      {
        level: 3,
        type: 'ability',
        name: 'Nightmare Manifest',
        description: 'Pull a creature\'s deepest fear from their subconscious and make it temporarily real.',
        ability: {
          id: 'dreamweaver-nightmare-manifest',
          name: 'Nightmare Manifest',
          description: 'Manifest a target\'s fear as a semi-real creature that attacks them.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1,
          roll: {
            dice: '2d6',
            attribute: 'will'
          }
        }
      },
      {
        level: 4,
        type: 'passive_feature',
        name: 'Lucid Reality',
        description: 'You exist partially in the dream realm, gaining resistance to many physical effects.',
        category: 'utility'
      }
    ]
  },

  symbiote: {
    id: 'symbiote',
    name: 'Symbiote',
    description: 'Bonded with an alien entity, you share your body and mind in exchange for incredible adaptive abilities.',
    hitDieSize: 10,
    keyAttributes: ['strength', 'will'],
    startingHP: 13,
    armorProficiencies: [
      { type: 'freeform', name: 'Living Armor' }
    ],
    weaponProficiencies: [
      { type: 'strength_weapons' },
      { type: 'freeform', name: 'Bio-weapons' }
    ],
    features: [
      {
        level: 1,
        type: 'passive_feature',
        name: 'Adaptive Biology',
        description: 'Your symbiote adapts your body to threats, granting resistance to recently encountered damage.',
        category: 'combat'
      },
      {
        level: 1,
        type: 'ability',
        name: 'Bio-Morph',
        description: 'Your symbiote reshapes parts of your body into weapons, tools, or protective features.',
        ability: {
          id: 'symbiote-bio-morph',
          name: 'Bio-Morph',
          description: 'Transform a limb into a weapon, tool, or defensive appendage for one encounter.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 3,
          currentUses: 3
        }
      },
      {
        level: 2,
        type: 'resource',
        name: 'Symbiotic Bond',
        description: 'Deepen your connection with your symbiote to access more powerful transformations.',
        resource: {
          resourceName: 'Bond Points',
          amount: 2,
          rechargeType: 'short_rest'
        }
      },
      {
        level: 3,
        type: 'ability',
        name: 'Parasitic Drain',
        description: 'Your symbiote extends tendrils to drain life force from nearby enemies to heal you.',
        ability: {
          id: 'symbiote-parasitic-drain',
          name: 'Parasitic Drain',
          description: 'Drain health from enemies within 10 feet to heal yourself.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 2,
          currentUses: 2,
          roll: {
            dice: '1d8',
            attribute: 'will'
          }
        }
      },
      {
        level: 4,
        type: 'ability',
        name: 'Perfect Fusion',
        description: 'Temporarily merge completely with your symbiote, becoming a hybrid creature of immense power.',
        ability: {
          id: 'symbiote-perfect-fusion',
          name: 'Perfect Fusion',
          description: 'Transform into a hybrid form with enhanced abilities for the remainder of the encounter.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1
        }
      }
    ]
  },

  echomancer: {
    id: 'echomancer',
    name: 'Echomancer',
    description: 'A manipulator of sound and vibration who can create temporal echoes of actions and experiences.',
    hitDieSize: 8,
    keyAttributes: ['will', 'dexterity'],
    startingHP: 11,
    armorProficiencies: [
      { type: 'cloth' },
      { type: 'leather' }
    ],
    weaponProficiencies: [
      { type: 'dexterity_weapons' },
      { type: 'freeform', name: 'Resonant Weapons' }
    ],
    features: [
      {
        level: 1,
        type: 'ability',
        name: 'Action Echo',
        description: 'Create a temporal echo of your last action, allowing you to repeat it with reduced effect.',
        ability: {
          id: 'echomancer-action-echo',
          name: 'Action Echo',
          description: 'Repeat your last action immediately at half effectiveness.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 2,
          currentUses: 2
        }
      },
      {
        level: 1,
        type: 'proficiency',
        name: 'Sonic Mastery',
        description: 'You can manipulate sound waves and vibrations with supernatural precision.',
        proficiencies: [
          { type: 'skill', name: 'Perception', bonus: 2 },
          { type: 'skill', name: 'Stealth', bonus: 2 }
        ]
      },
      {
        level: 2,
        type: 'resource',
        name: 'Resonance',
        description: 'Build up harmonic resonance that amplifies your sonic abilities.',
        resource: {
          resourceName: 'Resonance Points',
          amount: 3,
          rechargeType: 'short_rest'
        }
      },
      {
        level: 3,
        type: 'ability',
        name: 'Memory Echo',
        description: 'Create an echo of a past event in this location, allowing others to perceive what happened here.',
        ability: {
          id: 'echomancer-memory-echo',
          name: 'Memory Echo',
          description: 'Reveal the sonic imprint of events that occurred in this location up to 24 hours ago.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1
        }
      },
      {
        level: 4,
        type: 'ability',
        name: 'Shatter Point',
        description: 'Identify and exploit the resonant frequency that can destroy any object or barrier.',
        ability: {
          id: 'echomancer-shatter-point',
          name: 'Shatter Point',
          description: 'Find the exact frequency needed to destroy or disable a target structure or object.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1,
          roll: {
            dice: '3d6',
            attribute: 'intelligence'
          }
        }
      }
    ]
  },

  werewolf: {
    id: 'werewolf',
    name: 'Werewolf',
    description: 'A lycanthrope who balances their human nature with a bestial wolf form, gaining power from both civilization and wilderness.',
    hitDieSize: 10,
    keyAttributes: ['strength', 'will'],
    startingHP: 13,
    armorProficiencies: [
      { type: 'cloth' },
      { type: 'leather' }
    ],
    weaponProficiencies: [
      { type: 'strength_weapons' },
      { type: 'freeform', name: 'Natural Weapons' }
    ],
    features: [
      {
        level: 1,
        type: 'ability',
        name: 'Lupine Transformation',
        description: 'Shift between human and wolf forms, gaining different abilities based on your current form.',
        ability: {
          id: 'werewolf-transformation',
          name: 'Lupine Transformation',
          description: 'Transform between human, hybrid, and wolf forms. Each form grants different bonuses and abilities.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 3,
          currentUses: 3
        }
      },
      {
        level: 1,
        type: 'passive_feature',
        name: 'Enhanced Senses',
        description: 'Your supernatural senses allow you to track by scent and detect hidden enemies.',
        category: 'utility'
      },
      {
        level: 2,
        type: 'resource',
        name: 'Lunar Rage',
        description: 'Channel the moon\'s power to fuel your lycanthropic abilities and transformations.',
        resource: {
          resourceName: 'Rage Points',
          amount: 2,
          rechargeType: 'short_rest'
        }
      },
      {
        level: 2,
        type: 'ability',
        name: 'Pack Hunter',
        description: 'Call upon the spirit of the pack to coordinate attacks with allies or summon spectral wolves.',
        ability: {
          id: 'werewolf-pack-hunter',
          name: 'Pack Hunter',
          description: 'Grant yourself and nearby allies pack tactics, or summon a spectral wolf companion.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 2,
          currentUses: 2
        }
      },
      {
        level: 3,
        type: 'ability',
        name: 'Feral Instincts',
        description: 'In moments of danger, your beast nature takes over, granting supernatural reflexes and savagery.',
        ability: {
          id: 'werewolf-feral-instincts',
          name: 'Feral Instincts',
          description: 'Enter a feral state that enhances your combat abilities and grants damage resistance.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1
        }
      },
      {
        level: 4,
        type: 'ability',
        name: 'Howl of the Moon',
        description: 'Release a supernatural howl that can terrify enemies, call distant allies, or invoke lunar power.',
        ability: {
          id: 'werewolf-howl',
          name: 'Howl of the Moon',
          description: 'A powerful howl that can fear enemies, boost allies, or draw upon lunar energies.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1,
          roll: {
            dice: '2d8',
            attribute: 'will'
          }
        }
      }
    ]
  },

  mutant: {
    id: 'mutant',
    name: 'Mutant',
    description: 'A being whose body has been twisted by strange energies, able to manifest grotesque but powerful aberrant appendages and mutations.',
    hitDieSize: 8,
    keyAttributes: ['strength', 'intelligence'],
    startingHP: 11,
    armorProficiencies: [
      { type: 'cloth' },
      { type: 'freeform', name: 'Chitinous Growth' }
    ],
    weaponProficiencies: [
      { type: 'strength_weapons' },
      { type: 'freeform', name: 'Mutant Appendages' }
    ],
    features: [
      {
        level: 1,
        type: 'ability',
        name: 'Aberrant Manifestation',
        description: 'Rapidly grow twisted appendages like tentacles, spines, or extra limbs for combat or utility.',
        ability: {
          id: 'mutant-manifestation',
          name: 'Aberrant Manifestation',
          description: 'Manifest a grotesque appendage: tentacle (grapple), bone spike (weapon), eye stalk (perception), etc.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 3,
          currentUses: 3
        }
      },
      {
        level: 1,
        type: 'passive_feature',
        name: 'Unstable Genetics',
        description: 'Your body constantly adapts and changes, making you resistant to toxins and diseases.',
        category: 'utility'
      },
      {
        level: 2,
        type: 'resource',
        name: 'Mutation Energy',
        description: 'Chaotic energies within your cells fuel rapid biological changes and adaptations.',
        resource: {
          resourceName: 'Mutation Points',
          amount: 4,
          rechargeType: 'long_rest'
        }
      },
      {
        level: 2,
        type: 'ability',
        name: 'Reactive Evolution',
        description: 'Your body rapidly adapts to threats, developing resistances or countermeasures in real-time.',
        ability: {
          id: 'mutant-reactive-evolution',
          name: 'Reactive Evolution',
          description: 'Temporarily develop immunity or resistance to a damage type you just received.',
          type: 'action',
          frequency: 'per_encounter',
          maxUses: 2,
          currentUses: 2
        }
      },
      {
        level: 3,
        type: 'ability',
        name: 'Horrific Transformation',
        description: 'Undergo a disturbing metamorphosis, becoming a writhing mass of eyes, mouths, and grasping appendages.',
        ability: {
          id: 'mutant-transformation',
          name: 'Horrific Transformation',
          description: 'Transform into an aberrant horror form with multiple attacks and terrifying presence.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1
        }
      },
      {
        level: 4,
        type: 'ability',
        name: 'Cellular Reconstruction',
        description: 'Completely restructure your body at the cellular level, healing wounds or gaining new capabilities.',
        ability: {
          id: 'mutant-reconstruction',
          name: 'Cellular Reconstruction',
          description: 'Rapidly heal injuries or temporarily gain a completely new physical capability.',
          type: 'action',
          frequency: 'per_safe_rest',
          maxUses: 1,
          currentUses: 1,
          roll: {
            dice: '3d6',
            attribute: 'intelligence'
          }
        }
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