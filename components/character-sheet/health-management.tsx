import { Character } from "@/lib/types/character";
import { HitPointsSection } from "../sections/hit-points-section";
import { HitDiceSection } from "../sections/hit-dice-section";
import { WoundsSection } from "../sections/wounds-section";
import { ManaSection } from "../sections/mana-section";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";

export function HealthManagement() {
  // Get character from context to check mana conditions
  const { character } = useCharacterActions();
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  return (
    <>
      {/* Hit Points Section - Now completely self-contained */}
      <HitPointsSection />

      {/* Hit Dice Section - Now completely self-contained */}
      <HitDiceSection />

      {/* Wounds Section - Now completely self-contained */}
      <WoundsSection />

      {/* Mana Section - Now completely self-contained, only show if mana is enabled */}
      {character.config?.mana?.enabled && character.mana && (
        <ManaSection />
      )}
    </>
  );
}