import { z } from 'zod';

// Single die schema
export const singleDieSchema = z.object({
  type: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)]),
  result: z.number().positive(),
  isCritical: z.boolean().optional(),
});

// Base log entry schema
export const baseLogEntrySchema = z.object({
  id: z.string().min(1),
  timestamp: z.date(),
  description: z.string().min(1),
});

// Dice roll log entry schema
export const diceRollEntrySchema = z.object({
  type: z.literal('roll'),
  dice: z.array(singleDieSchema),
  droppedDice: z.array(singleDieSchema).optional(),
  modifier: z.number(),
  total: z.number(),
  isMiss: z.boolean().optional(),
  criticalHits: z.number().optional(),
  advantageLevel: z.number().optional(),
}).merge(baseLogEntrySchema);

// Damage log entry schema
export const damageEntrySchema = z.object({
  type: z.literal('damage'),
  amount: z.number().positive(),
  targetType: z.enum(['hp', 'temp_hp']),
}).merge(baseLogEntrySchema);

// Healing log entry schema
export const healingEntrySchema = z.object({
  type: z.literal('healing'),
  amount: z.number().positive(),
}).merge(baseLogEntrySchema);

// Temporary HP log entry schema
export const tempHPEntrySchema = z.object({
  type: z.literal('temp_hp'),
  amount: z.number().positive(),
  previous: z.number().optional(),
}).merge(baseLogEntrySchema);

// Initiative log entry schema
export const initiativeEntrySchema = z.object({
  type: z.literal('initiative'),
  total: z.number(),
  actionsGranted: z.number().positive(),
}).merge(baseLogEntrySchema);

// Ability usage log entry schema
export const abilityUsageEntrySchema = z.object({
  type: z.literal('ability_usage'),
  abilityName: z.string().min(1),
  frequency: z.enum(['per_turn', 'per_encounter', 'per_safe_rest', 'at_will']),
  usesRemaining: z.number().min(0),
  maxUses: z.number().min(0),
}).merge(baseLogEntrySchema);

// Safe rest log entry schema
export const safeRestEntrySchema = z.object({
  type: z.literal('safe_rest'),
  healingAmount: z.number().min(0),
  hitDiceRestored: z.number().min(0),
  woundsRemoved: z.number().min(0),
  abilitiesReset: z.number().min(0),
}).merge(baseLogEntrySchema);

// Mana log entry schema
export const manaEntrySchema = z.object({
  type: z.literal('mana'),
  amount: z.number().positive(),
  action: z.enum(['spent', 'restored']),
  currentMana: z.number().min(0),
  maxMana: z.number().min(0),
}).merge(baseLogEntrySchema);

// Union schema for all log entries
export const logEntrySchema = z.discriminatedUnion('type', [
  diceRollEntrySchema,
  damageEntrySchema,
  healingEntrySchema,
  tempHPEntrySchema,
  initiativeEntrySchema,
  abilityUsageEntrySchema,
  safeRestEntrySchema,
  manaEntrySchema,
]);

export type ValidatedLogEntry = z.infer<typeof logEntrySchema>;