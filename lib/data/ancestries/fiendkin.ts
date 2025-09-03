import { AncestryDefinition } from '../../types/ancestry';

export const fiendkin: AncestryDefinition = {
  id: 'fiendkin',
  name: 'Fiendkin',
  description: "Said to have been born from the union of man and fiend, or from a cursed bloodline, Fiendkin often find themselves outcasts in society. Yet, they embody determination in the face of adversity. Their ancestors didn't emerge from the depths of the Everflame to succumb to minor setbacks!",
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Flameborn',
      description: '1 of your neutral saves is advantaged instead. You know Infernal if your INT is not negative.'
    }
  ]
};