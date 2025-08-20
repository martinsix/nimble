// Fighter subclasses
export { fighterChampion } from './fighter-champion';
export { fighterBattleMaster } from './fighter-battlemaster';

// Wizard subclasses
export { wizardEvocation } from './wizard-evocation';

// Rogue subclasses
export { rogueAssassin } from './rogue-assassin';

// Exotic subclasses
export { voidwalkerNihilist } from './voidwalker-nihilist';
export { memehazardVirulent } from './memehazard-virulent';

// Import all subclass definitions for the main subclasses object
import { fighterChampion } from './fighter-champion';
import { fighterBattleMaster } from './fighter-battlemaster';
import { wizardEvocation } from './wizard-evocation';
import { rogueAssassin } from './rogue-assassin';
import { voidwalkerNihilist } from './voidwalker-nihilist';
import { memehazardVirulent } from './memehazard-virulent';

import { SubclassDefinition } from '../../types/class';

// All subclass definitions
export const subclassDefinitions: Record<string, SubclassDefinition> = {
  'fighter-champion': fighterChampion,
  'fighter-battlemaster': fighterBattleMaster,
  'wizard-evocation': wizardEvocation,
  'rogue-assassin': rogueAssassin,
  'voidwalker-nihilist': voidwalkerNihilist,
  'memehazard-virulent': memehazardVirulent
};

// Helper function to get a subclass definition by ID
export function getSubclassDefinition(subclassId: string): SubclassDefinition | null {
  return subclassDefinitions[subclassId] || null;
}

// Helper function to get all subclasses for a specific class
export function getSubclassesForClass(classId: string): SubclassDefinition[] {
  return Object.values(subclassDefinitions).filter(subclass => subclass.parentClassId === classId);
}

// Helper function to get features for a specific subclass and level
export function getSubclassFeaturesForLevel(subclassId: string, level: number): SubclassDefinition['features'] {
  const subclassDef = getSubclassDefinition(subclassId);
  if (!subclassDef) return [];
  
  return subclassDef.features.filter(feature => feature.level === level);
}

// Helper function to get all subclass features up to a specific level
export function getAllSubclassFeaturesUpToLevel(subclassId: string, level: number): SubclassDefinition['features'] {
  const subclassDef = getSubclassDefinition(subclassId);
  if (!subclassDef) return [];
  
  return subclassDef.features.filter(feature => feature.level <= level);
}