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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Menu, Settings, Users, Plus, Database } from "lucide-react";
import { SettingsPanel } from "./settings-panel";
import { CharacterSelector } from "./character-selector";
import { CharacterCreateForm } from "./character-create-form";
import { ContentManagementPanel } from "./content-management-panel";
import { AppSettings } from "@/lib/services/settings-service";
import { Character } from "@/lib/types/character";

interface AppMenuProps {
  settings: AppSettings;
  characters: Character[];
  onSettingsChange: (settings: AppSettings) => void;
  onCharacterSwitch: (characterId: string) => void;
  onCharacterDelete: (characterId: string) => void;
  onCharacterCreate: (name: string, classId: string) => void;
}

export function AppMenu({ 
  settings, 
  characters,
  onSettingsChange, 
  onCharacterSwitch,
  onCharacterDelete,
  onCharacterCreate
}: AppMenuProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);
  const [showContentManagement, setShowContentManagement] = useState(false);

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
            <DropdownMenuItem onClick={() => setShowContentManagement(true)}>
              <Database className="w-4 h-4 mr-2" />
              Manage Content
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setShowCreateCharacter(true)}
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
        onCharacterCreate={onCharacterCreate}
      />

      <ContentManagementPanel 
        isOpen={showContentManagement}
        onClose={() => setShowContentManagement(false)}
      />

      <Dialog open={showCreateCharacter} onOpenChange={setShowCreateCharacter}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Character</DialogTitle>
          </DialogHeader>
          <CharacterCreateForm
            onCharacterCreate={(name, classId) => {
              onCharacterCreate(name, classId);
              setShowCreateCharacter(false);
            }}
            onCancel={() => setShowCreateCharacter(false)}
            showAsCard={false}
            autoFocus={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}