import { AncestryDefinition } from '../../types/ancestry';

export const kobold: AncestryDefinition = {
  id: 'kobold',
  name: 'Kobold',
  description: 'Small, often maniacal, and dragon-obsessed. Kobolds thrive in the shadows, finding ingenious ways to survive despite their diminutive size. Underestimated by many, Kobolds prove time and again that even the smallest among us can wield great power.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Wily',
      description: 'Force an enemy to reroll a non-critical attack against you, 1/encounter. +3 to Influence friendly characters. Advantage on skill checks related to dragons. You know Draconic if your INT is not negative.'
    }
  ]
};