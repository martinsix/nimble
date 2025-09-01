"use client";

import { CombatSummary } from "../sections/combat-summary";
import { SavingThrowsSection } from "../sections/saving-throws-section";
import { ActionsSection } from "../sections/actions-section";

export function CombatTab() {
  return (
    <div className="space-y-6">
      <CombatSummary />
      <SavingThrowsSection />
      <ActionsSection />
    </div>
  );
}