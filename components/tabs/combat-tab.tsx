"use client";

import { CombatSummary } from "../sections/combat-summary";
import { AttributesSection } from "../sections/attributes-section";
import { ActionsSection } from "../sections/actions-section";

export function CombatTab() {
  return (
    <div className="space-y-6">
      <CombatSummary />
      <AttributesSection />
      <ActionsSection />
    </div>
  );
}