import { z } from 'zod';
import { ClassFeatureSchema } from './class';

// Size categories for different ancestries
const SizeCategorySchema = z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']);

// Damage/condition resistances
const ResistanceSchema = z.object({
  type: z.enum(['damage', 'condition']).meta({ title: 'Resistance Type', description: 'Type of resistance (damage or condition)' }),
  name: z.string().min(1).meta({ title: 'Name', description: 'Name of what is resisted (e.g., fire, poison, charm)' }),
  description: z.string().optional().meta({ title: 'Description', description: 'Optional description of the resistance' })
}).meta({ title: 'Resistance', description: 'Damage or condition resistance' });

// Base schema for ancestry features
const BaseAncestryFeatureSchema = z.object({
  name: z.string().min(1).meta({ title: 'Name', description: 'Feature name' }),
  description: z.string().min(1).meta({ title: 'Description', description: 'Feature description' })
});

// Ability feature - grants a new ability to the character
const AncestryAbilityFeatureSchema = BaseAncestryFeatureSchema.extend({
  type: z.literal('ability'),
  ability: z.any() // Import from class schema if needed
});

// Passive feature - background benefits, cultural traits
const AncestryPassiveFeatureSchema = BaseAncestryFeatureSchema.extend({
  type: z.literal('passive_feature'),
  category: z.enum(['cultural', 'biological', 'magical', 'social']).optional().meta({ title: 'Category', description: 'Feature category' })
});

// Stat boost - racial attribute modifiers
const AncestryStatBoostFeatureSchema = BaseAncestryFeatureSchema.extend({
  type: z.literal('stat_boost'),
  statBoosts: z.array(z.object({
    attribute: z.enum(['strength', 'dexterity', 'intelligence', 'will']),
    amount: z.number().int().min(-5).max(5)
  })).meta({ title: 'Stat Boosts', description: 'Attribute modifications' })
});

// Proficiency - cultural or biological proficiencies
const AncestryProficiencyFeatureSchema = BaseAncestryFeatureSchema.extend({
  type: z.literal('proficiency'),
  proficiencies: z.array(z.object({
    type: z.enum(['skill', 'save', 'tool', 'language']),
    name: z.string().min(1),
    bonus: z.number().int().optional()
  })).meta({ title: 'Proficiencies', description: 'Granted proficiencies' })
});

// Speed and special movement handled through passive features

// Darkvision - enhanced vision in darkness
const AncestryDarkvisionFeatureSchema = BaseAncestryFeatureSchema.extend({
  type: z.literal('darkvision'),
  range: z.number().int().min(0).meta({ title: 'Range', description: 'Darkvision range in feet' })
});

// Resistance - damage or condition resistances
const AncestryResistanceFeatureSchema = BaseAncestryFeatureSchema.extend({
  type: z.literal('resistance'),
  resistances: z.array(ResistanceSchema).meta({ title: 'Resistances', description: 'Damage or condition resistances' })
});

export const AncestryFeatureSchema = z.union([
  AncestryAbilityFeatureSchema,
  AncestryPassiveFeatureSchema,
  AncestryStatBoostFeatureSchema,
  AncestryProficiencyFeatureSchema,
  AncestryDarkvisionFeatureSchema,
  AncestryResistanceFeatureSchema
]);

// Armor proficiency schemas (reused from class schema)
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

// Weapon proficiency schemas (reused from class schema)
const WeaponProficiencySchema = z.union([
  z.object({ type: z.literal('strength_weapons') }),
  z.object({ type: z.literal('dexterity_weapons') }),
  z.object({ 
    type: z.literal('freeform'),
    name: z.string().min(1)
  })
]);

export const AncestryDefinitionSchema = z.object({
  id: z.string().min(1).meta({ title: 'ID', description: 'Unique identifier for the ancestry' }),
  name: z.string().min(1).meta({ title: 'Name', description: 'Display name of the ancestry' }),
  description: z.string().min(1).meta({ title: 'Description', description: 'Detailed description of the ancestry' }),
  size: SizeCategorySchema.meta({ title: 'Size', description: 'Default size category' }),
  baseSpeed: z.number().int().min(0).meta({ title: 'Base Speed', description: 'Base movement speed in feet' }),
  languages: z.array(z.string().min(1)).meta({ title: 'Languages', description: 'Languages known by default' }),
  lifespan: z.string().optional().meta({ title: 'Lifespan', description: 'Typical lifespan description' }),
  culture: z.string().optional().meta({ title: 'Culture', description: 'Cultural background description' }),
  physicalTraits: z.string().optional().meta({ title: 'Physical Traits', description: 'Physical appearance description' }),
  features: z.array(AncestryFeatureSchema).meta({ title: 'Features', description: 'All features provided by this ancestry' })
}).meta({ title: 'Ancestry Definition', description: 'Character ancestry definition with features and traits' });

export const AncestryTraitSchema = z.object({
  ancestryId: z.string().min(1).meta({ title: 'Ancestry ID', description: 'ID of the character\'s ancestry' }),
  grantedFeatures: z.array(z.string()).meta({ title: 'Granted Features', description: 'IDs of ancestry features already granted' })
}).meta({ title: 'Ancestry Trait', description: 'Character ancestry reference' });

// Export individual schemas for specific use cases
export {
  SizeCategorySchema,
  ResistanceSchema
};