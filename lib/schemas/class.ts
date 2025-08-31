import { z } from 'zod';

// Basic building blocks with metadata
const DiceExpressionSchema = z.object({
  count: z.number().min(1).max(20).describe('Number of dice to roll'),
  sides: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)]).describe('Type of dice (d4, d6, d8, d10, d12, d20, d100)')
}).describe('Dice expression for rolling');

const AbilityRollSchema = z.object({
  dice: DiceExpressionSchema.describe('Dice to roll for this ability'),
  modifier: z.number().optional().describe('Fixed modifier to add to the roll'),
  attribute: z.enum(['strength', 'dexterity', 'intelligence', 'will']).optional().describe('Attribute to add to the roll')
}).describe('Roll configuration for abilities');

const ResourceCostSchema = z.union([
  z.object({
    type: z.literal('fixed').describe('Fixed resource cost'),
    resourceId: z.string().describe('ID of the resource to consume'),
    amount: z.number().min(0).describe('Amount of resource to consume')
  }),
  z.object({
    type: z.literal('variable').describe('Variable resource cost'),
    resourceId: z.string().describe('ID of the resource to consume'),
    minAmount: z.number().min(0).describe('Minimum amount of resource to consume'),
    maxAmount: z.number().min(0).describe('Maximum amount of resource to consume')
  })
]).describe('Resource cost for using this ability');

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
  id: z.string().min(1).describe('Unique identifier for the ability'),
  name: z.string().min(1).describe('Display name of the ability'),
  description: z.string().min(1).describe('Detailed description of what the ability does'),
  type: z.literal('action').describe('Must be "action" for action abilities'),
  frequency: z.enum(['per_turn', 'per_encounter', 'per_safe_rest', 'at_will']).describe('How often the ability can be used'),
  maxUses: z.number().min(0).optional().describe('Maximum uses per frequency period'),
  currentUses: z.number().min(0).optional().describe('Current remaining uses'),
  roll: AbilityRollSchema.optional().describe('Dice roll configuration for the ability'),
  actionCost: z.number().min(0).max(2).optional().describe('Action cost (0=bonus, 1=action, 2=full turn)'),
  resourceCost: ResourceCostSchema.optional().describe('Resource cost to use the ability')
}).describe('Non-spell ability that characters can use');

const SpellAbilitySchema = z.object({
  id: z.string().min(1).describe('Unique identifier for the spell'),
  name: z.string().min(1).describe('Display name of the spell'),
  description: z.string().min(1).describe('Detailed description of the spell\'s effects'),
  type: z.literal('spell').describe('Must be "spell" for spell abilities'),
  school: z.string().min(1).describe('ID of the spell school this belongs to'),
  tier: z.number().min(1).max(9).describe('Spell tier/level (1-9)'),
  roll: AbilityRollSchema.optional().describe('Dice roll configuration for the spell'),
  actionCost: z.number().min(0).max(2).optional().describe('Action cost (0=bonus, 1=action, 2=full turn)'),
  resourceCost: ResourceCostSchema.optional().describe('Resource cost to cast the spell')
}).describe('Spell that characters can cast');

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
  id: z.string().min(1).describe('Unique identifier for the class'),
  name: z.string().min(1).describe('Display name of the class'),
  description: z.string().min(1).describe('Detailed description of the class'),
  hitDieSize: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12)]).describe('Hit die size for this class (d4, d6, d8, d10, d12)'),
  keyAttributes: z.array(z.enum(['strength', 'dexterity', 'intelligence', 'will'])).describe('Primary attributes for this class'),
  startingHP: z.number().min(1).describe('Base hit points at level 1'),
  armorProficiencies: z.array(ArmorProficiencySchema).describe('Types of armor this class can use'),
  weaponProficiencies: z.array(WeaponProficiencySchema).describe('Types of weapons this class can use'),
  saveAdvantages: z.object({
    strength: z.enum(['advantage', 'disadvantage', 'normal']).optional().describe('Saving throw modifier for strength'),
    dexterity: z.enum(['advantage', 'disadvantage', 'normal']).optional().describe('Saving throw modifier for dexterity'),
    intelligence: z.enum(['advantage', 'disadvantage', 'normal']).optional().describe('Saving throw modifier for intelligence'),
    will: z.enum(['advantage', 'disadvantage', 'normal']).optional().describe('Saving throw modifier for will')
  }).describe('Saving throw advantages/disadvantages'),
  features: z.array(ClassFeatureSchema).describe('Array of class features by level'),
  subclasses: z.array(z.object({
    id: z.string().min(1).describe('Unique identifier for the subclass'),
    name: z.string().min(1).describe('Display name of the subclass'),
    description: z.string().min(1).describe('Detailed description of the subclass'),
    parentClassId: z.string().min(1).describe('ID of the parent class'),
    features: z.array(ClassFeatureSchema).describe('Array of subclass features by level')
  })).optional().describe('Available subclasses for this class')
}).describe('Character class definition with features, proficiencies, and progression');

export const SubclassDefinitionSchema = z.object({
  id: z.string().min(1).describe('Unique identifier for the subclass'),
  name: z.string().min(1).describe('Display name of the subclass'),
  description: z.string().min(1).describe('Detailed description of the subclass'),
  parentClassId: z.string().min(1).describe('ID of the parent class'),
  features: z.array(ClassFeatureSchema).describe('Array of subclass features by level')
}).describe('Character subclass specialization');

export const SpellSchoolDefinitionSchema = z.object({
  id: z.string().min(1).describe('Unique identifier for the spell school'),
  name: z.string().min(1).describe('Display name of the spell school'),
  description: z.string().min(1).describe('Description of the school\'s magical focus'),
  spells: z.array(SpellAbilitySchema).describe('Array of spells in this school')
}).describe('School of magic with associated spells');

// Export individual schemas for content validation
export {
  ActionAbilitySchema,
  SpellAbilitySchema,
  DiceExpressionSchema,
  AbilityRollSchema,
  ResourceCostSchema
};