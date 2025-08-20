import { SubclassDefinition } from '../../types/class';

export const wizardEvocation: SubclassDefinition = {
  id: 'wizard-evocation',
  name: 'School of Evocation',
  description: 'A wizard who focuses on mastering spells that channel raw magical energy to deal damage.',
  parentClassId: 'wizard',
  features: [
    {
      level: 2,
      type: 'passive_feature',
      name: 'Evocation Savant',
      description: 'The gold and time you must spend to copy an evocation spell into your spellbook is halved.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'ability',
      name: 'Sculpt Spells',
      description: 'You can create pockets of relative safety within the effects of your evocation spells.',
      ability: {
        id: 'evocation-sculpt-spells',
        name: 'Sculpt Spells',
        description: 'Choose a number of creatures equal to 1 + the spell\'s level to automatically succeed on saves against your evocation spells.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      level: 6,
      type: 'ability',
      name: 'Potent Cantrip',
      description: 'Your damaging cantrips affect even creatures that avoid the brunt of the effect.',
      ability: {
        id: 'evocation-potent-cantrip',
        name: 'Potent Cantrip',
        description: 'When a creature succeeds on a saving throw against your cantrip, it takes half damage.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      level: 10,
      type: 'ability',
      name: 'Empowered Evocation',
      description: 'You can add your Intelligence modifier to the damage roll of any wizard evocation spell you cast.',
      ability: {
        id: 'evocation-empowered',
        name: 'Empowered Evocation',
        description: 'Add Intelligence modifier to evocation spell damage.',
        type: 'action',
        frequency: 'at_will',
        roll: {
          dice: '0d0',
          attribute: 'intelligence'
        }
      }
    },
    {
      level: 14,
      type: 'ability',
      name: 'Overchannel',
      description: 'You can increase the power of your simpler spells, dealing maximum damage.',
      ability: {
        id: 'evocation-overchannel',
        name: 'Overchannel',
        description: 'When you cast a 1st through 5th-level spell, you can deal maximum damage instead of rolling.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    }
  ]
};