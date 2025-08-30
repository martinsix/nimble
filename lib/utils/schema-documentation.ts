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
}

// Pre-generated documentation for all content types
export const SCHEMA_DOCUMENTATION = {
  classes: {
    title: 'Class Definition',
    description: 'Define a character class with features, proficiencies, and progression.',
    fields: [
      { name: 'id', type: 'string', required: true, constraints: ['min length: 1'], description: 'Unique identifier for the class' },
      { name: 'name', type: 'string', required: true, constraints: ['min length: 1'], description: 'Display name of the class' },
      { name: 'description', type: 'string', required: true, constraints: ['min length: 1'], description: 'Detailed description of the class' },
      { name: 'hitDieSize', type: '4 | 6 | 8 | 10 | 12', required: true, description: 'Size of hit dice for this class' },
      { name: 'keyAttributes', type: 'string[]', required: true, constraints: ['values: "strength", "dexterity", "intelligence", "will"'], description: 'Primary attributes for this class' },
      { name: 'startingHP', type: 'number', required: true, constraints: ['min: 1'], description: 'Base hit points at level 1' },
      { name: 'armorProficiencies', type: 'any[]', required: true, description: 'Types of armor this class can use' },
      { name: 'weaponProficiencies', type: 'any[]', required: true, description: 'Types of weapons this class can use' },
      { name: 'saveAdvantages', type: 'object', required: true, description: 'Saving throw advantages/disadvantages' },
      { name: 'features', type: 'ClassFeature[]', required: true, description: 'Array of class features by level' },
      { name: 'subclasses', type: 'any[]', required: false, description: 'Available subclasses for this class' }
    ],
    example: {
      id: 'custom-class',
      name: 'Custom Class',
      description: 'A unique class with special abilities.',
      hitDieSize: 8,
      keyAttributes: ['strength', 'dexterity'],
      startingHP: 12,
      armorProficiencies: [],
      weaponProficiencies: [],
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
    }
  },

  subclasses: {
    title: 'Subclass Definition',
    description: 'Define a character subclass specialization.',
    fields: [
      { name: 'id', type: 'string', required: true, constraints: ['min length: 1'], description: 'Unique identifier for the subclass' },
      { name: 'name', type: 'string', required: true, constraints: ['min length: 1'], description: 'Display name of the subclass' },
      { name: 'description', type: 'string', required: true, constraints: ['min length: 1'], description: 'Detailed description of the subclass' },
      { name: 'parentClassId', type: 'string', required: true, constraints: ['min length: 1'], description: 'ID of the parent class' },
      { name: 'features', type: 'ClassFeature[]', required: true, description: 'Array of subclass features by level' }
    ],
    example: {
      id: 'custom-subclass',
      name: 'Custom Subclass',
      description: 'A specialized path for the custom class.',
      parentClassId: 'custom-class',
      features: [
        {
          level: 3,
          type: 'ability',
          name: 'Subclass Ability',
          description: 'A special ability gained at level 3.'
        }
      ]
    }
  },

  spellSchools: {
    title: 'Spell School Definition',
    description: 'Define a school of magic with associated spells. Individual spells should be uploaded separately.',
    fields: [
      { name: 'id', type: 'string', required: true, constraints: ['min length: 1'], description: 'Unique identifier for the spell school' },
      { name: 'name', type: 'string', required: true, constraints: ['min length: 1'], description: 'Display name of the spell school' },
      { name: 'description', type: 'string', required: true, constraints: ['min length: 1'], description: 'Description of the school\'s magical focus' },
      { name: 'spells', type: 'SpellAbility[]', required: true, description: 'Array of spells in this school (upload these separately for better organization)' }
    ],
    example: {
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
    }
  },

  abilities: {
    title: 'Action Ability Definition',
    description: 'Define a non-spell ability that characters can use.',
    fields: [
      { name: 'id', type: 'string', required: true, constraints: ['min length: 1'], description: 'Unique identifier for the ability' },
      { name: 'name', type: 'string', required: true, constraints: ['min length: 1'], description: 'Display name of the ability' },
      { name: 'description', type: 'string', required: true, constraints: ['min length: 1'], description: 'Detailed description of what the ability does' },
      { name: 'type', type: '"action"', required: true, description: 'Must be "action" for action abilities' },
      { name: 'frequency', type: 'enum', required: true, constraints: ['values: "per_turn", "per_encounter", "per_safe_rest", "at_will"'], description: 'How often the ability can be used' },
      { name: 'maxUses', type: 'number', required: false, constraints: ['min: 0'], description: 'Maximum uses per frequency period' },
      { name: 'currentUses', type: 'number', required: false, constraints: ['min: 0'], description: 'Current remaining uses' },
      { name: 'roll', type: 'AbilityRoll', required: false, description: 'Dice roll configuration for the ability' },
      { name: 'actionCost', type: 'number', required: false, constraints: ['min: 0', 'max: 2'], description: 'Action cost (0=bonus, 1=action, 2=full turn)' },
      { name: 'resourceCost', type: 'ResourceCost', required: false, description: 'Resource cost to use the ability' }
    ],
    example: {
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
    }
  },

  spells: {
    title: 'Spell Ability Definition',
    description: 'Define a spell that characters can cast.',
    fields: [
      { name: 'id', type: 'string', required: true, constraints: ['min length: 1'], description: 'Unique identifier for the spell' },
      { name: 'name', type: 'string', required: true, constraints: ['min length: 1'], description: 'Display name of the spell' },
      { name: 'description', type: 'string', required: true, constraints: ['min length: 1'], description: 'Detailed description of the spell\'s effects' },
      { name: 'type', type: '"spell"', required: true, description: 'Must be "spell" for spell abilities' },
      { name: 'school', type: 'string', required: true, constraints: ['min length: 1'], description: 'ID of the spell school this belongs to' },
      { name: 'tier', type: 'number', required: true, constraints: ['min: 1', 'max: 9'], description: 'Spell tier/level (1-9)' },
      { name: 'roll', type: 'AbilityRoll', required: false, description: 'Dice roll configuration for the spell' },
      { name: 'actionCost', type: 'number', required: false, constraints: ['min: 0', 'max: 2'], description: 'Action cost (0=bonus, 1=action, 2=full turn)' },
      { name: 'resourceCost', type: 'ResourceCost', required: false, description: 'Resource cost to cast the spell' }
    ],
    example: {
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
  }
};