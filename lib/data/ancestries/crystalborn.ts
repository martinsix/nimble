import { AncestryDefinition } from '../../types/ancestry';

export const crystalborn: AncestryDefinition = {
  id: 'crystalborn',
  name: 'Crystalborn',
  description: 'Formed from living crystal, the Crystalborn are beings of dazzling beauty and otherworldly toughness. Their translucent bodies refract light and sound, granting them unique abilities in combat.',
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Reflective Aura',
      description: 'When you Defend, gain KEY armor and deal KEY damage back to the attacker. 1/encounter.'
    }
  ]
};