import { SubclassDefinition } from '../../types/class';

export const rogueAssassin: SubclassDefinition = {
  id: 'rogue-assassin',
  name: 'Assassin',
  description: 'A master of dealing death from the shadows, specializing in infiltration and elimination.',
  parentClassId: 'rogue',
  features: [
    {
      id: 'rogue-assassin-bonus-proficiencies',
      level: 3,
      type: 'proficiency',
      name: 'Bonus Proficiencies',
      description: 'You gain proficiency with the disguise kit and the poisoner\'s kit.',
      proficiencies: [
        { type: 'tool', name: 'Disguise Kit' },
        { type: 'tool', name: 'Poisoner\'s Kit' }
      ]
    },
    {
      id: 'rogue-assassin-assassinate',
      level: 3,
      type: 'ability',
      name: 'Assassinate',
      description: 'You have advantage on attack rolls against any creature that hasn\'t taken a turn in combat yet.',
      ability: {
        id: 'assassin-assassinate',
        name: 'Assassinate',
        description: 'Gain advantage against creatures that haven\'t acted, and critical hits against surprised foes.',
        type: 'action',
        frequency: 'at_will',
        roll: {
          dice: { count: 2, sides: 6 },
          attribute: 'dexterity'
        }
      }
    },
    {
      id: 'rogue-assassin-infiltration-expertise',
      level: 9,
      type: 'ability',
      name: 'Infiltration Expertise',
      description: 'You can unfailingly create false identities for yourself.',
      ability: {
        id: 'assassin-infiltration',
        name: 'Infiltration Expertise',
        description: 'Create convincing false identities complete with documentation and contacts.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      id: 'rogue-assassin-impostor',
      level: 13,
      type: 'ability',
      name: 'Impostor',
      description: 'You gain the ability to unerringly mimic another person\'s speech, writing, and behavior.',
      ability: {
        id: 'assassin-impostor',
        name: 'Impostor',
        description: 'Perfectly mimic another person after studying them for at least 3 hours.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      id: 'rogue-assassin-death-strike',
      level: 17,
      type: 'ability',
      name: 'Death Strike',
      description: 'You become a master of instant death, able to kill with a single precise strike.',
      ability: {
        id: 'assassin-death-strike',
        name: 'Death Strike',
        description: 'When you attack and hit a creature that is surprised, it must make a Constitution saving throw or take double damage.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: { count: 4, sides: 6 },
          attribute: 'dexterity'
        }
      }
    }
  ]
};