import { AncestryDefinition } from '../../types/ancestry';

export const goblin: AncestryDefinition = {
  id: 'goblin',
  name: 'Goblin',
  description: "Green, cunning, and perpetually vilified, Goblins thrive on the edge of chaos. For a Goblin, vanishing into the shadows is not just a skill—it's an identity. After all, what kind of Goblin would you be if you couldn't slip away unnoticed?",
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Skedaddle',
      description: "Can move 2 spaces for free after you become the target of an attack or negative effect (after damage, ignoring difficult terrain). You know Goblin if your INT is not negative."
    }
  ]
};