import { AncestryDefinition } from '../../types/ancestry';

export const orc: AncestryDefinition = {
  id: 'orc',
  name: 'Orc',
  description: "Just when you think you've bested a mighty Orc, you've merely succeeded in rousing their anger. Engaging in combat with an Orc is no endeavor for the weak-willed. While others may cower before death's approach, Orcs boldly defy its grasp.",
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Relentless',
      description: 'When you would drop to 0 HP, you may set your HP to LVL instead, 1/Safe Rest. +1 Might. You know Goblin if your INT is not negative (but you call it Orcish, of course).'
    }
  ]
};