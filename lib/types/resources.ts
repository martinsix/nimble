/**
 * Generic Resource System Types
 * 
 * Replaces the hardcoded mana system with a flexible resource system
 * that can handle mana, fury, focus, energy, etc.
 * 
 * Separates pure resource definitions from runtime instance state.
 */

export type ResourceResetCondition = 
  | 'safe_rest'      // Reset on safe rest (mana, spell slots)
  | 'encounter_end'  // Reset on encounter end (fury, rage)
  | 'turn_end'       // Reset on turn end (focus, concentration)
  | 'never'          // Never auto-reset (health potions, ammo)
  | 'manual';        // Only reset manually

export type ResourceResetType = 
  | 'to_max'         // Reset to maximum value (mana)
  | 'to_zero'        // Reset to zero (fury)
  | 'to_default';    // Reset to a specific default value

/**
 * Pure resource definition - immutable template for a resource type
 */
export interface ResourceDefinition {
  id: string;                           // Unique identifier (e.g., 'mana', 'fury')
  name: string;                         // Display name (e.g., 'Mana', 'Fury')
  description?: string;                 // Optional description
  colorScheme: string;                  // Color scheme ID (e.g., 'blue-magic', 'red-fury')
  icon?: string;                        // Icon identifier (e.g., 'sparkles', 'fire')
  resetCondition: ResourceResetCondition;
  resetType: ResourceResetType;
  resetValue?: number;                  // Used with 'to_default' reset type
  minValue: number;                     // Minimum value (usually 0)
  maxValue: number;                     // Maximum value
}

/**
 * Resource instance - combines definition with runtime state
 */
export interface ResourceInstance {
  definition: ResourceDefinition;       // The immutable resource definition
  current: number;                      // Current amount
  sortOrder: number;                    // Display order in UI
}


// Default resource definitions for character creation
export const DEFAULT_RESOURCE_DEFINITIONS: ResourceDefinition[] = [
  {
    id: 'mana',
    name: 'Mana',
    description: 'Magical energy used to cast spells',
    colorScheme: 'blue-magic',
    icon: 'sparkles',
    resetCondition: 'safe_rest',
    resetType: 'to_max',
    minValue: 0,
    maxValue: 10,
  },
];

// Helper function to create a ResourceInstance from a ResourceDefinition
export function createResourceInstance(
  definition: ResourceDefinition, 
  current?: number, 
  sortOrder?: number
): ResourceInstance {
  return {
    definition,
    current: current ?? definition.maxValue,
    sortOrder: sortOrder ?? 1,
  };
}

