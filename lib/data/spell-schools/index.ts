import { SpellAbility } from '../../types/abilities';
import { fireSchoolSpells } from './fire';
import { radiantSchoolSpells } from './radiant';
import { frostSchoolSpells } from './frost';
import { natureSchoolSpells } from './nature';
import { shadowSchoolSpells } from './shadow';
import { arcaneSchoolSpells } from './arcane';

/**
 * Get spells from a specific school
 */
export function getSpellsBySchool(schoolId: string): SpellAbility[] {
  switch (schoolId) {
    case 'fire':
      return fireSchoolSpells;
    case 'radiant':
      return radiantSchoolSpells;
    case 'frost':
      return frostSchoolSpells;
    case 'nature':
      return natureSchoolSpells;
    case 'shadow':
      return shadowSchoolSpells;
    case 'arcane':
      return arcaneSchoolSpells;
    default:
      return [];
  }
}

/**
 * Get all available spell schools
 */
export function getAllSpellSchools(): { id: string; name: string; spells: SpellAbility[] }[] {
  return [
    { id: 'fire', name: 'Fire Magic', spells: fireSchoolSpells },
    { id: 'radiant', name: 'Radiant Magic', spells: radiantSchoolSpells },
    { id: 'frost', name: 'Frost Magic', spells: frostSchoolSpells },
    { id: 'nature', name: 'Nature Magic', spells: natureSchoolSpells },
    { id: 'shadow', name: 'Shadow Magic', spells: shadowSchoolSpells },
    { id: 'arcane', name: 'Arcane Magic', spells: arcaneSchoolSpells }
  ];
}

// Re-export individual school spells for backward compatibility
export {
  fireSchoolSpells,
  radiantSchoolSpells,
  frostSchoolSpells,
  natureSchoolSpells,
  shadowSchoolSpells,
  arcaneSchoolSpells
};