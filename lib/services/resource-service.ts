import { Character } from '../types/character';
import { 
  ResourceInstance,
  ResourceResetCondition
} from '../types/resources';
import { ResourceUsageEntry } from '../types/log-entries';

/**
 * Resource Service
 * Manages character resources (mana, fury, focus, etc.)
 * Resources are now stored directly on the character with their complete definition.
 */
export class ResourceService {

  /**
   * Get a character's resource by ID
   */
  getResourceInstance(character: Character, resourceId: string): ResourceInstance | null {
    return character.resources.find(r => r.definition.id === resourceId) || null;
  }

  /**
   * Get all resources for a character
   */
  getActiveResources(character: Character): ResourceInstance[] {
    return character.resources;
  }

  /**
   * Add a resource to a character
   */
  addResourceToCharacter(character: Character, resource: ResourceInstance): ResourceInstance {
    // Check if character already has this resource
    const existing = this.getResourceInstance(character, resource.definition.id);
    if (existing) {
      return existing;
    }

    character.resources.push(resource);
    return resource;
  }

  /**
   * Remove a resource from a character
   */
  removeResourceFromCharacter(character: Character, resourceId: string): boolean {
    const index = character.resources.findIndex(r => r.definition.id === resourceId);
    if (index === -1) {
      return false;
    }

    character.resources.splice(index, 1);
    return true;
  }

  /**
   * Spend resource points
   */
  spendResource(character: Character, resourceId: string, amount: number): { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: ResourceInstance } | null {
    const resourceInstance = character.resources.find(r => r.definition.id === resourceId);
    if (!resourceInstance) {
      return null;
    }

    const actualAmount = Math.min(amount, resourceInstance.current);
    resourceInstance.current = Math.max(resourceInstance.definition.minValue, resourceInstance.current - actualAmount);

    return {
      resourceId,
      amount: actualAmount,
      type: 'spend',
      resource: resourceInstance,
    };
  }

  /**
   * Restore resource points
   */
  restoreResource(character: Character, resourceId: string, amount: number): { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: ResourceInstance } | null {
    const resourceInstance = character.resources.find(r => r.definition.id === resourceId);
    if (!resourceInstance) {
      return null;
    }

    const actualAmount = Math.min(amount, resourceInstance.definition.maxValue - resourceInstance.current);
    resourceInstance.current = Math.min(resourceInstance.definition.maxValue, resourceInstance.current + actualAmount);

    return {
      resourceId,
      amount: actualAmount,
      type: 'restore',
      resource: resourceInstance,
    };
  }

  /**
   * Set resource to a specific value
   */
  setResource(character: Character, resourceId: string, value: number): boolean {
    const resourceInstance = character.resources.find(r => r.definition.id === resourceId);
    if (!resourceInstance) {
      return false;
    }

    resourceInstance.current = Math.max(resourceInstance.definition.minValue, Math.min(value, resourceInstance.definition.maxValue));
    return true;
  }

  /**
   * Reset resources based on condition
   */
  resetResourcesByCondition(character: Character, condition: ResourceResetCondition): { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: ResourceInstance }[] {
    const entries: { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: ResourceInstance }[] = [];

    for (const resourceInstance of character.resources) {
      if (resourceInstance.definition.resetCondition !== condition) continue;

      let newValue: number;

      switch (resourceInstance.definition.resetType) {
        case 'to_max':
          newValue = resourceInstance.definition.maxValue;
          break;
        case 'to_zero':
          newValue = resourceInstance.definition.minValue;
          break;
        case 'to_default':
          newValue = resourceInstance.definition.resetValue || resourceInstance.definition.maxValue; // Default to max if no resetValue specified
          break;
        default:
          continue;
      }

      if (resourceInstance.current !== newValue) {
        const amount = Math.abs(newValue - resourceInstance.current);
        const type = newValue > resourceInstance.current ? 'restore' : 'spend';
        
        resourceInstance.current = newValue;
        
        entries.push({
          resourceId: resourceInstance.definition.id,
          amount,
          type,
          resource: resourceInstance,
        });
      }
    }

    return entries;
  }

  /**
   * Reset resources on safe rest
   */
  resetResourcesOnSafeRest(character: Character) {
    return this.resetResourcesByCondition(character, 'safe_rest');
  }

  /**
   * Reset resources on encounter end
   */
  resetResourcesOnEncounterEnd(character: Character) {
    return this.resetResourcesByCondition(character, 'encounter_end');
  }

  /**
   * Reset resources on turn end
   */
  resetResourcesOnTurnEnd(character: Character) {
    return this.resetResourcesByCondition(character, 'turn_end');
  }

  /**
   * Create a log entry for resource usage
   */
  createResourceLogEntry(entry: { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: ResourceInstance }): ResourceUsageEntry {
    return {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type: 'resource',
      resourceId: entry.resourceId,
      resourceName: entry.resource.definition.name,
      amount: entry.amount,
      action: entry.type === 'spend' ? 'spent' : 'restored',
      currentAmount: entry.resource.current,
      maxAmount: entry.resource.definition.maxValue,
      description: `${entry.type === 'spend' ? 'Spent' : 'Restored'} ${entry.amount} ${entry.resource.definition.name}`,
    };
  }
}

export const resourceService = new ResourceService();