import { HitDiceSection } from "../sections/hit-dice-section";
import { WoundsSection } from "../sections/wounds-section";

export function HealthManagement() {
  return (
    <>
      {/* Hit Dice Section - Now completely self-contained */}
      <HitDiceSection />

      {/* Wounds Section - Now completely self-contained */}
      <WoundsSection />
    </>
  );
}