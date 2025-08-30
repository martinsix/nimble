import { serviceContainer, SERVICE_KEYS } from './service-container';
import { CharacterService } from './character-service';
import { ClassService } from './class-service';
import { CharacterCreationService } from './character-creation-service';
import { 
  ICharacterService, 
  ICharacterStorage, 
  IActivityLog, 
  IAbilityService, 
  IClassService, 
  ICharacterCreation 
} from './interfaces';

// Import existing services that implement the interfaces
import { characterStorageService } from './character-storage-service';
import { activityLogService } from './activity-log-service';
import { abilityService } from './ability-service';
import { diceService } from './dice-service';
import { settingsService } from './settings-service';
import { ContentRepositoryService } from './content-repository-service';

// Import types for external services
import type { DiceService } from './dice-service';
import type { SettingsService } from './settings-service';

/**
 * Service Factory
 * Sets up dependency injection container with all services
 */
export class ServiceFactory {
  private static initialized = false;

  /**
   * Initialize the service container with all dependencies
   */
  static initialize(): void {
    if (this.initialized) return;

    // Register existing services that already implement interfaces
    serviceContainer.register(
      SERVICE_KEYS.CHARACTER_STORAGE,
      () => characterStorageService,
      true // singleton
    );

    serviceContainer.register(
      SERVICE_KEYS.ACTIVITY_LOG,
      () => activityLogService,
      true // singleton
    );

    serviceContainer.register(
      SERVICE_KEYS.ABILITY_SERVICE,
      () => abilityService,
      true // singleton
    );

    serviceContainer.register(
      SERVICE_KEYS.DICE_SERVICE,
      () => diceService,
      true // singleton
    );

    serviceContainer.register(
      SERVICE_KEYS.SETTINGS_SERVICE,
      () => settingsService,
      true // singleton
    );

    // Register services with dependency injection
    serviceContainer.register(
      SERVICE_KEYS.CHARACTER_SERVICE,
      (container) => new CharacterService(
        container.get(SERVICE_KEYS.CHARACTER_STORAGE),
        container.get(SERVICE_KEYS.ACTIVITY_LOG),
        container.get(SERVICE_KEYS.ABILITY_SERVICE)
      ),
      true // singleton
    );

    serviceContainer.register(
      SERVICE_KEYS.CLASS_SERVICE,
      (container) => new ClassService(
        container.get(SERVICE_KEYS.CHARACTER_SERVICE)
      ),
      true // singleton
    );

    serviceContainer.register(
      SERVICE_KEYS.CHARACTER_CREATION,
      (container) => new CharacterCreationService(
        container.get(SERVICE_KEYS.CHARACTER_STORAGE),
        container.get(SERVICE_KEYS.CHARACTER_SERVICE),
        container.get(SERVICE_KEYS.CLASS_SERVICE)
      ),
      true // singleton
    );

    this.initialized = true;
  }

  /**
   * Get a service instance from the container
   */
  static getService<T>(key: string): T {
    this.initialize();
    return serviceContainer.get<T>(key);
  }

  /**
   * Reset the service container (useful for testing)
   */
  static reset(): void {
    serviceContainer.clearSingletons();
    this.initialized = false;
  }
}

// Convenience functions for getting services with proper types
export const getCharacterService = (): ICharacterService => ServiceFactory.getService(SERVICE_KEYS.CHARACTER_SERVICE);
export const getCharacterStorage = (): ICharacterStorage => ServiceFactory.getService(SERVICE_KEYS.CHARACTER_STORAGE);
export const getActivityLog = (): IActivityLog => ServiceFactory.getService(SERVICE_KEYS.ACTIVITY_LOG);
export const getAbilityService = (): IAbilityService => ServiceFactory.getService(SERVICE_KEYS.ABILITY_SERVICE);
export const getClassService = (): IClassService => ServiceFactory.getService(SERVICE_KEYS.CLASS_SERVICE);
export const getCharacterCreation = (): ICharacterCreation => ServiceFactory.getService(SERVICE_KEYS.CHARACTER_CREATION);
export const getDiceService = (): DiceService => ServiceFactory.getService(SERVICE_KEYS.DICE_SERVICE);
export const getSettingsService = (): SettingsService => ServiceFactory.getService(SERVICE_KEYS.SETTINGS_SERVICE);
export const getContentRepository = (): ContentRepositoryService => ContentRepositoryService.getInstance();