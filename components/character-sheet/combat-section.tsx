import { InitiativeSection } from "../sections/initiative-section";
import { ActionTrackerSection } from "../sections/action-tracker-section";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";

export function CombatSection() {
  // Get character from context to check encounter state
  const { character } = useCharacterActions();
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  return (
    <>
      {/* Initiative Section - Now completely self-contained */}
      <InitiativeSection />

      {/* Action Tracker Section - Now completely self-contained, only show during encounters */}
      {character.inEncounter && (
        <ActionTrackerSection />
      )}
    </>
  );
}