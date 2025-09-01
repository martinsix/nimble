import { SubclassDefinition } from '../../types/class';

export const clericLife: SubclassDefinition = {
  id: 'cleric-life',
  name: 'Life Domain',
  description: 'Focused on healing and protection, channeling positive energy to preserve life and vitality.',
  parentClassId: 'cleric',
  features: [
    {
      id: 'cleric-life-bonus-proficiencies',
      level: 1,
      type: 'proficiency',
      name: 'Bonus Proficiencies',
      description: 'You gain proficiency with heavy armor.',
      proficiencies: [
        { type: 'tool', name: 'Heavy Armor' }
      ]
    },
    {
      id: 'cleric-life-disciple-of-life',
      level: 1,
      type: 'ability',
      name: 'Disciple of Life',
      description: 'Your healing spells are more effective.',
      ability: {
        id: 'life-disciple-of-life',
        name: 'Disciple of Life',
        description: 'Whenever you use a spell to restore hit points, the target regains additional hit points.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      id: 'cleric-life-preserve-life',
      level: 2,
      type: 'ability',
      name: 'Channel Divinity: Preserve Life',
      description: 'You can use your Channel Divinity to heal the badly injured.',
      ability: {
        id: 'life-preserve-life',
        name: 'Preserve Life',
        description: 'Heal multiple creatures for a total amount based on your cleric level.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: { count: 5, sides: 4 },
          attribute: 'will'
        }
      }
    },
    {
      id: 'cleric-life-blessed-healer',
      level: 6,
      type: 'ability',
      name: 'Blessed Healer',
      description: 'The healing spells you cast on others heal you as well.',
      ability: {
        id: 'life-blessed-healer',
        name: 'Blessed Healer',
        description: 'When you cast a healing spell on another creature, you also regain hit points.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      id: 'cleric-life-divine-strike',
      level: 8,
      type: 'ability',
      name: 'Divine Strike',
      description: 'Your weapon attacks carry divine power.',
      ability: {
        id: 'life-divine-strike',
        name: 'Divine Strike',
        description: 'Once per turn, your weapon attacks deal extra radiant damage.',
        type: 'action',
        frequency: 'per_turn',
        maxUses: 1,
        roll: {
          dice: { count: 1, sides: 8 },
          attribute: 'will'
        }
      }
    }
  ]
};