import { BackgroundDefinition } from '../../types/background';

export const formerConArtist: BackgroundDefinition = {
  id: 'former-con-artist',
  name: '(Former) Con Artist',
  description: 'You can forge most documents or mimic voices flawlessly. You have a criminal contact in most major cities. However, your reputation often precedes you—until you prove yourself to be trustworthy.',
  features: [
    {
      type: 'passive_feature',
      name: 'Master Forger',
      description: 'You can forge most documents or mimic voices flawlessly.'
    },
    {
      type: 'passive_feature',
      name: 'Criminal Network',
      description: 'You have a criminal contact in most major cities.'
    },
    {
      type: 'passive_feature',
      name: 'Questionable Reputation',
      description: 'Your reputation often precedes you—until you prove yourself to be trustworthy.'
    }
  ]
};