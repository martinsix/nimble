"use client";

import { useState } from "react";
import { BottomTabBar, TabType } from "./bottom-tab-bar";
import { CombatTab } from "./tabs/combat-tab";
import { SkillsTab } from "./tabs/skills-tab";
import { CharacterTab } from "./tabs/character-tab";
import { EquipmentTab } from "./tabs/equipment-tab";
import { LogTab } from "./tabs/log-tab";

export function TabbedCharacterSheet() {
  const [activeTab, setActiveTab] = useState<TabType>('combat');

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
      <div className="pb-20">
        {renderActiveTab()}
      </div>
      
      {/* Bottom tab navigation */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}