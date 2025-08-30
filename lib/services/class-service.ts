import { Character } from '../types/character';
import { ClassDefinition, ClassFeature, ClassFeatureGrant, AbilityFeature, StatBoostFeature, ProficiencyFeature, SpellSchoolFeature, SpellTierAccessFeature, ResourceFeature, SubclassChoiceFeature, SubclassDefinition } from '../types/class';
import { ResourceInstance, createResourceInstance } from '../types/resources';
import { getClassDefinition, getClassFeaturesForLevel, getAllClassFeaturesUpToLevel } from '../data/classes/index';
import { getSubclassDefinition, getSubclassFeaturesForLevel, getAllSubclassFeaturesUpToLevel } from '../data/subclasses/index';
import { getSpellsBySchool } from '../data/example-abilities';
import { SpellAbility } from '../types/abilities';
import { IClassService, ICharacterService } from './interfaces';

/**
 * Class Service with Dependency Injection
 * Manages class features and progression without tight coupling
 */
export class ClassService implements IClassService {
  constructor(private characterService: ICharacterService) {}

  /**
   * Get the class definition for a character
   */
  getCharacterClass(character: Character): ClassDefinition | null {
    return getClassDefinition(character.classId);
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
    const classFeatures = getAllClassFeaturesUpToLevel(character.classId, character.level);
    
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
    return getClassFeaturesForLevel(classId, level);
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

    // Handle different feature types
    switch (feature.type) {
      case 'ability':
        updatedCharacter = await this.grantAbilityFeature(updatedCharacter, feature);
        break;
      case 'stat_boost':
        updatedCharacter = await this.grantStatBoostFeature(updatedCharacter, feature);
        break;
      case 'proficiency':
        updatedCharacter = await this.grantProficiencyFeature(updatedCharacter, feature);
        break;
      case 'spell_school':
        updatedCharacter = await this.grantSpellSchoolFeature(updatedCharacter, feature);
        break;
      case 'spell_tier_access':
        updatedCharacter = await this.grantSpellTierAccessFeature(updatedCharacter, feature);
        break;
      case 'resource':
        updatedCharacter = await this.grantResourceFeature(updatedCharacter, feature);
        break;
      case 'subclass_choice':
        updatedCharacter = await this.grantSubclassChoiceFeature(updatedCharacter, feature);
        break;
      case 'passive_feature':
        // Passive features don't need special handling beyond being recorded
        break;
    }

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
      const schoolSpells = getSpellsBySchool(schoolFeature.spellSchool.schoolId);
      
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
}