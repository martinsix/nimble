/**
 * Shared types for custom content management
 */

// Enum for custom content types that can be imported
export enum CustomContentType {
  CLASS_DEFINITION = 'class-definition',
  SUBCLASS_DEFINITION = 'subclass-definition', 
  SPELL_SCHOOL_DEFINITION = 'spell-school-definition',
  ACTION_ABILITY = 'action-ability',
  SPELL_ABILITY = 'spell-ability'
}

// Display metadata for each content type
export interface ContentTypeMetadata {
  title: string;
  description: string;
  icon: string;
  color: string; // Color for UI display
}

// Content type metadata mapping
export const CONTENT_TYPE_METADATA: Record<CustomContentType, ContentTypeMetadata> = {
  [CustomContentType.CLASS_DEFINITION]: {
    title: 'Classes',
    description: 'Character classes with features and progression',
    icon: 'Shield',
    color: 'bg-blue-600'
  },
  [CustomContentType.SUBCLASS_DEFINITION]: {
    title: 'Subclasses', 
    description: 'Specialized paths for character classes',
    icon: 'Zap',
    color: 'bg-green-600'
  },
  [CustomContentType.SPELL_SCHOOL_DEFINITION]: {
    title: 'Spell Schools',
    description: 'Schools of magic with themed spells',
    icon: 'Sparkles',
    color: 'bg-purple-600'
  },
  [CustomContentType.ACTION_ABILITY]: {
    title: 'Abilities',
    description: 'Non-spell abilities with resource costs',
    icon: 'FileText', 
    color: 'bg-orange-600'
  },
  [CustomContentType.SPELL_ABILITY]: {
    title: 'Spells',
    description: 'Magical spells with tiers and schools',
    icon: 'Wand2',
    color: 'bg-red-600'
  }
};

// Helper functions
export function getContentTypeMetadata(type: CustomContentType): ContentTypeMetadata {
  return CONTENT_TYPE_METADATA[type];
}

export function getAllContentTypes(): CustomContentType[] {
  return Object.values(CustomContentType);
}
