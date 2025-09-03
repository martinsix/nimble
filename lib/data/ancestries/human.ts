import { AncestryDefinition } from '../../types/ancestry';
import { humanNames } from '../name-configs';

export const human: AncestryDefinition = {
  id: 'human',
  name: 'Human',
  description: 'Found in every terrain and environment, their curiosity and ambition drive them to explore every corner of the world, making them a ubiquitous and versatile race.',
  size: 'medium',
  features: [
    {
      type: 'passive_feature',
      name: 'Tenacious',
      description: '+1 to all skills and Initiative.'
    }
  ],
  nameConfig: humanNames
};