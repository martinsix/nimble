# Detailed Implementation Plan: Migrating Tabbed Character Sheet to App Router Routes

## 1. Create a new folder structure for character routes

Create the following folder structure:

```
app/
  character/
    layout.tsx       # Shared layout for all character routes
    page.tsx         # Default character page (redirects to a default tab)
    combat/
      page.tsx       # Combat tab content
    skills/
      page.tsx       # Skills tab content
    character/
      page.tsx       # Character tab content (renamed to avoid conflict)
    equipment/
      page.tsx       # Equipment tab content
    spells/
      page.tsx       # Spells tab content
    log/
      page.tsx       # Log tab content
```

## 2. Create layout component for character pages

The layout component will:
- Include the character header
- Include the bottom tab bar
- Handle character data loading
- Provide a consistent layout for all tab routes

```tsx
// app/character/layout.tsx
"use client";

import { CharacterHeader } from "@/components/character-sheet/character-header";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { useCharacterManagement } from "@/lib/hooks/use-character-management";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { CharacterConfigDialog } from "@/components/character-config-dialog";
import { CharacterSelector } from "@/components/character-selector";
import { LoadingScreen } from "@/components/loading-screen";
import { useCallback, useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function CharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // App state management
  const { characters, isLoaded, loadError, showCharacterSelection } =
    useCharacterManagement();

  // Character operations
  const { character, updateCharacter } = useCharacterService();

  // Character config dialog state
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  // Simple name change handler for character header
  const onNameChange = useCallback(
    async (name: string) => {
      if (character) {
        const updatedCharacter = { ...character, name };
        await updateCharacter(updatedCharacter);
      }
    },
    [character, updateCharacter]
  );

  // Character config handlers
  const onOpenConfig = useCallback(() => {
    setShowConfigDialog(true);
  }, []);

  const onCloseConfig = useCallback(() => {
    setShowConfigDialog(false);
  }, []);

  // Update page title based on character name
  useEffect(() => {
    if (character) {
      document.title = `Nimble Navigator - ${character.name}`;
    } else {
      document.title = "Nimble Navigator";
    }
  }, [character]);

  if (!isLoaded) {
    return <LoadingScreen message="Loading character data..." />;
  }

  if (showCharacterSelection || !character) {
    return (
      <CharacterSelector
        fullScreen={true}
        characters={characters}
        activeCharacterId={character?.id}
        errorMessage={loadError || undefined}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-6">
        <CharacterHeader
          onNameChange={onNameChange}
          onOpenConfig={onOpenConfig}
        />
        
        {/* Content area with bottom padding for tab bar */}
        <div className="pb-20 sm:pb-24 min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar />

      {/* Character Config Dialog */}
      {showConfigDialog && <CharacterConfigDialog onClose={onCloseConfig} />}
    </main>
  );
}
```

## 3. Modify the bottom tab bar to use Next.js navigation

Update the bottom tab bar to use Next.js Link components:

```tsx
// components/bottom-tab-bar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabDefinition[] = [
  { path: "/character/combat", label: "Combat", icon: Sword },
  { path: "/character/spells", label: "Spells", icon: Sparkles },
  { path: "/character/skills", label: "Skills", icon: Target },
  { path: "/character/info", label: "Character", icon: User },
  { path: "/character/equipment", label: "Equipment", icon: Package },
  { path: "/character/log", label: "Log", icon: ScrollText },
];

export function BottomTabBar() {
  const { character } = useCharacterService();
  const pathname = usePathname();

  // Filter tabs based on character capabilities
  const visibleTabs = tabs.filter((tab) => {
    // Hide spells tab if character has no spell access or no spells
    if (tab.path === "/character/spells") {
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
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center gap-1 h-12 px-1 sm:px-2 min-w-0 flex-1 max-w-20 ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-xs font-medium leading-tight truncate">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

## 4. Create individual route pages for each tab

### Default Character Page (Redirect)

```tsx
// app/character/page.tsx
"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function CharacterPage() {
  useEffect(() => {
    redirect("/character/combat");
  }, []);

  return null;
}
```

### Combat Tab Page

```tsx
// app/character/combat/page.tsx
"use client";

import { CombatTab } from "@/components/tabs/combat-tab";

export default function CombatPage() {
  return <CombatTab />;
}
```

### Skills Tab Page

```tsx
// app/character/skills/page.tsx
"use client";

import { SkillsTab } from "@/components/tabs/skills-tab";

export default function SkillsPage() {
  return <SkillsTab />;
}
```

### Character Tab Page (renamed to info to avoid conflict)

```tsx
// app/character/info/page.tsx
"use client";

import { CharacterTab } from "@/components/tabs/character-tab";

export default function CharacterInfoPage() {
  return <CharacterTab />;
}
```

### Equipment Tab Page

```tsx
// app/character/equipment/page.tsx
"use client";

import { EquipmentTab } from "@/components/tabs/equipment-tab";

export default function EquipmentPage() {
  return <EquipmentTab />;
}
```

### Spells Tab Page

```tsx
// app/character/spells/page.tsx
"use client";

import { useEffect } from "react";
import { SpellsTab } from "@/components/tabs/spells-tab";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { redirect } from "next/navigation";

export default function SpellsPage() {
  const { character } = useCharacterService();

  // Check if spells tab should be accessible
  const hasSpellAccess =
    character &&
    character.spellTierAccess > 0 &&
    character.abilities.abilities.some((ability) => ability.type === "spell");

  // Redirect if character doesn't have spell access
  useEffect(() => {
    if (!hasSpellAccess) {
      redirect("/character/combat");
    }
  }, [hasSpellAccess]);

  if (!hasSpellAccess) {
    return null;
  }

  return <SpellsTab />;
}
```

### Log Tab Page

```tsx
// app/character/log/page.tsx
"use client";

import { LogTab } from "@/components/tabs/log-tab";

export default function LogPage() {
  return <LogTab />;
}
```

## 5. Implement conditional access for the spells tab

This is handled in two places:
1. In the `BottomTabBar` component, which hides the spells tab if the character doesn't have spell access
2. In the `SpellsPage` component, which redirects to the combat tab if the character doesn't have spell access

## 6. Update the main page to redirect to the character route

```tsx
// app/page.tsx
"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useCharacterManagement } from "@/lib/hooks/use-character-management";
import { CharacterSelector } from "@/components/character-selector";
import { LoadingScreen } from "@/components/loading-screen";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastContainer } from "@/components/toast-container";

function HomeContent() {
  // App state management
  const { characters, isLoaded, loadError, showCharacterSelection } =
    useCharacterManagement();

  useEffect(() => {
    if (isLoaded && !showCharacterSelection && characters.length > 0) {
      redirect("/character/combat");
    }
  }, [isLoaded, showCharacterSelection, characters]);

  if (!isLoaded) {
    return <LoadingScreen message="Loading character data..." />;
  }

  return (
    <CharacterSelector
      fullScreen={true}
      characters={characters}
      activeCharacterId={undefined}
      errorMessage={loadError || undefined}
    />
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
      <ToastContainer />
    </ErrorBoundary>
  );
}
```

## 7. Handle character data loading in the new routes

Character data loading is handled in the layout component, which ensures that:
- Character data is loaded and available in all routes
- The character selector is shown if no character is selected
- The loading screen is shown while character data is loading

## 8. Test the migration to ensure all functionality works correctly

After implementing all the changes, test the application to ensure:
- Navigation between tabs works correctly
- The spells tab is hidden if the character doesn't have spell access
- Character data is loaded and displayed correctly in all tabs
- The character config dialog can be opened and used from any tab
- The character selector is shown if no character is selected