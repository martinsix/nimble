import { AncestryDefinition } from '../../types/ancestry';

export const dragonborn: AncestryDefinition = {
  id: 'dragonborn',
  name: 'Dragonborn',
  description: 'The soul of a dragon burns within you, the scales of your body are like forged steel. You are a kin and your heritage the coals that stoke your flames. Call upon your wrath, to speak in the tongue of your ancestors and imbue unbridled fury into your attacks.',
  size: 'medium',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Draconic Heritage',
      description: '+1 Armor. When you attack: deal an additional LVL+KEY damage (ignoring armor) divided as you choose among any of your targets; recharges whenever you Safe Rest or gain a Wound. You know Draconic if your INT is not negative.'
    }
  ]
};