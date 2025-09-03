import { BackgroundDefinition } from '../../types/background';

export const tradesmanArtisan: BackgroundDefinition = {
  id: 'tradesman-artisan',
  name: 'Tradesman/Artisan',
  description: 'Choose a profession (Baker/Cook, Smith, Stonemason, Weaver, Leatherworker, etc.). Checks you make related to that profession are made with advantage. You also retain special knowledge related to your profession.',
  features: [
    {
      type: 'passive_feature',
      name: 'Professional Expertise',
      description: 'Choose a profession (Baker/Cook, Smith, Stonemason, Weaver, Leatherworker, etc.). Checks you make related to that profession are made with advantage.'
    },
    {
      type: 'passive_feature',
      name: 'Professional Knowledge',
      description: 'You retain special knowledge related to your profession.'
    }
  ]
};