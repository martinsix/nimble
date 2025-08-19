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

export const createCharacterSchema = z.object({
  name: z.string().min(1).max(50),
  attributes: attributeSchema,
  hitPoints: hitPointsSchema,
  initiative: skillSchema,
  skills: skillsSchema,
  inventory: inventorySchema,
});

export const characterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  attributes: attributeSchema,
  hitPoints: hitPointsSchema,
  initiative: skillSchema,
  skills: skillsSchema,
  inventory: inventorySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ValidatedCharacter = z.infer<typeof characterSchema>;
export type ValidatedCreateCharacterData = z.infer<typeof createCharacterSchema>;