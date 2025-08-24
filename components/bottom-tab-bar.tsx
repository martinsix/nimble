"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Sword, Target, User, Package, ScrollText } from "lucide-react";
import { TabType } from "@/lib/services/ui-state-service";

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabDefinition {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabDefinition[] = [
  { id: 'combat', label: 'Combat', icon: Sword },
  { id: 'skills', label: 'Skills', icon: Target },
  { id: 'character', label: 'Character', icon: User },
  { id: 'equipment', label: 'Equipment', icon: Package },
  { id: 'log', label: 'Log', icon: ScrollText },
];

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="w-full px-2 sm:px-4">
        <div className="flex justify-around items-center h-16 max-w-screen-sm mx-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 h-12 px-1 sm:px-2 min-w-0 flex-1 max-w-20 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs font-medium leading-tight truncate">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}