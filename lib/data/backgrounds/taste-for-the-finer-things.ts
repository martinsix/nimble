import { BackgroundDefinition } from '../../types/background';

export const tasteForTheFinerThings: BackgroundDefinition = {
  id: 'taste-for-the-finer-things',
  name: 'Taste for the Finer Things',
  description: 'You always have up-to-date knowledge of the customs and dress of the upper classes and may even know many of their secrets. Advantage on Influence checks with the upper class.',
  features: [
    {
      type: 'passive_feature',
      name: 'High Society Knowledge',
      description: 'You always have up-to-date knowledge of the customs and dress of the upper classes and may even know many of their secrets.'
    },
    {
      type: 'passive_feature',
      name: 'Upper Class Influence',
      description: 'Advantage on Influence checks with the upper class.'
    }
  ]
};