import { SubclassDefinition } from '../../types/class';

export const oathswornRefuge: SubclassDefinition = {
  id: 'oathsworn-refuge',
  name: 'Oath of Refuge',
  parentClassId: 'oathsworn',
  description: 'An oath sworn to protect the innocent and provide sanctuary to those in need.',
  features: [
    {
      id: 'aura-of-refuge',
      level: 3,
      type: 'passive_feature',
      name: 'Aura of Refuge',
      description: 'Your shields gain +WIL armor and count as your spellcasting focus. Gain an aura with a Reach of 4; you can Interpose for an ally anywhere within your aura.',
      category: 'combat'
    },
    {
      id: 'sacred-decree-refuge',
      level: 3,
      type: 'passive_feature',
      name: 'Sacred Decrees',
      description: 'Refuge Oathsworn learn specific Sacred Decrees:\n\n• Shining Mandate: The first time each round you are attacked while you already have Judgment Dice, select an ally within your aura to roll one and apply it to their next attack. You have advantage on skill checks to see through illusions.\n\n• Stand Fast, Friends! When you roll Initiative, grant allies temp HP equal to your STR+WIL. You and allies within your aura have advantage against fear and effects that would move or knock Prone.\n\n• Unstoppable Protector: Gain +1 speed. You may Interpose even if you are restrained, stunned, or otherwise incapacitated. If you Interpose for a non-combatant NPC, you may Interpose again this round.\n\n• Wall Armored: Whenever you Interpose, gain temp HP equal to your STR.',
      category: 'combat'
    },
    {
      id: 'face-me-foul-creature',
      level: 7,
      type: 'ability',
      name: 'Face Me, Foul Creature!',
      description: 'When you Interpose, the attacking enemy is also Taunted by you until the end of their next turn.',
      ability: {
        id: 'face-me-foul-creature',
        name: 'Face Me, Foul Creature!',
        description: 'When you Interpose, the attacking enemy is also Taunted by you until the end of their next turn.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      id: 'glorious-reprieve',
      level: 11,
      type: 'passive_feature',
      name: 'Glorious Reprieve',
      description: 'You and allies in your aura cannot drop below 1 HP. Whenever this triggers, they gain 1 Wound instead (heroes still die at max Wounds).',
      category: 'combat'
    },
    {
      id: 'divine-grace',
      level: 15,
      type: 'passive_feature',
      name: 'Divine Grace',
      description: 'You are resistant to all damage while Interposing.',
      category: 'combat'
    }
  ]
};