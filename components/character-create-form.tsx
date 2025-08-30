"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus } from "lucide-react";
import { ContentRepositoryService } from "@/lib/services/content-repository-service";

interface CharacterCreateFormProps {
  onCharacterCreate: (name: string, classId: string) => void;
  onCancel?: () => void;
  showAsCard?: boolean; // Whether to wrap in a card or just show the form
  autoFocus?: boolean;
}

export function CharacterCreateForm({ 
  onCharacterCreate, 
  onCancel,
  showAsCard = true,
  autoFocus = true
}: CharacterCreateFormProps) {
  const [newCharacterName, setNewCharacterName] = useState("");
  const [selectedClass, setSelectedClass] = useState("fighter");

  const contentRepository = ContentRepositoryService.getInstance();
  const availableClasses = contentRepository.getAllClasses();

  const handleCreateCharacter = () => {
    if (newCharacterName.trim()) {
      const name = newCharacterName.trim();
      onCharacterCreate(name, selectedClass);
      
      // Reset form
      setNewCharacterName("");
      setSelectedClass("fighter");
    }
  };

  const handleCancel = () => {
    setNewCharacterName("");
    setSelectedClass("fighter");
    onCancel?.();
  };

  const formContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="character-name">Character Name</Label>
        <Input
          id="character-name"
          value={newCharacterName}
          onChange={(e) => setNewCharacterName(e.target.value)}
          placeholder="Enter character name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateCharacter();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          autoFocus={autoFocus}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="character-class">Class</Label>
        <select 
          id="character-class"
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {availableClasses.map((cls: any) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={handleCreateCharacter}
          disabled={!newCharacterName.trim()}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={handleCancel}
            size="sm"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );

  if (showAsCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-4">
          {formContent}
        </CardContent>
      </Card>
    );
  }

  return formContent;
}