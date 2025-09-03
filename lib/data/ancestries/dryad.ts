import { AncestryDefinition } from '../../types/ancestry';

export const dryad: AncestryDefinition = {
  id: 'dryad',
  name: 'Dryad/Shroomling',
  description: 'Tied to the natural world, Dryads and Shroomlings embody the balance between flora and fauna. Their unique physiology releases toxic spores when harmed, providing a natural defense against those who dare to harm them.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Danger Pollen/Spores',
      description: 'Whenever an enemy causes you one or more Wounds, you excrete soporific spores: all adjacent enemies are Dazed. You know Elvish if your INT is not negative.'
    }
  ]
};