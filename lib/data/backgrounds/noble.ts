import { BackgroundDefinition } from '../../types/background';

export const noble: BackgroundDefinition = {
  id: 'noble',
  name: 'Noble',
  description: 'You come from wealth and privilege, raised in comfort with access to power and influence.',
  features: [
    {
      type: 'passive_feature',
      name: 'Position of Privilege',
      description: 'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are.',
      category: 'social'
    },
    {
      type: 'passive_feature',
      name: 'Political Connections',
      description: 'You have contacts among the nobility and understand the workings of politics and court intrigue.',
      category: 'social'
    }
  ]
};