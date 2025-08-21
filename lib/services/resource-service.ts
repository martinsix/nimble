import { Character } from '../types/character';
import { 
  CharacterResource, 
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
  getCharacterResource(character: Character, resourceId: string): CharacterResource | null {
    return character.resources.find(r => r.id === resourceId) || null;
  }

  /**
   * Get all resources for a character
   */
  getActiveResources(character: Character): CharacterResource[] {
    return character.resources;
  }

  /**
   * Add a resource to a character
   */
  addResourceToCharacter(character: Character, resource: CharacterResource): CharacterResource {
    // Check if character already has this resource
    const existing = this.getCharacterResource(character, resource.id);
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
    const index = character.resources.findIndex(r => r.id === resourceId);
    if (index === -1) {
      return false;
    }

    character.resources.splice(index, 1);
    return true;
  }

  /**
   * Spend resource points
   */
  spendResource(character: Character, resourceId: string, amount: number): { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: CharacterResource } | null {
    const resource = this.getCharacterResource(character, resourceId);
    if (!resource) {
      return null;
    }

    const actualAmount = Math.min(amount, resource.current);
    resource.current = Math.max(resource.minValue, resource.current - actualAmount);

    return {
      resourceId,
      amount: actualAmount,
      type: 'spend',
      resource,
    };
  }

  /**
   * Restore resource points
   */
  restoreResource(character: Character, resourceId: string, amount: number): { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: CharacterResource } | null {
    const resource = this.getCharacterResource(character, resourceId);
    if (!resource) {
      return null;
    }

    const actualAmount = Math.min(amount, resource.maxValue - resource.current);
    resource.current = Math.min(resource.maxValue, resource.current + actualAmount);

    return {
      resourceId,
      amount: actualAmount,
      type: 'restore',
      resource,
    };
  }

  /**
   * Set resource to a specific value
   */
  setResource(character: Character, resourceId: string, value: number): boolean {
    const resource = this.getCharacterResource(character, resourceId);
    if (!resource) {
      return false;
    }

    resource.current = Math.max(resource.minValue, Math.min(value, resource.maxValue));
    return true;
  }

  /**
   * Reset resources based on condition
   */
  resetResourcesByCondition(character: Character, condition: ResourceResetCondition): { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: CharacterResource }[] {
    const entries: { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: CharacterResource }[] = [];

    for (const resource of character.resources) {
      if (resource.resetCondition !== condition) continue;

      let newValue: number;

      switch (resource.resetType) {
        case 'to_max':
          newValue = resource.maxValue;
          break;
        case 'to_zero':
          newValue = resource.minValue;
          break;
        case 'to_default':
          newValue = resource.resetValue || resource.maxValue; // Default to max if no resetValue specified
          break;
        default:
          continue;
      }

      if (resource.current !== newValue) {
        const amount = Math.abs(newValue - resource.current);
        const type = newValue > resource.current ? 'restore' : 'spend';
        
        resource.current = newValue;
        
        entries.push({
          resourceId: resource.id,
          amount,
          type,
          resource,
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
  createResourceLogEntry(entry: { resourceId: string; amount: number; type: 'spend' | 'restore'; resource: CharacterResource }): ResourceUsageEntry {
    return {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type: 'resource',
      resourceId: entry.resourceId,
      resourceName: entry.resource.name,
      amount: entry.amount,
      action: entry.type === 'spend' ? 'spent' : 'restored',
      currentAmount: entry.resource.current,
      maxAmount: entry.resource.maxValue,
      description: `${entry.type === 'spend' ? 'Spent' : 'Restored'} ${entry.amount} ${entry.resource.name}`,
    };
  }
}

export const resourceService = new ResourceService();