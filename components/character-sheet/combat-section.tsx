import { ActionTrackerSection } from "../sections/action-tracker-section";
import { useCharacterService } from "@/lib/hooks/use-character-service";

export function CombatSection() {
  // Get character from service hook to check encounter state
  const { character } = useCharacterService();
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  return (
    <>
      {/* Action Tracker Section - Now completely self-contained, only show during encounters */}
      {character.inEncounter && (
        <ActionTrackerSection />
      )}
    </>
  );
}