import { CombatSummary } from "@/components/sections/combat-summary";
import { SavingThrowsSection } from "@/components/sections/saving-throws-section";
import { ActionsSection } from "@/components/sections/actions-section";

export default function CombatPage() {
  return (
    <>
      <CombatSummary />
      <SavingThrowsSection />
      <ActionsSection />
    </>
  );
}
