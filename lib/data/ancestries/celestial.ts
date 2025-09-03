import { AncestryDefinition } from '../../types/ancestry';

export const celestial: AncestryDefinition = {
  id: 'celestial',
  name: 'Celestial',
  description: 'Descendants of divine beings, Celestials carry an aura of nobility and grace. Their innate connection to the higher planes allows them to resist the effects of misfortune, standing strong where others may falter.',
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Highborn',
      description: "Your disadvantaged save is Neutral instead. You know Celestial if your INT isn't negative."
    }
  ]
};