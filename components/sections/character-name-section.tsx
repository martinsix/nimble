"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CharacterNameSectionProps {
  name: string;
  onNameChange: (name: string) => void;
}

export function CharacterNameSection({ name, onNameChange }: CharacterNameSectionProps) {
  return (
    <div className="text-center">
      <Label htmlFor="character-name" className="text-lg font-semibold">
        Character Name
      </Label>
      <Input
        id="character-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="text-xl font-bold text-center mt-2 max-w-md mx-auto"
        placeholder="Enter character name"
      />
    </div>
  );
}