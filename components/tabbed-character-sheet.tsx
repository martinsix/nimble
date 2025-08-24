"use client";

import { BottomTabBar } from "./bottom-tab-bar";
import { CombatTab } from "./tabs/combat-tab";
import { SkillsTab } from "./tabs/skills-tab";
import { CharacterTab } from "./tabs/character-tab";
import { EquipmentTab } from "./tabs/equipment-tab";
import { LogTab } from "./tabs/log-tab";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";

export function TabbedCharacterSheet() {
  const { uiState, updateActiveTab } = useUIStateService();
  const activeTab = uiState.activeTab;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'combat':
        return <CombatTab />;
      case 'skills':
        return <SkillsTab />;
      case 'character':
        return <CharacterTab />;
      case 'equipment':
        return <EquipmentTab />;
      case 'log':
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
      
      {/* Bottom tab navigation */}
      <BottomTabBar activeTab={activeTab} onTabChange={updateActiveTab} />
    </div>
  );
}