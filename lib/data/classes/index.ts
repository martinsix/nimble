// Traditional fantasy classes
export { fighter } from './fighter';
export { wizard } from './wizard';
export { rogue } from './rogue';
export { cleric } from './cleric';
export { ranger } from './ranger';
export { artificer } from './artificer';
export { monk } from './monk';
export { warlock } from './warlock';
export { bard } from './bard';

// Exotic and unconventional classes
export { voidwalker } from './voidwalker';
export { chronothief } from './chronothief';
export { dreamweaver } from './dreamweaver';
export { symbiote } from './symbiote';
export { echomancer } from './echomancer';
export { werewolf } from './werewolf';
export { mutant } from './mutant';

// Extremely bizarre and experimental classes
export { memehazard } from './memehazard';
export { quantumghost } from './quantumghost';
export { parasitegod } from './parasitegod';
export { narrativevirus } from './narrativevirus';

// Import all class definitions for the main classes object
import { fighter } from './fighter';
import { wizard } from './wizard';
import { rogue } from './rogue';
import { cleric } from './cleric';
import { ranger } from './ranger';
import { artificer } from './artificer';
import { monk } from './monk';
import { warlock } from './warlock';
import { bard } from './bard';
import { voidwalker } from './voidwalker';
import { chronothief } from './chronothief';
import { dreamweaver } from './dreamweaver';
import { symbiote } from './symbiote';
import { echomancer } from './echomancer';
import { werewolf } from './werewolf';
import { mutant } from './mutant';
import { memehazard } from './memehazard';
import { quantumghost } from './quantumghost';
import { parasitegod } from './parasitegod';
import { narrativevirus } from './narrativevirus';

import { ClassDefinition } from '../../types/class';

// Main class definitions object
export const classDefinitions: Record<string, ClassDefinition> = {
  fighter,
  wizard,
  rogue,
  cleric,
  ranger,
  artificer,
  monk,
  warlock,
  bard,
  voidwalker,
  chronothief,
  dreamweaver,
  symbiote,
  echomancer,
  werewolf,
  mutant,
  memehazard,
  quantumghost,
  parasitegod,
  narrativevirus
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