import { AncestryDefinition } from '../../types/ancestry';
import { elfNames } from '../name-configs';

export const elf: AncestryDefinition = {
  id: 'elf',
  name: 'Elf',
  description: 'Elves epitomize swiftness and grace. Their tall, slender forms belie their innate speed, grace, and wit. Formidable in both diplomacy and combat, elves strike swiftly, often preventing the worst by acting first.',
  size: 'medium',
  features: [
    {
      type: 'passive_feature',
      name: 'Lithe',
      description: 'Advantage on Initiative, +1 Speed. You know Elvish if your INT is not negative.',
    }
  ],
  nameConfig: elfNames
};