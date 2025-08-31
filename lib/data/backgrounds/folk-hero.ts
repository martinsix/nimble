import { BackgroundDefinition } from '../../types/background';

export const folkHero: BackgroundDefinition = {
  id: 'folk-hero',
  name: 'Folk Hero',
  description: 'You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion.',
  features: [
    {
      type: 'passive_feature',
      name: 'Rustic Hospitality',
      description: 'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners.',
      category: 'social'
    },
    {
      type: 'passive_feature',
      name: 'Local Legend',
      description: 'Your heroic deeds have made you a local legend. Common folk recognize you and will often go out of their way to help you.',
      category: 'cultural'
    }
  ]
};