"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";

interface CharacterNameSectionProps {
  name: string;
  onNameChange: (name: string) => void;
  onOpenConfig: () => void;
}

export function CharacterNameSection({ name, onNameChange, onOpenConfig }: CharacterNameSectionProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Label htmlFor="character-name" className="text-lg font-semibold">
          Character Name
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenConfig}
          className="h-8 w-8 p-0"
          title="Character Configuration"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <Input
        id="character-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="text-xl font-bold text-center max-w-md mx-auto"
        placeholder="Enter character name"
      />
    </div>
  );
}