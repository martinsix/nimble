// Core fantasy backgrounds
export { noble } from './noble';
export { scholar } from './scholar';
export { soldier } from './soldier';
export { folkHero } from './folk-hero';

// Import all background definitions for the main backgrounds object
import { noble } from './noble';
import { scholar } from './scholar';
import { soldier } from './soldier';
import { folkHero } from './folk-hero';

import { BackgroundDefinition } from '../../types/background';

// Main background definitions object
export const backgroundDefinitions: Record<string, BackgroundDefinition> = {
  noble,
  scholar,
  soldier,
  'folk-hero': folkHero
};

// Helper function to get a background definition by ID
export function getBackgroundDefinition(backgroundId: string): BackgroundDefinition | null {
  return backgroundDefinitions[backgroundId] || null;
}

// Helper function to get all available backgrounds
export function getAllBackgrounds(): BackgroundDefinition[] {
  return Object.values(backgroundDefinitions);
}

// Helper function to get background features
export function getBackgroundFeatures(backgroundId: string): BackgroundDefinition['features'] {
  const backgroundDef = getBackgroundDefinition(backgroundId);
  if (!backgroundDef) return [];
  
  return backgroundDef.features;
}

// Helper function to check if a background is available
export function isValidBackground(backgroundId: string): boolean {
  return backgroundId in backgroundDefinitions;
}