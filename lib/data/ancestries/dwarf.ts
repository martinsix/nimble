import { AncestryDefinition } from '../../types/ancestry';
import { dwarfNames } from '../name-configs';

export const dwarf: AncestryDefinition = {
  id: 'dwarf',
  name: 'Dwarf',
  description: 'Dwarf, in the old language, means "stone." You are resilient, solid, stout. Even when driven to exhaustion, you will not falter. Forgoing speed, you are gifted with physical vitality and a belly that can handle the finest (and worst) consumables this world has to offer.',
  size: 'medium',
  features: [
    {
      type: 'passive_feature',
      name: 'Stout',
      description: '+2 max Hit Dice, +1 max Wounds, -1 Speed. You know Dwarvish if your INT is not negative.',
    }
  ],
  nameConfig: dwarfNames
};