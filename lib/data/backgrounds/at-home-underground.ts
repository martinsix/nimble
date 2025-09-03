import { BackgroundDefinition } from '../../types/background';

export const atHomeUnderground: BackgroundDefinition = {
  id: 'at-home-underground',
  name: 'At Home Underground',
  description: 'You can dig twice as fast as others. Safe resting locations underground always count as Lavish lodging for you. You struggle to rest (INT save) while it\'s raining. "Water... from the SKY?!"',
  features: [
    {
      type: 'passive_feature',
      name: 'Expert Digger',
      description: 'You can dig twice as fast as others.'
    },
    {
      type: 'passive_feature',
      name: 'Underground Comfort',
      description: 'Safe resting locations underground always count as Lavish lodging for you.'
    },
    {
      type: 'passive_feature',
      name: 'Rain Aversion',
      description: 'You struggle to rest (INT save) while it\'s raining. "Water... from the SKY?!"'
    }
  ]
};