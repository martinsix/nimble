"use client";

import { HitPointsSection } from "../sections/hit-points-section";
import { ActionTrackerSection } from "../sections/action-tracker-section";
import { AttributesSection } from "../sections/attributes-section";
import { InitiativeSection } from "../sections/initiative-section";
import { ActionsSection } from "../sections/actions-section";

export function CombatTab() {
  return (
    <div className="space-y-6">
      <HitPointsSection />
      <ActionTrackerSection />
      <AttributesSection />
      <InitiativeSection />
      <ActionsSection />
    </div>
  );
}