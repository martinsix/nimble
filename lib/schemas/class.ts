import { z } from 'zod';

// Basic building blocks
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

// Armor proficiency schemas
const ArmorProficiencySchema = z.union([
  z.object({ type: z.literal('cloth') }),
  z.object({ type: z.literal('leather') }),
  z.object({ type: z.literal('mail') }),
  z.object({ type: z.literal('plate') }),
  z.object({ type: z.literal('shields') }),
  z.object({ 
    type: z.literal('freeform'),
    name: z.string().min(1)
  })
]);

// Weapon proficiency schemas
const WeaponProficiencySchema = z.union([
  z.object({ type: z.literal('strength_weapons') }),
  z.object({ type: z.literal('dexterity_weapons') }),
  z.object({ 
    type: z.literal('freeform'),
    name: z.string().min(1)
  })
]);

// Ability schemas (for class features)
const ActionAbilitySchema = z.object({
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

const SpellAbilitySchema = z.object({
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

const AbilitySchema = z.union([ActionAbilitySchema, SpellAbilitySchema]);

// Class Feature Schemas
const BaseClassFeatureSchema = z.object({
  level: z.number().min(1).max(20),
  name: z.string().min(1),
  description: z.string().min(1)
});

const AbilityFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('ability'),
  ability: AbilitySchema
});

const PassiveFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('passive_feature'),
  category: z.enum(['combat', 'exploration', 'social', 'utility']).optional()
});

const StatBoostSchema = z.object({
  attribute: z.enum(['strength', 'dexterity', 'intelligence', 'will']),
  amount: z.number().min(-5).max(5)
});

const StatBoostFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('stat_boost'),
  statBoosts: z.array(StatBoostSchema)
});

const ProficiencyGrantSchema = z.object({
  type: z.enum(['skill', 'save', 'tool', 'language']),
  name: z.string().min(1),
  bonus: z.number().optional()
});

const ProficiencyFeatureSchema = BaseClassFeatureSchema.extend({
  type: z.literal('proficiency'),
  proficiencies: z.array(ProficiencyGrantSchema)
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
    description: z.string().min(1)
    // Removed spells array - access to school gives access to all spells in that school
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

export const ClassFeatureSchema = z.union([
  AbilityFeatureSchema,
  PassiveFeatureSchema,
  StatBoostFeatureSchema,
  ProficiencyFeatureSchema,
  ResourceFeatureSchema,
  SpellSchoolFeatureSchema,
  SpellTierAccessFeatureSchema,
  SubclassChoiceFeatureSchema
]);

// Main schemas
export const ClassDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  hitDieSize: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12)]),
  keyAttributes: z.array(z.enum(['strength', 'dexterity', 'intelligence', 'will'])),
  startingHP: z.number().min(1),
  armorProficiencies: z.array(ArmorProficiencySchema),
  weaponProficiencies: z.array(WeaponProficiencySchema),
  saveAdvantages: z.object({
    strength: z.enum(['advantage', 'disadvantage', 'normal']).optional(),
    dexterity: z.enum(['advantage', 'disadvantage', 'normal']).optional(),
    intelligence: z.enum(['advantage', 'disadvantage', 'normal']).optional(),
    will: z.enum(['advantage', 'disadvantage', 'normal']).optional()
  }),
  features: z.array(ClassFeatureSchema),
  subclasses: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    parentClassId: z.string().min(1),
    features: z.array(ClassFeatureSchema)
  })).optional()
});

export const SubclassDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  parentClassId: z.string().min(1),
  features: z.array(ClassFeatureSchema)
});

export const SpellSchoolDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  spells: z.array(SpellAbilitySchema)
});

// Export individual schemas for content validation
export {
  ActionAbilitySchema,
  SpellAbilitySchema,
  DiceExpressionSchema,
  AbilityRollSchema,
  ResourceCostSchema
};