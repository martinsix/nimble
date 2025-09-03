import { AncestryDefinition } from '../../types/ancestry';

export const minotaur: AncestryDefinition = {
  id: 'minotaur',
  name: 'Minotaur/Beastfolk',
  description: 'Minotaur and other Beastfolk embody a primal connection to The Wild, combining strength with natural agility. Their powerful build allows them to move swiftly, whether repositioning to outflank foes or charging in with unstoppable force.',
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Charge',
      description: 'When you move at least 4 spaces, you can push a creature in your path. Medium: 1 space; Small/Tiny: up to 2 spaces. 1/turn.'
    }
  ]
};