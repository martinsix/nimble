"use client";

import { HitPointsSection } from "../sections/hit-points-section";
import { WoundsSection } from "../sections/wounds-section";
import { ActionTrackerSection } from "../sections/action-tracker-section";
import { AttributesSection } from "../sections/attributes-section";
import { InitiativeSection } from "../sections/initiative-section";
import { ActionsSection } from "../sections/actions-section";

export function CombatTab() {
  return (
    <div className="space-y-6">
      <HitPointsSection />
      <WoundsSection />
      <ActionTrackerSection />
      <AttributesSection />
      <InitiativeSection />
      <ActionsSection />
    </div>
  );
}