// Basic fantasy classes
export { fighter } from './fighter';
export { wizard } from './wizard';
export { rogue } from './rogue';
export { cleric } from './cleric';
export { berserkerClass as berserker } from './berserker';
export { cheatClass as cheat } from './cheat';
export { commanderClass as commander } from './commander';
export { hunterClass as hunter } from './hunter';

// Import all class definitions for the main classes object
import { fighter } from './fighter';
import { wizard } from './wizard';
import { rogue } from './rogue';
import { cleric } from './cleric';
import { berserkerClass as berserker } from './berserker';
import { cheatClass as cheat } from './cheat';
import { commanderClass as commander } from './commander';
import { hunterClass as hunter } from './hunter';

import { ClassDefinition } from '../../types/class';

// Main class definitions object
export const classDefinitions: Record<string, ClassDefinition> = {
  fighter,
  wizard,
  rogue,
  cleric,
  berserker,
  cheat,
  commander,
  hunter
};

// Helper function to get a class definition by ID
export function getClassDefinition(classId: string): ClassDefinition | null {
  return classDefinitions[classId] || null;
}

// Helper function to get all available classes
export function getAllClasses(): ClassDefinition[] {
  return Object.values(classDefinitions);
}

// Helper function to get features for a specific class and level
export function getClassFeaturesForLevel(classId: string, level: number): ClassDefinition['features'] {
  const classDef = getClassDefinition(classId);
  if (!classDef) return [];
  
  return classDef.features.filter(feature => feature.level === level);
}

// Helper function to get all features up to a specific level
export function getAllClassFeaturesUpToLevel(classId: string, level: number): ClassDefinition['features'] {
  const classDef = getClassDefinition(classId);
  if (!classDef) return [];
  
  return classDef.features.filter(feature => feature.level <= level);
}

// Helper function to get all subclasses for a specific class
export function getSubclassesForClass(classId: string): any[] {
  // For now, return empty array - subclasses will be handled by class service
  return [];
}