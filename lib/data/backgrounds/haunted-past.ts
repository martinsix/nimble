import { BackgroundDefinition } from '../../types/background';

export const hauntedPast: BackgroundDefinition = {
  id: 'haunted-past',
  name: 'Haunted Past',
  description: 'You are haunted by voices that occasionally give you cryptic advice. The voices are sometimes VERY helpful. Other times they only want to see you suffer. Advantage against fear.',
  features: [
    {
      type: 'passive_feature',
      name: 'Cryptic Voices',
      description: 'You are haunted by voices that occasionally give you cryptic advice. The voices are sometimes VERY helpful. Other times they only want to see you suffer.'
    },
    {
      type: 'passive_feature',
      name: 'Fearless From Experience',
      description: 'Advantage against fear.'
    }
  ]
};