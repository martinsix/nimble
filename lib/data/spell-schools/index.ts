import { SpellAbility } from '../../types/abilities';
import { fireSchoolSpells } from './fire';
import { iceSchoolSpells } from './ice';
import { lightningSchoolSpells } from './lightning';
import { windSchoolSpells } from './wind';

/**
 * Get spells from a specific school
 */
export function getSpellsBySchool(schoolId: string): SpellAbility[] {
  switch (schoolId) {
    case 'fire':
      return fireSchoolSpells;
    case 'ice':
      return iceSchoolSpells;
    case 'lightning':
      return lightningSchoolSpells;
    case 'wind':
      return windSchoolSpells;
    default:
      return [];
  }
}

/**
 * Get all available spell schools
 */
export function getAllSpellSchools(): { id: string; name: string; spells: SpellAbility[] }[] {
  return [
    { id: 'fire', name: 'Fire Spells', spells: fireSchoolSpells },
    { id: 'ice', name: 'Ice Spells', spells: iceSchoolSpells },
    { id: 'lightning', name: 'Lightning Spells', spells: lightningSchoolSpells },
    { id: 'wind', name: 'Wind Spells', spells: windSchoolSpells }
  ];
}

// Re-export individual school spells for backward compatibility
export {
  fireSchoolSpells,
  iceSchoolSpells,
  lightningSchoolSpells,
  windSchoolSpells
};