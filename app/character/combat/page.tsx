"use client";

import { CombatSummary } from "@/components/sections/combat-summary";
import { SavingThrowsSection } from "@/components/sections/saving-throws-section";
import { ActionsSection } from "@/components/sections/actions-section";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { APP_NAME } from "@/lib/config/app-constants";

export default function CombatPage() {
  const { character } = useCharacterService();

  // Check if character has spell access (same logic as before)
  const hasSpellAccess =
    character &&
    character.spellTierAccess > 0 &&
    character.abilities.abilities.some((ability) => ability.type === "spell");

  // Auto-redirect to combat tab if character loses spell access while on spells page
  // This is just a safeguard, routing should prevent this situation
  useEffect(() => {
    if (!hasSpellAccess && window.location.pathname === "/character/spells") {
      redirect("/character/combat");
    }
  }, [hasSpellAccess]);

  return (
    <>
      <CombatSummary />
      <SavingThrowsSection />
      <ActionsSection />
    </>
  );
}
