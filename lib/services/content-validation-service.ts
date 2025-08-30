import { z } from 'zod';
import { ClassDefinition, SubclassDefinition } from '../types/class';
import { ActionAbility, SpellAbility } from '../types/abilities';
import { 
  ClassDefinitionSchema,
  SubclassDefinitionSchema,
  SpellSchoolDefinitionSchema,
  ActionAbilitySchema,
  SpellAbilitySchema
} from '../schemas/class';

// Validation functions
export class ContentValidationService {
  static validateClass(data: unknown): { valid: boolean; data?: ClassDefinition; errors?: string[] } {
    try {
      const validatedData = ClassDefinitionSchema.parse(data);
      return { valid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          valid: false, 
          errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }

  static validateSubclass(data: unknown): { valid: boolean; data?: SubclassDefinition; errors?: string[] } {
    try {
      const validatedData = SubclassDefinitionSchema.parse(data);
      return { valid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          valid: false, 
          errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }

  static validateActionAbility(data: unknown): { valid: boolean; data?: ActionAbility; errors?: string[] } {
    try {
      const validatedData = ActionAbilitySchema.parse(data);
      return { valid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          valid: false, 
          errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }

  static validateSpellAbility(data: unknown): { valid: boolean; data?: SpellAbility; errors?: string[] } {
    try {
      const validatedData = SpellAbilitySchema.parse(data);
      return { valid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          valid: false, 
          errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }

  static validateSpellSchool(data: unknown): { valid: boolean; data?: any; errors?: string[] } {
    try {
      const validatedData = SpellSchoolDefinitionSchema.parse(data);
      return { valid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          valid: false, 
          errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }
}