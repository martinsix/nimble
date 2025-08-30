import { z } from 'zod';
import { ClassDefinition, SubclassDefinition } from '../types/class';
import { ActionAbility, SpellAbility } from '../types/abilities';

// Validation schemas for content types

const DiceExpressionSchema = z.object({
  count: z.number().min(1).max(20),
  sides: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)])
});

const AbilityRollSchema = z.object({
  dice: DiceExpressionSchema,
  modifier: z.number().optional(),
  attribute: z.enum(['strength', 'dexterity', 'intelligence', 'will']).optional()
});

const ResourceCostSchema = z.union([
  z.object({
    type: z.literal('fixed'),
    resourceId: z.string(),
    amount: z.number().min(0)
  }),
  z.object({
    type: z.literal('variable'),
    resourceId: z.string(),
    minAmount: z.number().min(0),
    maxAmount: z.number().min(0)
  })
]);

// Class Feature Schemas
const BaseClassFeatureSchema = z.object({
  level: z.number().min(1).max(20),
  name: z.string().min(1),
  description: z.string().min(1)
});

const AbilityFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('ability'),
  ability: z.any() // Simplified for validation complexity
});

const PassiveFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('passive_feature'),
  category: z.enum(['combat', 'exploration', 'social', 'utility']).optional()
});

const StatBoostFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('stat_boost'),
  statBoosts: z.array(z.object({
    attribute: z.enum(['strength', 'dexterity', 'intelligence', 'will']),
    amount: z.number().min(-5).max(5)
  }))
});

const ResourceFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('resource'),
  resourceDefinition: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    colorScheme: z.string(),
    icon: z.string().optional(),
    resetCondition: z.enum(['safe_rest', 'encounter_end', 'turn_end', 'never', 'manual']),
    resetType: z.enum(['to_max', 'to_zero', 'to_default']),
    resetValue: z.number().optional(),
    minValue: z.number(),
    maxValue: z.number()
  }),
  startingAmount: z.number().optional()
});

const SpellSchoolFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('spell_school'),
  spellSchool: z.object({
    schoolId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    spells: z.array(z.string())
  })
});

const SpellTierAccessFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('spell_tier_access'),
  maxTier: z.number().min(1).max(9)
});

const SubclassChoiceFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('subclass_choice'),
  availableSubclasses: z.array(z.string())
});

const ClassFeatureSchema = z.union([
  AbilityFeatureSchema,
  PassiveFeatureSchema,
  StatBoostFeatureSchema,
  ResourceFeatureSchema,
  SpellSchoolFeatureSchema,
  SpellTierAccessFeatureSchema,
  SubclassChoiceFeatureSchema
]);

// Main content schemas
export const ClassDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  hitDieSize: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12)]),
  keyAttributes: z.array(z.enum(['strength', 'dexterity', 'intelligence', 'will'])),
  startingHP: z.number().min(1),
  armorProficiencies: z.array(z.any()), // Simplified for now
  weaponProficiencies: z.array(z.any()), // Simplified for now
  saveAdvantages: z.object({
    strength: z.enum(['advantage', 'disadvantage', 'normal']).optional(),
    dexterity: z.enum(['advantage', 'disadvantage', 'normal']).optional(),
    intelligence: z.enum(['advantage', 'disadvantage', 'normal']).optional(),
    will: z.enum(['advantage', 'disadvantage', 'normal']).optional()
  }),
  features: z.array(ClassFeatureSchema),
  subclasses: z.array(z.any()).optional() // Simplified for now
});

export const SubclassDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  parentClassId: z.string().min(1),
  features: z.array(ClassFeatureSchema)
});

export const ActionAbilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.literal('action'),
  frequency: z.enum(['per_turn', 'per_encounter', 'per_safe_rest', 'at_will']),
  maxUses: z.number().min(0).optional(),
  currentUses: z.number().min(0).optional(),
  roll: AbilityRollSchema.optional(),
  actionCost: z.number().min(0).max(2).optional(),
  resourceCost: ResourceCostSchema.optional()
});

export const SpellAbilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.literal('spell'),
  school: z.string().min(1),
  tier: z.number().min(1).max(9),
  roll: AbilityRollSchema.optional(),
  actionCost: z.number().min(0).max(2).optional(),
  resourceCost: ResourceCostSchema.optional()
});

export const SpellSchoolDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  spells: z.array(SpellAbilitySchema)
});

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