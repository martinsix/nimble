import { AncestryDefinition } from '../../types/ancestry';

export const wyrdling: AncestryDefinition = {
  id: 'wyrdling',
  name: 'Wyrdling',
  description: 'Unpredictable and chaotic, Wyrdlings are the result of magic gone awry. Their bodies pulse with raw arcane energy, and their mere presence often disturbs the balance of magic around them.',
  size: 'small',
  rarity: 'exotic',
  features: [
    {
      type: 'passive_feature',
      name: 'Chaotic Surge',
      description: 'Whenever you or a willing ally within Reach 6 casts a tiered spell, you may allow them to roll on the Chaos Table. 1/encounter.'
    }
  ]
};