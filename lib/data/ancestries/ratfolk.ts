import { AncestryDefinition } from '../../types/ancestry';

export const ratfolk: AncestryDefinition = {
  id: 'ratfolk',
  name: 'Ratfolk',
  description: 'Ratfolk are survivors, thriving in the shadows of society where others fear to tread. Agile, resourceful, and fiercely loyal to their own, they have a knack for turning scraps into solutions.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Scurry',
      description: 'Gain +2 armor if you moved on your last turn.'
    }
  ]
};