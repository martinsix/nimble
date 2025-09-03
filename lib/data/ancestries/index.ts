// Core fantasy ancestries
export { human } from './human';
export { elf } from './elf';
export { dwarf } from './dwarf';
export { halfling } from './halfling';
export { gnome } from './gnome';

// Import all ancestry definitions for the main ancestries object
import { human } from './human';
import { elf } from './elf';
import { dwarf } from './dwarf';
import { halfling } from './halfling';
import { gnome } from './gnome';

import { AncestryDefinition } from '../../types/ancestry';

// Main ancestry definitions object
export const ancestryDefinitions: Record<string, AncestryDefinition> = {
  human,
  elf,
  dwarf,
  halfling,
  gnome
};

// Helper function to get an ancestry definition by ID
export function getAncestryDefinition(ancestryId: string): AncestryDefinition | null {
  return ancestryDefinitions[ancestryId] || null;
}

// Helper function to get all available ancestries
export function getAllAncestries(): AncestryDefinition[] {
  return Object.values(ancestryDefinitions);
}

// Helper function to get ancestry features
export function getAncestryFeatures(ancestryId: string): AncestryDefinition['features'] {
  const ancestryDef = getAncestryDefinition(ancestryId);
  if (!ancestryDef) return [];
  
  return ancestryDef.features;
}

// Helper function to check if an ancestry is available
export function isValidAncestry(ancestryId: string): boolean {
  return ancestryId in ancestryDefinitions;
}