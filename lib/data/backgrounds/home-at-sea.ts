import { BackgroundDefinition } from '../../types/background';

export const homeAtSea: BackgroundDefinition = {
  id: 'home-at-sea',
  name: 'Home at Sea',
  description: 'Recover twice as many Wounds and HP while resting on a ship or near water. You can fill in for a first mate or captain in a pinch. Advantage on water-related skill checks.',
  features: [
    {
      type: 'passive_feature',
      name: 'Nautical Recovery',
      description: 'Recover twice as many Wounds and HP while resting on a ship or near water.'
    },
    {
      type: 'passive_feature',
      name: 'Seamanship',
      description: 'You can fill in for a first mate or captain in a pinch. Advantage on water-related skill checks.'
    }
  ]
};