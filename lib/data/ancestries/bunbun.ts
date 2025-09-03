import { AncestryDefinition } from '../../types/ancestry';

export const bunbun: AncestryDefinition = {
  id: 'bunbun',
  name: 'Bunbun',
  description: 'Bunbun are agile and unpredictable, using their powerful legs to leap great distances and catch foes off guard. Facing a Bunbun means contending with an opponent who can strike from unexpected angles and swiftly reposition themselves in the heat of battle.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Bunny Legs',
      description: 'Before Interposing or after Defending (after damage), hop up to your Speed in any direction for free, 1/encounter.'
    }
  ]
};