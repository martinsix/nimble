"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Menu, Settings, Users, Plus } from "lucide-react";
import { SettingsPanel } from "./settings-panel";
import { CharacterSelector } from "./character-selector";
import { AppSettings } from "@/lib/services/settings-service";
import { Character } from "@/lib/types/character";

interface AppMenuProps {
  settings: AppSettings;
  characters: Character[];
  onSettingsChange: (settings: AppSettings) => void;
  onCharacterSwitch: (characterId: string) => void;
  onCharacterDelete: (characterId: string) => void;
}

export function AppMenu({ 
  settings, 
  characters,
  onSettingsChange, 
  onCharacterSwitch,
  onCharacterDelete
}: AppMenuProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Menu className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowCharacterSelector(true)}>
              <Users className="w-4 h-4 mr-2" />
              Characters
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                const name = prompt("Enter character name:");
                if (name?.trim()) {
                  const event = new CustomEvent('createCharacter', { detail: name.trim() });
                  window.dispatchEvent(event);
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Character
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />

      <CharacterSelector 
        isOpen={showCharacterSelector}
        onClose={() => setShowCharacterSelector(false)}
        characters={characters}
        activeCharacterId={settings.activeCharacterId}
        onCharacterSwitch={onCharacterSwitch}
        onCharacterDelete={onCharacterDelete}
      />
    </>
  );
}