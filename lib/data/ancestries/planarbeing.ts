import { AncestryDefinition } from '../../types/ancestry';

export const planarbeing: AncestryDefinition = {
  id: 'planarbeing',
  name: 'Planarbeing',
  description: 'You are not from this plane of existence—your soul is not as strongly tethered to it as others. But with this vulnerability comes power, the ability to temporarily shift from one plane to another in times of dire need.',
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Planeshift',
      description: 'Whenever you Defend, you can gain 1 Wound to temporarily phase out of the material plane and ignore the damage. -2 max Wounds.'
    }
  ]
};