import { z } from 'zod';
import { 
  ClassDefinitionSchema,
  SubclassDefinitionSchema,
  SpellSchoolDefinitionSchema,
  ActionAbilitySchema,
  SpellAbilitySchema
} from '../schemas/class';

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: any;
  constraints?: string[];
}

export interface SchemaDocumentation {
  title: string;
  description: string;
  fields: SchemaField[];
  example: any;
  jsonSchema?: any;
}

/**
 * Generate schema documentation from Zod schemas
 */
export class SchemaDocumentationGenerator {
  static generateFromZodSchema(schema: z.ZodSchema, title: string, description: string, example: any): SchemaDocumentation {
    // Generate JSON schema using Zod 4's native method with type assertion
    let jsonSchema: any = null;
    try {
      jsonSchema = (schema as any).toJsonSchema();
    } catch (error) {
      console.warn('Failed to generate JSON schema, falling back to example parsing:', error);
      // Fallback to extracting from example
      const fields = this.extractFieldsFromExample(example);
      return {
        title,
        description,
        fields,
        example,
        jsonSchema: null
      };
    }
    
    // Extract fields from JSON schema with metadata
    const fields = this.extractFieldsFromJsonSchema(jsonSchema);
    
    return {
      title,
      description,
      fields,
      example,
      jsonSchema
    };
  }

  private static extractFieldsFromExample(example: any): SchemaField[] {
    const fields: SchemaField[] = [];
    
    if (typeof example === 'object' && example !== null) {
      Object.entries(example).forEach(([key, value]) => {
        fields.push({
          name: key,
          type: Array.isArray(value) ? 'array' : typeof value,
          required: true, // We'll assume all example fields are required for simplicity
          description: this.getFieldDescription(key)
        });
      });
    }
    
    return fields;
  }

  private static getFieldDescription(key: string): string {
    const descriptions: Record<string, string> = {
      id: 'Unique identifier',
      name: 'Display name',
      description: 'Detailed description',
      type: 'Content type identifier',
      school: 'Spell school identifier',
      tier: 'Spell tier/level (1-9)',
      frequency: 'Usage frequency',
      actionCost: 'Action cost (0=bonus, 1=action, 2=full turn)',
      hitDieSize: 'Hit die size for this class',
      keyAttributes: 'Primary attributes for this class',
      startingHP: 'Base hit points at level 1',
      features: 'Array of class features by level',
      parentClassId: 'Parent class identifier',
      spells: 'Array of spells in this school'
    };
    
    return descriptions[key] || `${key} value`;
  }

  private static extractFieldsFromJsonSchema(jsonSchema: any): SchemaField[] {
    const fields: SchemaField[] = [];
    
    if (jsonSchema.type === 'object' && jsonSchema.properties) {
      const required = jsonSchema.required || [];
      
      Object.entries(jsonSchema.properties).forEach(([key, propSchema]: [string, any]) => {
        fields.push({
          name: key,
          type: this.getTypeString(propSchema),
          required: required.includes(key),
          description: propSchema.description || undefined,
          constraints: this.getConstraints(propSchema)
        });
      });
    }
    
    return fields;
  }

  private static getTypeString(propSchema: any): string {
    if (propSchema.type) {
      if (propSchema.type === 'array') {
        const itemType = propSchema.items ? this.getTypeString(propSchema.items) : 'any';
        return `${itemType}[]`;
      }
      return propSchema.type;
    }
    
    if (propSchema.enum) {
      return propSchema.enum.map((val: any) => `"${val}"`).join(' | ');
    }
    
    if (propSchema.anyOf || propSchema.oneOf) {
      const unionTypes = (propSchema.anyOf || propSchema.oneOf).map((schema: any) => this.getTypeString(schema));
      return unionTypes.join(' | ');
    }
    
    return 'any';
  }

  private static getConstraints(propSchema: any): string[] | undefined {
    const constraints: string[] = [];
    
    if (propSchema.minimum !== undefined) constraints.push(`min: ${propSchema.minimum}`);
    if (propSchema.maximum !== undefined) constraints.push(`max: ${propSchema.maximum}`);
    if (propSchema.minLength !== undefined) constraints.push(`min length: ${propSchema.minLength}`);
    if (propSchema.maxLength !== undefined) constraints.push(`max length: ${propSchema.maxLength}`);
    if (propSchema.minItems !== undefined) constraints.push(`min items: ${propSchema.minItems}`);
    if (propSchema.maxItems !== undefined) constraints.push(`max items: ${propSchema.maxItems}`);
    if (propSchema.enum) constraints.push(`values: ${propSchema.enum.map((val: any) => `"${val}"`).join(', ')}`);
    
    return constraints.length > 0 ? constraints : undefined;
  }
}

// Generate schema documentation dynamically from Zod schemas
const generateSchemaDocumentation = () => {
  const examples = {
    classes: {
      id: 'custom-class',
      name: 'Custom Class',
      description: 'A unique class with special abilities.',
      hitDieSize: 8,
      keyAttributes: ['strength', 'dexterity'],
      startingHP: 12,
      armorProficiencies: [{ type: 'cloth' }],
      weaponProficiencies: [{ type: 'strength_weapons' }],
      saveAdvantages: {
        strength: 'advantage',
        dexterity: 'normal'
      },
      features: [
        {
          level: 1,
          type: 'passive_feature',
          name: 'Starting Feature',
          description: 'A feature gained at level 1.',
          category: 'combat'
        }
      ]
    },
    subclasses: {
      id: 'custom-subclass',
      name: 'Custom Subclass',
      description: 'A specialized path for the custom class.',
      parentClassId: 'custom-class',
      features: [
        {
          level: 3,
          type: 'passive_feature',
          name: 'Subclass Feature',
          description: 'A special feature gained at level 3.',
          category: 'combat'
        }
      ]
    },
    spellSchools: {
      id: 'custom-school',
      name: 'Custom Magic School',
      description: 'A unique school of magical study.',
      spells: [
        {
          id: 'custom-spell-1',
          name: 'Custom Spell',
          description: 'A spell from the custom school.',
          type: 'spell',
          school: 'custom-school',
          tier: 1,
          actionCost: 1,
          roll: {
            dice: { count: 1, sides: 6 }
          },
          resourceCost: {
            type: 'fixed',
            resourceId: 'mana',
            amount: 1
          }
        }
      ]
    },
    abilities: {
      id: 'custom-ability',
      name: 'Custom Ability',
      description: 'A unique ability for characters.',
      type: 'action',
      frequency: 'per_encounter',
      maxUses: 1,
      currentUses: 1,
      actionCost: 1,
      roll: {
        dice: { count: 1, sides: 20 },
        modifier: 5,
        attribute: 'strength'
      },
      resourceCost: {
        type: 'fixed',
        resourceId: 'focus',
        amount: 2
      }
    },
    spells: {
      id: 'custom-spell',
      name: 'Custom Spell',
      description: 'A unique magical spell.',
      type: 'spell',
      school: 'arcane',
      tier: 2,
      actionCost: 1,
      roll: {
        dice: { count: 2, sides: 6 },
        modifier: 0
      },
      resourceCost: {
        type: 'fixed',
        resourceId: 'mana',
        amount: 2
      }
    }
  };

  return {
    classes: SchemaDocumentationGenerator.generateFromZodSchema(
      ClassDefinitionSchema,
      'Class Definition',
      'Define a character class with features, proficiencies, and progression.',
      examples.classes
    ),
    subclasses: SchemaDocumentationGenerator.generateFromZodSchema(
      SubclassDefinitionSchema,
      'Subclass Definition',
      'Define a character subclass specialization.',
      examples.subclasses
    ),
    spellSchools: SchemaDocumentationGenerator.generateFromZodSchema(
      SpellSchoolDefinitionSchema,
      'Spell School Definition',
      'Define a school of magic with associated spells.',
      examples.spellSchools
    ),
    abilities: SchemaDocumentationGenerator.generateFromZodSchema(
      ActionAbilitySchema,
      'Action Ability Definition',
      'Define a non-spell ability that characters can use.',
      examples.abilities
    ),
    spells: SchemaDocumentationGenerator.generateFromZodSchema(
      SpellAbilitySchema,
      'Spell Ability Definition',
      'Define a spell that characters can cast.',
      examples.spells
    )
  };
};

// Export the dynamically generated schema documentation
export const SCHEMA_DOCUMENTATION = generateSchemaDocumentation();