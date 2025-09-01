import { Character, SelectedPoolFeature } from '../types/character';
import { ClassDefinition, ClassFeature, ClassFeatureGrant, AbilityFeature, StatBoostFeature, ProficiencyFeature, SpellSchoolFeature, SpellTierAccessFeature, ResourceFeature, SubclassChoiceFeature, SubclassDefinition, PickFeatureFromPoolFeature, FeaturePool } from '../types/class';
import { ResourceInstance, createResourceInstance } from '../types/resources';
import { getSubclassDefinition, getSubclassFeaturesForLevel, getAllSubclassFeaturesUpToLevel } from '../data/subclasses/index';
import { SpellAbility } from '../types/abilities';
import { IClassService, ICharacterService } from './interfaces';
import { ContentRepositoryService } from './content-repository-service';

/**
 * Class Service with Dependency Injection
 * Manages class features and progression without tight coupling
 */
export class ClassService implements IClassService {
  private contentRepository: ContentRepositoryService;

  constructor(private characterService: ICharacterService) {
    this.contentRepository = ContentRepositoryService.getInstance();
  }

  /**
   * Get the class definition for a character
   */
  getCharacterClass(character: Character): ClassDefinition | null {
    return this.contentRepository.getClassDefinition(character.classId);
  }

  /**
   * Get the subclass definition for a character
   */
  getCharacterSubclass(character: Character): SubclassDefinition | null {
    if (!character.subclassId) return null;
    return getSubclassDefinition(character.subclassId);
  }

  /**
   * Get all features that should be available to a character at their current level
   */
  getExpectedFeaturesForCharacter(character: Character): ClassFeature[] {
    const classFeatures = this.contentRepository.getAllClassFeaturesUpToLevel(character.classId, character.level);
    
    // Add subclass features if character has a subclass
    if (character.subclassId) {
      const subclassFeatures = getAllSubclassFeaturesUpToLevel(character.subclassId, character.level);
      return [...classFeatures, ...subclassFeatures];
    }
    
    return classFeatures;
  }

  /**
   * Get features that are missing for a character (should have but don't)
   */
  getMissingFeatures(character: Character): ClassFeature[] {
    const expectedFeatures = this.getExpectedFeaturesForCharacter(character);
    const grantedFeatureIds = new Set(character.grantedFeatures);
    
    return expectedFeatures.filter(feature => {
      // Generate feature ID based on whether it's from class or subclass
      let featureId: string;
      
      // Check if this feature comes from a subclass
      if (character.subclassId) {
        const subclassFeatures = getAllSubclassFeaturesUpToLevel(character.subclassId, character.level);
        const isSubclassFeature = subclassFeatures.some(sf => sf.name === feature.name && sf.level === feature.level);
        
        if (isSubclassFeature) {
          featureId = this.generateSubclassFeatureId(character.subclassId, feature.level, feature.name);
        } else {
          featureId = this.generateFeatureId(character.classId, feature.level, feature.name);
        }
      } else {
        featureId = this.generateFeatureId(character.classId, feature.level, feature.name);
      }
      
      return !grantedFeatureIds.has(featureId);
    });
  }

  /**
   * Get features that are granted for a specific level
   */
  getFeaturesForLevel(classId: string, level: number): ClassFeature[] {
    return this.contentRepository.getClassFeaturesForLevel(classId, level);
  }

  /**
   * Generate a unique ID for a class feature grant
   */
  generateFeatureId(classId: string, level: number, featureName: string, subclassId?: string): string {
    const prefix = subclassId || classId;
    return `${prefix}-${level}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
  }

  /**
   * Generate a feature ID for a subclass feature
   */
  generateSubclassFeatureId(subclassId: string, level: number, featureName: string): string {
    return this.generateFeatureId('', level, featureName, subclassId);
  }

  /**
   * Level up a character and grant new features
   */
  async levelUpCharacter(targetLevel: number): Promise<ClassFeatureGrant[]> {
    const character = this.characterService.character;
    if (!character) {
      throw new Error('No character loaded');
    }

    if (targetLevel <= character.level) {
      throw new Error('Target level must be higher than current level');
    }

    const newFeatures: ClassFeatureGrant[] = [];
    const classDef = this.getCharacterClass(character);
    if (!classDef) {
      throw new Error(`Class not found: ${character.classId}`);
    }

    // Grant features for each level from current+1 to target level
    for (let level = character.level + 1; level <= targetLevel; level++) {
      const levelFeatures = this.getFeaturesForLevel(character.classId, level);
      
      for (const feature of levelFeatures) {
        const featureGrant = await this.grantFeature(character, feature, level);
        newFeatures.push(featureGrant);
      }
    }

    // Update character level
    const updatedCharacter = {
      ...character,
      level: targetLevel,
      // Update hit dice to match new level
      hitDice: {
        ...character.hitDice,
        size: classDef.hitDieSize,
        max: targetLevel,
        current: Math.min(character.hitDice.current + (targetLevel - character.level), targetLevel)
      }
    };

    await this.characterService.updateCharacter(updatedCharacter);
    return newFeatures;
  }

  /**
   * Grant a specific feature to a character
   */
  async grantFeature(character: Character, feature: ClassFeature, level: number): Promise<ClassFeatureGrant> {
    const featureId = this.generateFeatureId(character.classId, level, feature.name);
    
    // Create the feature grant record
    const featureGrant: ClassFeatureGrant = {
      featureId,
      classId: character.classId,
      level,
      feature,
      grantedAt: new Date()
    };

    // Add to character's granted features
    const updatedGrantedFeatures = [...character.grantedFeatures, featureId];

    // Apply the feature effects
    let updatedCharacter = {
      ...character,
      grantedFeatures: updatedGrantedFeatures
    };

    // Apply feature effects
    updatedCharacter = await this.applyFeatureEffects(updatedCharacter, feature);

    await this.characterService.updateCharacter(updatedCharacter);
    return featureGrant;
  }

  /**
   * Grant an ability-type feature (adds ability to character's abilities)
   */
  private async grantAbilityFeature(character: Character, feature: AbilityFeature): Promise<Character> {
    // Check if ability already exists to avoid duplicates
    const existingAbility = character.abilities.abilities.find(ability => ability.id === feature.ability.id);
    if (existingAbility) {
      // If ability already exists, don't add it again
      return character;
    }

    // Add the ability directly to character's abilities
    const updatedAbilities = {
      ...character.abilities,
      abilities: [...character.abilities.abilities, feature.ability]
    };

    return {
      ...character,
      abilities: updatedAbilities
    };
  }

  /**
   * Grant a stat boost feature (increases character attributes)
   */
  private async grantStatBoostFeature(character: Character, feature: StatBoostFeature): Promise<Character> {
    let updatedAttributes = { ...character.attributes };

    // Apply each stat boost
    for (const boost of feature.statBoosts) {
      updatedAttributes[boost.attribute] = Math.min(
        10, // Cap at maximum attribute value
        updatedAttributes[boost.attribute] + boost.amount
      );
    }

    return {
      ...character,
      attributes: updatedAttributes
    };
  }

  /**
   * Grant a proficiency feature (adds proficiencies to character)
   */
  private async grantProficiencyFeature(character: Character, feature: ProficiencyFeature): Promise<Character> {
    // For now, proficiencies are just recorded as granted features
    // In the future, we could add a proficiencies system to the character model
    return character;
  }

  /**
   * Synchronize character spells based on their spell school access and tier access
   */
  private syncCharacterSpells(character: Character): Character {
    // Find all spell school features the character has been granted
    const expectedFeatures = this.getExpectedFeaturesForCharacter(character);
    const spellSchoolFeatures = expectedFeatures.filter(f => f.type === 'spell_school') as SpellSchoolFeature[];
    
    // Get all spells the character should have access to
    const eligibleSpells: SpellAbility[] = [];
    
    for (const schoolFeature of spellSchoolFeatures) {
      const schoolSpells = this.contentRepository.getSpellsBySchool(schoolFeature.spellSchool.schoolId);
      
      // Filter by character's spell tier access
      const accessibleSpells = schoolSpells.filter(spell => spell.tier <= character.spellTierAccess);
      eligibleSpells.push(...accessibleSpells);
    }
    
    // Get current spell abilities
    const currentSpells = character.abilities.abilities.filter(ability => ability.type === 'spell') as SpellAbility[];
    const currentSpellIds = new Set(currentSpells.map(spell => spell.id));
    
    // Find missing spells
    const missingSpells = eligibleSpells.filter(spell => !currentSpellIds.has(spell.id));
    
    // Add missing spells to character's abilities
    if (missingSpells.length > 0) {
      const nonSpellAbilities = character.abilities.abilities.filter(ability => ability.type !== 'spell');
      const allAbilities = [...nonSpellAbilities, ...currentSpells, ...missingSpells];
      
      return {
        ...character,
        abilities: {
          ...character.abilities,
          abilities: allAbilities
        }
      };
    }
    
    return character;
  }

  /**
   * Grant spell school feature (adds spellcasting capabilities and syncs spells)
   */
  private async grantSpellSchoolFeature(character: Character, feature: SpellSchoolFeature): Promise<Character> {
    // Sync spells after granting the school access
    return this.syncCharacterSpells(character);
  }

  /**
   * Grant spell tier access feature (increases max spell tier and syncs spells)
   */
  private async grantSpellTierAccessFeature(character: Character, feature: SpellTierAccessFeature): Promise<Character> {
    // Update the character's spell tier access to the highest tier they can now access
    const newSpellTierAccess = Math.max(character.spellTierAccess, feature.maxTier);
    
    const updatedCharacter = {
      ...character,
      spellTierAccess: newSpellTierAccess
    };
    
    // Sync spells after updating tier access
    return this.syncCharacterSpells(updatedCharacter);
  }

  /**
   * Grant resource feature (adds new resources like Ki Points, etc.)
   */
  private async grantResourceFeature(character: Character, feature: ResourceFeature): Promise<Character> {
    const { resourceDefinition, startingAmount } = feature;
    
    // Check if resource already exists to avoid duplicates
    const existingResource = character.resources.find(r => r.definition.id === resourceDefinition.id);
    if (existingResource) {
      // If resource already exists, don't add it again
      return character;
    }

    // Create a resource instance from the definition
    const resourceInstance = createResourceInstance(
      resourceDefinition,
      startingAmount, // Use provided starting amount or default to maxValue
      character.resources.length + 1 // Sort order
    );

    // Add the resource to character's resources
    const updatedResources = [...character.resources, resourceInstance];

    return {
      ...character,
      resources: updatedResources
    };
  }

  /**
   * Grant subclass choice feature (records that player can choose a subclass)
   */
  private async grantSubclassChoiceFeature(character: Character, feature: SubclassChoiceFeature): Promise<Character> {
    // Subclass choice features are recorded as granted but don't modify the character directly
    // The actual subclass selection happens separately via selectSubclass method
    return character;
  }

  /**
   * Select a subclass for a character
   */
  async selectSubclass(characterId: string, subclassId: string): Promise<Character> {
    const character = await this.characterService.loadCharacter(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    // Validate that the subclass is available for this character's class
    const subclassDefinition = getSubclassDefinition(subclassId);
    if (!subclassDefinition) {
      throw new Error(`Subclass not found: ${subclassId}`);
    }

    if (subclassDefinition.parentClassId !== character.classId) {
      throw new Error(`Subclass ${subclassId} is not available for class ${character.classId}`);
    }

    // Check if character has the appropriate subclass choice feature
    const expectedFeatures = this.getExpectedFeaturesForCharacter(character);
    const hasSubclassChoice = expectedFeatures.some(feature => 
      feature.type === 'subclass_choice' && 
      feature.availableSubclasses.includes(subclassId)
    );

    if (!hasSubclassChoice) {
      throw new Error(`Character does not have access to subclass ${subclassId} at their current level`);
    }

    // Update character with selected subclass
    const updatedCharacter = {
      ...character,
      subclassId: subclassId
    };

    // Save the updated character
    await this.characterService.updateCharacter(updatedCharacter);

    // Sync any missing subclass features
    await this.syncCharacterFeatures();

    return this.characterService.getCurrentCharacter()!;
  }

  /**
   * Get available subclass choices for a character at their current level
   */
  getAvailableSubclassChoices(character: Character): SubclassChoiceFeature[] {
    const expectedFeatures = this.getExpectedFeaturesForCharacter(character);
    return expectedFeatures.filter(feature => feature.type === 'subclass_choice') as SubclassChoiceFeature[];
  }

  /**
   * Check if character can choose a subclass
   */
  canChooseSubclass(character: Character): boolean {
    // Can choose if they don't have a subclass and have subclass choice features available
    return !character.subclassId && this.getAvailableSubclassChoices(character).length > 0;
  }

  /**
   * Check if character needs to catch up on missing features
   */
  async syncCharacterFeatures(): Promise<ClassFeatureGrant[]> {
    let character = this.characterService.character;
    if (!character) {
      throw new Error('No character loaded');
    }

    const missingFeatures = this.getMissingFeatures(character);
    const grantedFeatures: ClassFeatureGrant[] = [];

    for (const feature of missingFeatures) {
      const featureGrant = await this.grantFeature(character, feature, feature.level);
      grantedFeatures.push(featureGrant);
      
      // Get the updated character after granting the feature
      character = this.characterService.getCurrentCharacter();
      if (!character) {
        throw new Error('Character became null after granting feature');
      }
    }

    return grantedFeatures;
  }

  /**
   * Apply the effects of a feature to a character
   */
  private async applyFeatureEffects(character: Character, feature: ClassFeature): Promise<Character> {
    switch (feature.type) {
      case 'ability':
        return await this.grantAbilityFeature(character, feature);
      case 'stat_boost':
        return await this.grantStatBoostFeature(character, feature);
      case 'proficiency':
        return await this.grantProficiencyFeature(character, feature);
      case 'spell_school':
        return await this.grantSpellSchoolFeature(character, feature);
      case 'spell_tier_access':
        return await this.grantSpellTierAccessFeature(character, feature);
      case 'resource':
        return await this.grantResourceFeature(character, feature);
      case 'subclass_choice':
        return await this.grantSubclassChoiceFeature(character, feature);
      case 'pick_feature_from_pool':
        return await this.grantPickFeatureFromPoolFeature(character, feature);
      case 'passive_feature':
        // Passive features don't need special handling beyond being recorded
        return character;
      default:
        return character;
    }
  }

  /**
   * Grant a pick feature from pool feature - this just records that the choice is available
   */
  private async grantPickFeatureFromPoolFeature(character: Character, feature: PickFeatureFromPoolFeature): Promise<Character> {
    // For pick feature from pool features, we don't automatically grant anything
    // The feature simply unlocks the ability to make choices from the specified pool
    // The actual selection happens through UI interaction
    return character;
  }

  /**
   * Get feature pool by ID
   */
  getFeaturePool(classId: string, poolId: string): FeaturePool | undefined {
    const classDefinition = this.contentRepository.getClassDefinition(classId);
    return classDefinition?.featurePools?.find((pool: FeaturePool) => pool.id === poolId);
  }

  /**
   * Get available pool features that can be selected by a character
   */
  getAvailablePoolFeatures(character: Character, poolId: string): ClassFeature[] {
    const pool = this.getFeaturePool(character.classId, poolId);
    if (!pool) {
      return [];
    }

    // Filter out features that have already been selected
    const selectedFeatureIds = new Set(
      character.selectedPoolFeatures
        .filter(selected => selected.poolId === poolId)
        .map(selected => selected.featureId)
    );

    return pool.features.filter(feature => {
      return !selectedFeatureIds.has(feature.id);
    });
  }

  /**
   * Get pick feature from pool features that are available for a character
   */
  getAvailablePoolSelections(character: Character): PickFeatureFromPoolFeature[] {
    const expectedFeatures = this.getExpectedFeaturesForCharacter(character);
    return expectedFeatures.filter(feature => feature.type === 'pick_feature_from_pool') as PickFeatureFromPoolFeature[];
  }

  /**
   * Select a feature from a pool
   */
  async selectPoolFeature(character: Character, poolId: string, selectedFeature: ClassFeature, grantedByFeatureId: string): Promise<Character> {
    // Check if the feature is available for selection
    const availableFeatures = this.getAvailablePoolFeatures(character, poolId);
    
    if (!availableFeatures.some(f => f.id === selectedFeature.id)) {
      throw new Error(`Feature "${selectedFeature.name}" is not available for selection from pool "${poolId}"`);
    }

    // Create the selected pool feature record
    const selectedPoolFeature: SelectedPoolFeature = {
      poolId,
      featureId: selectedFeature.id,
      feature: selectedFeature,
      selectedAt: new Date(),
      grantedByFeatureId
    };

    // Add to character's selected pool features
    const updatedCharacter = {
      ...character,
      selectedPoolFeatures: [...character.selectedPoolFeatures, selectedPoolFeature]
    };

    // Apply the feature effects
    let finalCharacter = await this.applyFeatureEffects(updatedCharacter, selectedFeature);

    await this.characterService.updateCharacter(finalCharacter);
    return finalCharacter;
  }


  /**
   * Check if character has pending pool selections to make
   */
  hasPendingPoolSelections(character: Character): boolean {
    const availableSelections = this.getAvailablePoolSelections(character);
    return availableSelections.length > 0;
  }

  /**
   * Get count of remaining selections for a specific pool selection feature
   */
  getRemainingPoolSelections(character: Character, pickFeatureFromPoolFeature: PickFeatureFromPoolFeature): number {
    const grantedByFeatureId = this.generateFeatureId(character.classId, pickFeatureFromPoolFeature.level, pickFeatureFromPoolFeature.name);
    const currentSelections = character.selectedPoolFeatures.filter(
      selected => selected.grantedByFeatureId === grantedByFeatureId
    ).length;
    
    return Math.max(0, pickFeatureFromPoolFeature.choicesAllowed - currentSelections);
  }
}