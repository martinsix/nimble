import { Character } from '../types/character';
import { ICharacterCreation, ICharacterStorage, ICharacterService, IClassService, IAncestryService, IBackgroundService } from './interfaces';
import { ContentRepositoryService } from './content-repository-service';
import { 
  createDefaultCharacterConfiguration, 
  createDefaultHitPoints, 
  createDefaultHitDice, 
  createDefaultProficiencies,
  createDefaultSkills,
  createDefaultInventory,
  createDefaultInitiative,
  createDefaultActionTracker,
  createDefaultAbilities,
  createDefaultWounds,
  createDefaultResources
} from '../utils/character-defaults';

export interface CreateCharacterOptions {
  name: string;
  ancestryId?: string;
  backgroundId?: string;
  classId: string;
  level?: number;
  attributes?: {
    strength: number;
    dexterity: number;
    intelligence: number;
    will: number;
  };
}

/**
 * Character Creation Service with Dependency Injection
 * Handles character creation and initialization without tight coupling
 */
export class CharacterCreationService implements ICharacterCreation {
  private contentRepository: ContentRepositoryService;

  constructor(
    private characterStorage: ICharacterStorage,
    private characterService: ICharacterService,
    private classService: IClassService,
    private ancestryService: IAncestryService,
    private backgroundService: IBackgroundService
  ) {
    this.contentRepository = ContentRepositoryService.getInstance();
  }

  /**
   * Creates a new character with proper initialization and class features
   */
  async createCharacterWithClass(options: CreateCharacterOptions): Promise<Character> {
    const {
      name,
      ancestryId = 'human',
      backgroundId = 'folk-hero',
      classId,
      level = 1,
      attributes = { strength: 0, dexterity: 0, intelligence: 0, will: 0 }
    } = options;

    // Validate class exists
    const classDefinition = this.contentRepository.getClassDefinition(classId);
    if (!classDefinition) {
      throw new Error(`Class not found: ${classId}`);
    }

    // Validate ancestry exists
    const ancestryDefinition = this.contentRepository.getAncestryDefinition(ancestryId);
    if (!ancestryDefinition) {
      throw new Error(`Ancestry not found: ${ancestryId}`);
    }

    // Validate background exists
    const backgroundDefinition = this.contentRepository.getBackgroundDefinition(backgroundId);
    if (!backgroundDefinition) {
      throw new Error(`Background not found: ${backgroundId}`);
    }

    // Create ancestry and background traits
    const ancestry = this.ancestryService.createAncestryTrait(ancestryId);
    const background = this.backgroundService.createBackgroundTrait(backgroundId);

    // Create base character configuration
    const config = createDefaultCharacterConfiguration();
    const hitPoints = createDefaultHitPoints(classDefinition.startingHP);
    const hitDice = createDefaultHitDice(level, classDefinition.hitDieSize);
    const proficiencies = createDefaultProficiencies(classDefinition);

    // Create the base character
    const characterId = `character-${Date.now()}`;
    const baseCharacter = await this.characterStorage.createCharacter({
      name,
      ancestry,
      background,
      level,
      classId,
      grantedFeatures: [], // Start with no features
      spellTierAccess: 0, // No spell access by default - class features will grant this
      proficiencies,
      attributes,
      saveAdvantages: { ...classDefinition.saveAdvantages }, // Initialize from class defaults
      hitPoints,
      hitDice,
      wounds: createDefaultWounds(config.maxWounds),
      resources: createDefaultResources(), // Initialize with default resources
      config,
      initiative: createDefaultInitiative(),
      actionTracker: createDefaultActionTracker(),
      inEncounter: false,
      skills: createDefaultSkills(),
      inventory: createDefaultInventory(attributes.strength),
      abilities: createDefaultAbilities(),
    }, characterId);

    // Initialize the character service with the new character
    await this.characterService.loadCharacter(baseCharacter.id);

    // Apply class features for the character's level
    await this.classService.syncCharacterFeatures();

    // Apply ancestry features
    await this.ancestryService.grantAncestryFeatures(baseCharacter.id);

    // Apply background features
    await this.backgroundService.grantBackgroundFeatures(baseCharacter.id);

    // Get the final character with all features applied
    const finalCharacter = await this.characterStorage.getCharacter(baseCharacter.id);
    if (!finalCharacter) {
      throw new Error('Failed to retrieve created character');
    }

    return finalCharacter;
  }

  /**
   * Creates a character with sample attributes for quick setup
   */
  async createSampleCharacter(name: string, classId: string): Promise<Character> {
    // Define sample attributes based on class
    const classDefinition = this.contentRepository.getClassDefinition(classId);
    let sampleAttributes = { strength: 1, dexterity: 1, intelligence: 1, will: 1 };

    if (classDefinition) {
      const [primary, secondary] = classDefinition.keyAttributes;
      sampleAttributes = {
        strength: primary === 'strength' || secondary === 'strength' ? 3 : 1,
        dexterity: primary === 'dexterity' || secondary === 'dexterity' ? 3 : 1,
        intelligence: primary === 'intelligence' || secondary === 'intelligence' ? 3 : 1,
        will: primary === 'will' || secondary === 'will' ? 3 : 1,
      };
    }

    return this.createCharacterWithClass({
      name,
      classId,
      level: 1,
      attributes: sampleAttributes
    });
  }

  /**
   * Initializes a character in the character service and applies missing features
   */
  async initializeCharacter(characterId: string): Promise<Character | null> {
    // Load character into character service
    const character = await this.characterService.loadCharacter(characterId);
    if (!character) {
      return null;
    }

    // Sync any missing class features
    await this.classService.syncCharacterFeatures();

    // Return the updated character
    return this.characterService.getCurrentCharacter();
  }
}