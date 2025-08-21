import { HitPointsSection } from "../sections/hit-points-section";
import { HitDiceSection } from "../sections/hit-dice-section";
import { WoundsSection } from "../sections/wounds-section";

export function HealthManagement() {
  return (
    <>
      {/* Hit Points Section - Now completely self-contained */}
      <HitPointsSection />

      {/* Hit Dice Section - Now completely self-contained */}
      <HitDiceSection />

      {/* Wounds Section - Now completely self-contained */}
      <WoundsSection />
    </>
  );
}