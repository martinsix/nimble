import { Character } from '../types/character';
import { ClassDefinition, ClassFeature, ClassFeatureGrant, AbilityFeature, StatBoostFeature, ProficiencyFeature, SpellAccessFeature, ResourceFeature } from '../types/class';
import { getClassDefinition, getClassFeaturesForLevel, getAllClassFeaturesUpToLevel } from '../data/classes';
import { characterService } from './character-service';

export class ClassService {
  /**
   * Get the class definition for a character
   */
  getCharacterClass(character: Character): ClassDefinition | null {
    return getClassDefinition(character.classId);
  }

  /**
   * Get all features that should be available to a character at their current level
   */
  getExpectedFeaturesForCharacter(character: Character): ClassFeature[] {
    return getAllClassFeaturesUpToLevel(character.classId, character.level);
  }

  /**
   * Get features that are missing for a character (should have but don't)
   */
  getMissingFeatures(character: Character): ClassFeature[] {
    const expectedFeatures = this.getExpectedFeaturesForCharacter(character);
    const grantedFeatureIds = new Set(character.grantedFeatures);
    
    return expectedFeatures.filter(feature => {
      const featureId = this.generateFeatureId(character.classId, feature.level, feature.name);
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
  generateFeatureId(classId: string, level: number, featureName: string): string {
    return `${classId}-${level}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
  }

  /**
   * Level up a character and grant new features
   */
  async levelUpCharacter(targetLevel: number): Promise<ClassFeatureGrant[]> {
    const character = characterService.character;
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

    await characterService.updateCharacter(updatedCharacter);
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
      case 'spell_access':
        updatedCharacter = await this.grantSpellAccessFeature(updatedCharacter, feature);
        break;
      case 'resource':
        updatedCharacter = await this.grantResourceFeature(updatedCharacter, feature);
        break;
      case 'passive_feature':
        // Passive features don't need special handling beyond being recorded
        break;
    }

    await characterService.updateCharacter(updatedCharacter);
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
   * Grant spell access feature (adds spellcasting capabilities)
   */
  private async grantSpellAccessFeature(character: Character, feature: SpellAccessFeature): Promise<Character> {
    // For now, spell access is just recorded as granted features
    // In the future, we could add a spellcasting system to the character model
    return character;
  }

  /**
   * Grant resource feature (adds new resources like Ki Points, etc.)
   */
  private async grantResourceFeature(character: Character, feature: ResourceFeature): Promise<Character> {
    // For now, resources are just recorded as granted features
    // In the future, we could add a resources system to the character model
    return character;
  }

  /**
   * Check if character needs to catch up on missing features
   */
  async syncCharacterFeatures(): Promise<ClassFeatureGrant[]> {
    const character = characterService.character;
    if (!character) {
      throw new Error('No character loaded');
    }

    const missingFeatures = this.getMissingFeatures(character);
    const grantedFeatures: ClassFeatureGrant[] = [];

    for (const feature of missingFeatures) {
      const featureGrant = await this.grantFeature(character, feature, feature.level);
      grantedFeatures.push(featureGrant);
    }

    return grantedFeatures;
  }
}

export const classService = new ClassService();