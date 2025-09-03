import { AncestryDefinition } from '../../types/ancestry';

export const birdfolk: AncestryDefinition = {
  id: 'birdfolk',
  name: 'Birdfolk',
  description: 'Birdfolk find sanctuary not in stone or chains, but within the boundless expanse of the sky. However, the gift of flight comes at a cost—hollow bones, and commensurate frailty.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Hollow Bones',
      description: 'You have a fly Speed as long as you are wearing armor no heavier than Leather. Crits against you are Vicious (the attacker rolls 1 additional die). Forced movement moves you twice as far.'
    }
  ]
};