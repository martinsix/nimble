import { z } from 'zod';
import { 
  ClassDefinitionSchema,
  SubclassDefinitionSchema,
  SpellSchoolDefinitionSchema,
  ActionAbilitySchema,
  SpellAbilitySchema
} from '../schemas/class';
import { CustomContentType } from '../types/custom-content';

// Registry of supported schemas for custom import
export const SCHEMA_REGISTRY: Record<CustomContentType, z.ZodSchema> = {
  [CustomContentType.CLASS_DEFINITION]: ClassDefinitionSchema,
  [CustomContentType.SUBCLASS_DEFINITION]: SubclassDefinitionSchema,
  [CustomContentType.SPELL_SCHOOL_DEFINITION]: SpellSchoolDefinitionSchema,
  [CustomContentType.ACTION_ABILITY]: ActionAbilitySchema,
  [CustomContentType.SPELL_ABILITY]: SpellAbilitySchema
};

// Generate JSON schema documentation with metadata from Zod schemas
export function getSchemaDocumentation(contentType: CustomContentType) {
  const schema = SCHEMA_REGISTRY[contentType];
  return z.toJSONSchema(schema);
}

// Get all schemas with their JSON schema documentation
export function getAllSchemaDocumentation() {
  const documentation: Record<CustomContentType, any> = {} as any;
  
  Object.values(CustomContentType).forEach(contentType => {
    documentation[contentType] = getSchemaDocumentation(contentType);
  });
  
  return documentation;
}

// Get schema for a specific content type
export function getSchema(contentType: CustomContentType) {
  return SCHEMA_REGISTRY[contentType];
}