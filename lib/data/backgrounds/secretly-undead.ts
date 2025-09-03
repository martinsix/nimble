import { BackgroundDefinition } from '../../types/background';

export const secretlyUndead: BackgroundDefinition = {
  id: 'secretly-undead',
  name: '(Secretly) Undead',
  description: 'Unnatural Resilience: You are immune to disease and do not need to eat, drink, or breathe. Children, animals, and Celestials are uneasy in your presence; many will be horrified to discover your true nature.',
  features: [
    {
      type: 'passive_feature',
      name: 'Unnatural Resilience',
      description: 'You are immune to disease and do not need to eat, drink, or breathe.'
    },
    {
      type: 'passive_feature',
      name: 'Unsettling Presence',
      description: 'Children, animals, and Celestials are uneasy in your presence; many will be horrified to discover your true nature.'
    }
  ]
};