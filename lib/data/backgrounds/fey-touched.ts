import { BackgroundDefinition } from '../../types/background';

export const feyTouched: BackgroundDefinition = {
  id: 'fey-touched',
  name: 'Fey Touched',
  description: 'You take half damage from all magical effects, double from weapons made of metal (before armor is applied).',
  features: [
    {
      type: 'passive_feature',
      name: 'Fey Resilience',
      description: 'You take half damage from all magical effects, double from weapons made of metal (before armor is applied).'
    }
  ]
};