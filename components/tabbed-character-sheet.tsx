"use client";

import { useEffect } from "react";
import { CombatTab } from "./tabs/combat-tab";
import { SkillsTab } from "./tabs/skills-tab";
import { CharacterTab } from "./tabs/character-tab";
import { EquipmentTab } from "./tabs/equipment-tab";
import { SpellsTab } from "./tabs/spells-tab";
import { LogTab } from "./tabs/log-tab";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";
import { useCharacterService } from "@/lib/hooks/use-character-service";

export function TabbedCharacterSheet() {
  const { uiState, updateActiveTab } = useUIStateService();
  const activeTab = uiState.activeTab;
  const { character } = useCharacterService();

  // Check if spells tab should be accessible
  const hasSpellAccess =
    character &&
    character.spellTierAccess > 0 &&
    character.abilities.abilities.some((ability) => ability.type === "spell");

  // Auto-switch away from spells tab if character loses spell access
  useEffect(() => {
    if (activeTab === "spells" && !hasSpellAccess) {
      updateActiveTab("combat"); // Default to combat tab
    }
  }, [activeTab, hasSpellAccess, updateActiveTab]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "combat":
        return <CombatTab />;
      case "skills":
        return <SkillsTab />;
      case "character":
        return <CharacterTab />;
      case "equipment":
        return <EquipmentTab />;
      case "spells":
        return <SpellsTab />;
      case "log":
        return <LogTab />;
      default:
        return <CombatTab />;
    }
  };

  return (
    <div className="relative">
      {/* Content area with bottom padding for tab bar */}
      <div className="pb-20 sm:pb-24 min-h-[calc(100vh-8rem)]">
        {renderActiveTab()}
      </div>
    </div>
  );
}
