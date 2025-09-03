import { AncestryDefinition } from '../../types/ancestry';

export const changeling: AncestryDefinition = {
  id: 'changeling',
  name: 'Changeling',
  description: "Often hunted for their silver blood, Changelings are natural survivors, slipping into new identities with ease. Changelings that shift too often typically aren't long for the world—they can struggle to remember who they were, becoming little more than reflections of the faces they wear.",
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'New Place, New Face',
      description: '+2 shifting skill points. You may take on the appearance of any ancestry. When you do, you may place your 2 shifting skill points into any 1 skill. 1/day.'
    }
  ]
};