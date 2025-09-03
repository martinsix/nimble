import { AncestryDefinition } from '../../types/ancestry';

export const halfGiant: AncestryDefinition = {
  id: 'half-giant',
  name: 'Half-Giant',
  description: 'Towering beings whose strength is as immovable as the mountains they call home. Their sheer size and resilience make them fearsome opponents, capable of surviving even devastating blows.',
  size: 'large',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Strength of Stone',
      description: 'Force an enemy to reroll a crit against you, 1/encounter. +2 Might. You know Dwarvish if your INT is not negative.'
    }
  ]
};