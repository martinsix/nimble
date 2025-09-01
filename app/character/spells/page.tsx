"use client";

import { SpellsSection } from "@/components/sections/spells-section";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function SpellsPage() {
  const { character } = useCharacterService();

  // Check if character has spell access
  const hasSpellAccess =
    character &&
    character.spellTierAccess > 0 &&
    character.abilities.abilities.some((ability) => ability.type === "spell");

  // Redirect to combat tab if character doesn't have spell access
  useEffect(() => {
    if (!hasSpellAccess) {
      redirect("/character/combat");
    }
  }, [hasSpellAccess]);

  // If we're still here, character has spell access
  return (
    <div className="space-y-4">
      <SpellsSection />
    </div>
  );
}
