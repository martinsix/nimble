"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sword,
  Target,
  User,
  Package,
  Sparkles,
  ScrollText,
} from "lucide-react";
import { useCharacterService } from "@/lib/hooks/use-character-service";

interface TabDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const tabs: TabDefinition[] = [
  { id: "combat", label: "Combat", icon: Sword, path: "/character/combat" },
  { id: "spells", label: "Spells", icon: Sparkles, path: "/character/spells" },
  { id: "skills", label: "Skills", icon: Target, path: "/character/skills" },
  { id: "character", label: "Character", icon: User, path: "/character/info" },
  {
    id: "equipment",
    label: "Equipment",
    icon: Package,
    path: "/character/equipment",
  },
  { id: "log", label: "Log", icon: ScrollText, path: "/character/log" },
];

export function BottomTabBar() {
  const { character } = useCharacterService();
  const pathname = usePathname();

  // Filter tabs based on character capabilities
  const visibleTabs = tabs.filter((tab) => {
    // Hide spells tab if character has no spell access or no spells
    if (tab.id === "spells") {
      if (!character || character.spellTierAccess === 0) return false;
      // Also check if character has any spell abilities
      const hasSpells = character.abilities.abilities.some(
        (ability) => ability.type === "spell"
      );
      return hasSpells;
    }
    return true;
  });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-background border-t z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="w-full px-2 sm:px-4">
        <div className="flex justify-around items-center h-16 max-w-(--breakpoint-sm) mx-auto">
          {visibleTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = pathname === tab.path;

            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                asChild
                className={`flex flex-col items-center gap-1 h-12 px-1 sm:px-2 min-w-0 flex-1 max-w-20 ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link href={tab.path}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="text-xs font-medium leading-tight truncate">
                    {tab.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
