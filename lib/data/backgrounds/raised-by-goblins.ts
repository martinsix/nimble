import { BackgroundDefinition } from '../../types/background';

export const raisedByGoblins: BackgroundDefinition = {
  id: 'raised-by-goblins',
  name: 'Raised by Goblins',
  description: 'You speak Goblin natively (much better than one who has learned it later in life). You automatically notice and can avoid crudely-made traps and have advantage to notice and disarm more sophisticated traps. Change It Up! You can choose any other ancestry to be raised by instead, and exchange the known language and get 1 helpful/iconic ability those people would inculcate (e.g., Dwarves know Dwarvish and are very good with smithing or stonecraft).',
  features: [
    {
      type: 'passive_feature',
      name: 'Native Goblin Speaker',
      description: 'You speak Goblin natively (much better than one who has learned it later in life).'
    },
    {
      type: 'passive_feature',
      name: 'Trap Sense',
      description: 'You automatically notice and can avoid crudely-made traps and have advantage to notice and disarm more sophisticated traps.'
    }
  ]
};