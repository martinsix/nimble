import { AncestryDefinition } from '../../types/ancestry';

export const turtlefolk: AncestryDefinition = {
  id: 'turtlefolk',
  name: 'Turtlefolk',
  description: 'Turtlefolk take their time in everything they do; they are patient, sturdy, and slow to anger. They rely on their thick shells for protection, making them difficult to harm, but their cautious movements come at the cost of speed.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Slow & Steady',
      description: '+4 Armor, -2 speed.'
    }
  ]
};