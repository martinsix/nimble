import { ClassDefinition, SubclassDefinition } from '../types/class';
import { ActionAbility, SpellAbility } from '../types/abilities';
import { ContentValidationService } from './content-validation-service';
import { CustomContentType } from '../types/custom-content';

// Built-in content imports
import { classDefinitions as builtInClasses } from '../data/classes/index';
import { 
  fireSchoolSpells, 
  radiantSchoolSpells,
  frostSchoolSpells,
  natureSchoolSpells,
  shadowSchoolSpells,
  arcaneSchoolSpells,
  getSpellsBySchool
} from '../data/example-abilities';
import { PREDEFINED_SPELL_SCHOOLS, getSpellSchoolDefinition } from '../data/spell-schools';

// Storage keys for custom content
const STORAGE_KEYS = {
  customClasses: 'nimble-navigator-custom-classes',
  customSubclasses: 'nimble-navigator-custom-subclasses',
  customSpellSchools: 'nimble-navigator-custom-spell-schools',
  customAbilities: 'nimble-navigator-custom-abilities',
  customSpells: 'nimble-navigator-custom-spells'
} as const;

// Content validation schemas
export interface ContentUploadResult {
  success: boolean;
  message: string;
  itemsAdded?: number;
}

// For content management - combines school definition with spells
export interface SpellSchoolWithSpells {
  id: string;
  name: string;
  description: string;
  spells: SpellAbility[];
}

export class ContentRepositoryService {
  private static instance: ContentRepositoryService;

  public static getInstance(): ContentRepositoryService {
    if (!ContentRepositoryService.instance) {
      ContentRepositoryService.instance = new ContentRepositoryService();
    }
    return ContentRepositoryService.instance;
  }

  // Class Management
  public getAllClasses(): ClassDefinition[] {
    const customClasses = this.getCustomClasses();
    return [...Object.values(builtInClasses), ...customClasses];
  }

  public getClassDefinition(classId: string): ClassDefinition | null {
    // Check built-in classes first
    const builtInClass = builtInClasses[classId];
    if (builtInClass) return builtInClass;

    // Check custom classes
    const customClasses = this.getCustomClasses();
    return customClasses.find(cls => cls.id === classId) || null;
  }

  public getClassFeaturesForLevel(classId: string, level: number): ClassDefinition['features'] {
    const classDef = this.getClassDefinition(classId);
    if (!classDef) return [];
    
    return classDef.features.filter(feature => feature.level === level);
  }

  public getAllClassFeaturesUpToLevel(classId: string, level: number): ClassDefinition['features'] {
    const classDef = this.getClassDefinition(classId);
    if (!classDef) return [];
    
    return classDef.features.filter(feature => feature.level <= level);
  }

  public uploadClasses(classesJson: string): ContentUploadResult {
    try {
      const data = JSON.parse(classesJson);
      const classes = Array.isArray(data) ? data : [data];
      
      // Validate using Zod schemas
      const validClasses: ClassDefinition[] = [];
      const errors: string[] = [];

      classes.forEach((cls, index) => {
        const validation = ContentValidationService.validateClass(cls);
        if (validation.valid && validation.data) {
          validClasses.push(validation.data);
        } else {
          errors.push(`Class ${index + 1}: ${validation.errors?.join(', ') || 'Invalid format'}`);
        }
      });

      if (validClasses.length === 0) {
        return { 
          success: false, 
          message: `No valid class definitions found. Errors: ${errors.join('; ')}`
        };
      }

      // Store custom classes
      const existingCustomClasses = this.getCustomClasses();
      const updatedClasses = [...existingCustomClasses];

      validClasses.forEach(newClass => {
        const existingIndex = updatedClasses.findIndex(cls => cls.id === newClass.id);
        if (existingIndex >= 0) {
          updatedClasses[existingIndex] = newClass; // Replace existing
        } else {
          updatedClasses.push(newClass); // Add new
        }
      });

      localStorage.setItem(STORAGE_KEYS.customClasses, JSON.stringify(updatedClasses));

      const message = errors.length > 0 
        ? `Successfully added/updated ${validClasses.length} class(es). ${errors.length} invalid entries skipped.`
        : `Successfully added/updated ${validClasses.length} class(es)`;

      return { 
        success: true, 
        message,
        itemsAdded: validClasses.length
      };
    } catch (error) {
      return { success: false, message: 'Invalid JSON format' };
    }
  }

  public removeCustomClass(classId: string): boolean {
    const customClasses = this.getCustomClasses();
    const filteredClasses = customClasses.filter(cls => cls.id !== classId);
    
    if (filteredClasses.length < customClasses.length) {
      localStorage.setItem(STORAGE_KEYS.customClasses, JSON.stringify(filteredClasses));
      return true;
    }
    return false;
  }

  private getCustomClasses(): ClassDefinition[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.customClasses);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Validate each class and filter out invalid ones
      const validClasses: ClassDefinition[] = [];
      parsed.forEach((item, index) => {
        const validation = ContentValidationService.validateClass(item);
        if (validation.valid && validation.data) {
          validClasses.push(validation.data);
        } else {
          console.warn(`Invalid class found in storage at index ${index}:`, validation.errors);
        }
      });
      
      // If we filtered out invalid items, update localStorage
      if (validClasses.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.customClasses, JSON.stringify(validClasses));
      }
      
      return validClasses;
    } catch (error) {
      console.warn('Error reading custom classes from storage:', error);
      return [];
    }
  }

  // Subclass Management
  public getAllSubclasses(): SubclassDefinition[] {
    return this.getCustomSubclasses();
  }

  public getSubclassesForClass(classId: string): SubclassDefinition[] {
    return this.getCustomSubclasses().filter(sub => sub.parentClassId === classId);
  }

  public uploadSubclasses(subclassesJson: string): ContentUploadResult {
    try {
      const data = JSON.parse(subclassesJson);
      const subclasses = Array.isArray(data) ? data : [data];
      
      const validSubclasses = subclasses.filter(sub => 
        sub.id && sub.name && sub.description && sub.parentClassId && sub.features
      );

      if (validSubclasses.length === 0) {
        return { success: false, message: 'No valid subclass definitions found' };
      }

      const existingSubclasses = this.getCustomSubclasses();
      const updatedSubclasses = [...existingSubclasses];

      validSubclasses.forEach(newSubclass => {
        const existingIndex = updatedSubclasses.findIndex(sub => sub.id === newSubclass.id);
        if (existingIndex >= 0) {
          updatedSubclasses[existingIndex] = newSubclass;
        } else {
          updatedSubclasses.push(newSubclass);
        }
      });

      localStorage.setItem(STORAGE_KEYS.customSubclasses, JSON.stringify(updatedSubclasses));

      return { 
        success: true, 
        message: `Successfully added/updated ${validSubclasses.length} subclass(es)`,
        itemsAdded: validSubclasses.length
      };
    } catch (error) {
      return { success: false, message: 'Invalid JSON format' };
    }
  }

  private getCustomSubclasses(): SubclassDefinition[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.customSubclasses);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Validate each subclass and filter out invalid ones
      const validSubclasses: SubclassDefinition[] = [];
      parsed.forEach((item, index) => {
        const validation = ContentValidationService.validateSubclass(item);
        if (validation.valid && validation.data) {
          validSubclasses.push(validation.data);
        } else {
          console.warn(`Invalid subclass found in storage at index ${index}:`, validation.errors);
        }
      });
      
      // If we filtered out invalid items, update localStorage
      if (validSubclasses.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.customSubclasses, JSON.stringify(validSubclasses));
      }
      
      return validSubclasses;
    } catch (error) {
      console.warn('Error reading custom subclasses from storage:', error);
      return [];
    }
  }

  // Spell School Management
  public getAllSpellSchools(): SpellSchoolWithSpells[] {
    // Initialize built-in schools on first access
    this.initializeBuiltInSchools();
    
    // Return all schools from storage (built-in + custom)
    return this.getStoredSpellSchools();
  }

  private initializeBuiltInSchools(): void {
    const stored = this.getStoredSpellSchools();
    
    // Check if built-in schools are already initialized
    const hasBuiltInSchools = PREDEFINED_SPELL_SCHOOLS.every(predefinedSchool => 
      stored.some(school => school.id === predefinedSchool.schoolId)
    );
    
    if (!hasBuiltInSchools) {
      // Create spell schools with spells from predefined definitions
      const builtInSchools: SpellSchoolWithSpells[] = PREDEFINED_SPELL_SCHOOLS.map(schoolDef => ({
        id: schoolDef.schoolId,
        name: schoolDef.name,
        description: schoolDef.description,
        spells: getSpellsBySchool(schoolDef.schoolId)
      }));

      // Merge with existing schools
      const updatedSchools = [...stored];
      builtInSchools.forEach(builtInSchool => {
        const existingIndex = updatedSchools.findIndex(school => school.id === builtInSchool.id);
        if (existingIndex === -1) {
          updatedSchools.push(builtInSchool);
        }
      });

      localStorage.setItem(STORAGE_KEYS.customSpellSchools, JSON.stringify(updatedSchools));
    }
  }

  public getSpellSchool(schoolId: string): SpellSchoolWithSpells | null {
    const allSchools = this.getAllSpellSchools();
    return allSchools.find(school => school.id === schoolId) || null;
  }

  public getSpellsBySchool(schoolId: string): SpellAbility[] {
    const school = this.getSpellSchool(schoolId);
    if (!school) return [];
    
    // Get all custom spells that belong to this school
    const customSpells = this.getCustomSpells().filter(spell => spell.school === schoolId);
    
    // Merge school's defined spells with custom spells
    return [...school.spells, ...customSpells];
  }

  public uploadSpellSchools(schoolsJson: string): ContentUploadResult {
    try {
      const data = JSON.parse(schoolsJson);
      const schools = Array.isArray(data) ? data : [data];
      
      const validSchools: SpellSchoolWithSpells[] = [];
      const errors: string[] = [];

      schools.forEach((school, index) => {
        const validation = ContentValidationService.validateSpellSchool(school);
        if (validation.valid && validation.data) {
          validSchools.push(validation.data);
        } else {
          errors.push(`School ${index + 1}: ${validation.errors?.join(', ') || 'Invalid format'}`);
        }
      });

      if (validSchools.length === 0) {
        return { 
          success: false, 
          message: `No valid spell school definitions found. Errors: ${errors.join('; ')}`
        };
      }

      const existingSchools = this.getStoredSpellSchools();
      const updatedSchools = [...existingSchools];

      validSchools.forEach(newSchool => {
        const existingIndex = updatedSchools.findIndex(school => school.id === newSchool.id);
        if (existingIndex >= 0) {
          updatedSchools[existingIndex] = newSchool;
        } else {
          updatedSchools.push(newSchool);
        }
      });

      localStorage.setItem(STORAGE_KEYS.customSpellSchools, JSON.stringify(updatedSchools));

      const message = errors.length > 0 
        ? `Successfully added/updated ${validSchools.length} spell school(s). ${errors.length} invalid entries skipped.`
        : `Successfully added/updated ${validSchools.length} spell school(s)`;

      return { 
        success: true, 
        message,
        itemsAdded: validSchools.length
      };
    } catch (error) {
      return { success: false, message: 'Invalid JSON format' };
    }
  }

  private getStoredSpellSchools(): SpellSchoolWithSpells[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.customSpellSchools);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Validate each spell school and filter out invalid ones
      const validSchools: SpellSchoolWithSpells[] = [];
      parsed.forEach((item, index) => {
        const validation = ContentValidationService.validateSpellSchool(item);
        if (validation.valid && validation.data) {
          validSchools.push(validation.data);
        } else {
          console.warn(`Invalid spell school found in storage at index ${index}:`, validation.errors);
        }
      });
      
      // If we filtered out invalid items, update localStorage
      if (validSchools.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.customSpellSchools, JSON.stringify(validSchools));
      }
      
      return validSchools;
    } catch (error) {
      console.warn('Error reading custom spell schools from storage:', error);
      return [];
    }
  }

  // Ability Management (for non-spell abilities)
  public getAllActionAbilities(): ActionAbility[] {
    const customAbilities = this.getCustomAbilities();
    return [...customAbilities];
  }

  public getActionAbility(abilityId: string): ActionAbility | null {
    const allAbilities = this.getAllActionAbilities();
    return allAbilities.find(ability => ability.id === abilityId) || null;
  }

  public uploadAbilities(abilitiesJson: string): ContentUploadResult {
    try {
      const data = JSON.parse(abilitiesJson);
      const abilities = Array.isArray(data) ? data : [data];
      
      const validAbilities: ActionAbility[] = [];
      const errors: string[] = [];

      abilities.forEach((ability, index) => {
        const validation = ContentValidationService.validateActionAbility(ability);
        if (validation.valid && validation.data) {
          validAbilities.push(validation.data);
        } else {
          errors.push(`Ability ${index + 1}: ${validation.errors?.join(', ') || 'Invalid format'}`);
        }
      });

      if (validAbilities.length === 0) {
        return { 
          success: false, 
          message: `No valid ability definitions found. Errors: ${errors.join('; ')}`
        };
      }

      const existingAbilities = this.getCustomAbilities();
      const updatedAbilities = [...existingAbilities];

      validAbilities.forEach(newAbility => {
        const existingIndex = updatedAbilities.findIndex(ability => ability.id === newAbility.id);
        if (existingIndex >= 0) {
          updatedAbilities[existingIndex] = newAbility;
        } else {
          updatedAbilities.push(newAbility);
        }
      });

      localStorage.setItem(STORAGE_KEYS.customAbilities, JSON.stringify(updatedAbilities));

      const message = errors.length > 0 
        ? `Successfully added/updated ${validAbilities.length} abilit(y/ies). ${errors.length} invalid entries skipped.`
        : `Successfully added/updated ${validAbilities.length} abilit(y/ies)`;

      return { 
        success: true, 
        message,
        itemsAdded: validAbilities.length
      };
    } catch (error) {
      return { success: false, message: 'Invalid JSON format' };
    }
  }

  private getCustomAbilities(): ActionAbility[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.customAbilities);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Validate each ability and filter out invalid ones
      const validAbilities: ActionAbility[] = [];
      parsed.forEach((item, index) => {
        const validation = ContentValidationService.validateActionAbility(item);
        if (validation.valid && validation.data) {
          validAbilities.push(validation.data);
        } else {
          console.warn(`Invalid action ability found in storage at index ${index}:`, validation.errors);
        }
      });
      
      // If we filtered out invalid items, update localStorage
      if (validAbilities.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.customAbilities, JSON.stringify(validAbilities));
      }
      
      return validAbilities;
    } catch (error) {
      console.warn('Error reading custom abilities from storage:', error);
      return [];
    }
  }

  // Spell Management (separate from abilities)
  public getAllSpells(): SpellAbility[] {
    const builtInSpells = [
      ...fireSchoolSpells, 
      ...radiantSchoolSpells,
      ...frostSchoolSpells,
      ...natureSchoolSpells,
      ...shadowSchoolSpells,
      ...arcaneSchoolSpells
    ];
    const customSpells = this.getCustomSpells();
    return [...builtInSpells, ...customSpells];
  }

  public getSpell(spellId: string): SpellAbility | null {
    const allSpells = this.getAllSpells();
    return allSpells.find(spell => spell.id === spellId) || null;
  }

  public uploadSpells(spellsJson: string): ContentUploadResult {
    try {
      const data = JSON.parse(spellsJson);
      const spells = Array.isArray(data) ? data : [data];
      
      const validSpells: SpellAbility[] = [];
      const errors: string[] = [];

      spells.forEach((spell, index) => {
        const validation = ContentValidationService.validateSpellAbility(spell);
        if (validation.valid && validation.data) {
          validSpells.push(validation.data);
        } else {
          errors.push(`Spell ${index + 1}: ${validation.errors?.join(', ') || 'Invalid format'}`);
        }
      });

      if (validSpells.length === 0) {
        return { 
          success: false, 
          message: `No valid spell definitions found. Errors: ${errors.join('; ')}`
        };
      }

      const existingSpells = this.getCustomSpells();
      const updatedSpells = [...existingSpells];

      validSpells.forEach(newSpell => {
        const existingIndex = updatedSpells.findIndex(spell => spell.id === newSpell.id);
        if (existingIndex >= 0) {
          updatedSpells[existingIndex] = newSpell;
        } else {
          updatedSpells.push(newSpell);
        }
      });

      localStorage.setItem(STORAGE_KEYS.customSpells, JSON.stringify(updatedSpells));

      const message = errors.length > 0 
        ? `Successfully added/updated ${validSpells.length} spell(s). ${errors.length} invalid entries skipped.`
        : `Successfully added/updated ${validSpells.length} spell(s)`;

      return { 
        success: true, 
        message,
        itemsAdded: validSpells.length
      };
    } catch (error) {
      return { success: false, message: 'Invalid JSON format' };
    }
  }

  private getCustomSpells(): SpellAbility[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.customSpells);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Validate each spell and filter out invalid ones
      const validSpells: SpellAbility[] = [];
      parsed.forEach((item, index) => {
        const validation = ContentValidationService.validateSpellAbility(item);
        if (validation.valid && validation.data) {
          validSpells.push(validation.data);
        } else {
          console.warn(`Invalid spell found in storage at index ${index}:`, validation.errors);
        }
      });
      
      // If we filtered out invalid items, update localStorage
      if (validSpells.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.customSpells, JSON.stringify(validSpells));
      }
      
      return validSpells;
    } catch (error) {
      console.warn('Error reading custom spells from storage:', error);
      return [];
    }
  }

  // Utility Methods
  public clearAllCustomContent(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  public getCustomContentStats(): Record<CustomContentType, number> {
    // For classes, only count truly custom ones (not built-in)
    const customClasses = this.getCustomClasses();
    
    // For spell schools, count all since they're managed uniformly
    const allSpellSchools = this.getAllSpellSchools();
    
    // For spells, count only loose custom spells (not part of school definitions)
    const customSpells = this.getCustomSpells();
    
    return {
      [CustomContentType.CLASS_DEFINITION]: customClasses.length,
      [CustomContentType.SUBCLASS_DEFINITION]: this.getCustomSubclasses().length,
      [CustomContentType.SPELL_SCHOOL_DEFINITION]: allSpellSchools.length,
      [CustomContentType.ACTION_ABILITY]: this.getCustomAbilities().length,
      [CustomContentType.SPELL_ABILITY]: customSpells.length
    };
  }
}