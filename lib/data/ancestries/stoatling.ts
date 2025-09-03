import { AncestryDefinition } from '../../types/ancestry';

export const stoatling: AncestryDefinition = {
  id: 'stoatling',
  name: 'Stoatling',
  description: 'Stoatlings may be small, but they\'re far from weak. With fierce determination and warrior hearts, they can take down foes many times their size. Their agility and tenacity let them exploit larger enemies\' weaknesses, turning their size into a lethal advantage.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Small But Ferocious',
      description: 'Whenever you make a single-target attack against a creature larger than you, roll 1 additional d6 for each size category it is larger. They do the same.'
    }
  ]
};