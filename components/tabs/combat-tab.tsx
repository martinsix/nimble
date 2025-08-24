"use client";

import { CombatSummary } from "../sections/combat-summary";
import { ActionTrackerSection } from "../sections/action-tracker-section";
import { AttributesSection } from "../sections/attributes-section";
import { InitiativeSection } from "../sections/initiative-section";
import { ActionsSection } from "../sections/actions-section";

export function CombatTab() {
  return (
    <div className="space-y-6">
      <CombatSummary />
      <ActionTrackerSection />
      <AttributesSection />
      <InitiativeSection />
      <ActionsSection />
    </div>
  );
}