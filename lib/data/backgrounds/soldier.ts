import { BackgroundDefinition } from '../../types/background';

export const soldier: BackgroundDefinition = {
  id: 'soldier',
  name: 'Soldier',
  description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques.',
  features: [
    {
      type: 'passive_feature',
      name: 'Military Rank',
      description: 'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence.',
      category: 'professional'
    },
    {
      type: 'passive_feature',
      name: 'Veterans\' Network',
      description: 'You can find other veterans and soldiers who fought in similar conflicts. They might provide you with information, shelter, or assistance.',
      category: 'social'
    }
  ]
};