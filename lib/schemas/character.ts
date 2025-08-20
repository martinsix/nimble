import { z } from 'zod';
import { gameConfig } from '../config/game-config';

const attributeNameSchema = z.enum(['strength', 'dexterity', 'intelligence', 'will']);

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  size: z.number().min(0),
  type: z.enum(['weapon', 'armor', 'freeform']),
  equipped: z.boolean().optional(),
  attribute: attributeNameSchema.optional(),
  damage: z.string().optional(),
  armor: z.number().optional(),
  maxDexBonus: z.number().optional(),
  properties: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const inventorySchema = z.object({
  maxSize: z.number().min(0),
  items: z.array(itemSchema),
});

export const attributeSchema = z.object({
  strength: z.number().min(gameConfig.character.attributeRange.min).max(gameConfig.character.attributeRange.max),
  dexterity: z.number().min(gameConfig.character.attributeRange.min).max(gameConfig.character.attributeRange.max),
  intelligence: z.number().min(gameConfig.character.attributeRange.min).max(gameConfig.character.attributeRange.max),
  will: z.number().min(gameConfig.character.attributeRange.min).max(gameConfig.character.attributeRange.max),
});

export const skillSchema = z.object({
  name: z.string(),
  associatedAttribute: attributeNameSchema,
  modifier: z.number().min(gameConfig.character.skillModifierRange.min).max(gameConfig.character.skillModifierRange.max),
});

export const skillsSchema = z.object({
  arcana: skillSchema,
  examination: skillSchema,
  finesse: skillSchema,
  influence: skillSchema,
  insight: skillSchema,
  might: skillSchema,
  lore: skillSchema,
  naturecraft: skillSchema,
  perception: skillSchema,
  stealth: skillSchema,
});

export const hitPointsSchema = z.object({
  current: z.number().min(0),
  max: z.number().min(1),
  temporary: z.number().min(0),
});

export const actionTrackerSchema = z.object({
  current: z.number().min(0),
  base: z.number().min(1),
  bonus: z.number().min(0),
});

export const hitDiceSchema = z.object({
  size: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12)]),
  current: z.number().min(0),
  max: z.number().min(1),
});

export const woundsSchema = z.object({
  current: z.number().min(0),
  max: z.number().min(1),
});

export const manaSchema = z.object({
  current: z.number().min(0),
  max: z.number().min(0),
});

export const manaConfigurationSchema = z.object({
  enabled: z.boolean(),
  attribute: attributeNameSchema,
});

export const characterConfigurationSchema = z.object({
  maxWounds: z.number().min(1),
  maxHP: z.number().min(1),
  maxInventorySize: z.number().min(1),
  mana: manaConfigurationSchema,
});

const abilityRollSchema = z.object({
  dice: z.string(),
  modifier: z.number().optional(),
  attribute: attributeNameSchema.optional(),
});

export const abilitySchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string(),
    type: z.literal('freeform'),
  }),
  z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string(),
    type: z.literal('action'),
    frequency: z.enum(['per_turn', 'per_encounter', 'per_safe_rest', 'at_will']),
    maxUses: z.number().min(1).optional(),
    currentUses: z.number().min(0).optional(),
    roll: abilityRollSchema.optional(),
  }),
]);

export const abilitiesSchema = z.object({
  abilities: z.array(abilitySchema),
});

const armorProficiencySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('cloth') }),
  z.object({ type: z.literal('leather') }),
  z.object({ type: z.literal('mail') }),
  z.object({ type: z.literal('plate') }),
  z.object({ type: z.literal('shields') }),
  z.object({ type: z.literal('freeform'), name: z.string().min(1) }),
]);

const weaponProficiencySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('strength_weapons') }),
  z.object({ type: z.literal('dexterity_weapons') }),
  z.object({ type: z.literal('freeform'), name: z.string().min(1) }),
]);

export const proficienciesSchema = z.object({
  armor: z.array(armorProficiencySchema),
  weapons: z.array(weaponProficiencySchema),
});

export const createCharacterSchema = z.object({
  name: z.string().min(1).max(50),
  level: z.number().min(1).max(20),
  classId: z.string().min(1),
  grantedFeatures: z.array(z.string()),
  proficiencies: proficienciesSchema,
  attributes: attributeSchema,
  hitPoints: hitPointsSchema,
  hitDice: hitDiceSchema,
  wounds: woundsSchema,
  mana: manaSchema.optional(),
  config: characterConfigurationSchema,
  initiative: skillSchema,
  actionTracker: actionTrackerSchema,
  inEncounter: z.boolean(),
  skills: skillsSchema,
  inventory: inventorySchema,
  abilities: abilitiesSchema,
});

export const characterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  level: z.number().min(1).max(20),
  classId: z.string().min(1),
  grantedFeatures: z.array(z.string()),
  proficiencies: proficienciesSchema,
  attributes: attributeSchema,
  hitPoints: hitPointsSchema,
  hitDice: hitDiceSchema,
  wounds: woundsSchema,
  mana: manaSchema.optional(),
  config: characterConfigurationSchema,
  initiative: skillSchema,
  actionTracker: actionTrackerSchema,
  inEncounter: z.boolean(),
  skills: skillsSchema,
  inventory: inventorySchema,
  abilities: abilitiesSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ValidatedCharacter = z.infer<typeof characterSchema>;
export type ValidatedCreateCharacterData = z.infer<typeof createCharacterSchema>;