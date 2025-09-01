"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Wand2 } from "lucide-react";
import { ContentRepositoryService } from "@/lib/services/content-repository-service";
import { CharacterBuilder } from "./character-builder";

interface CharacterCreateFormProps {
  onCharacterCreate: (name: string, classId: string) => void;
  onCancel?: () => void;
  showAsCard?: boolean; // Whether to wrap in a card or just show the form
  autoFocus?: boolean;
  onCharacterCreated?: (characterId: string) => void; // For builder integration
}

export function CharacterCreateForm({ 
  onCharacterCreate, 
  onCancel,
  showAsCard = true,
  autoFocus = true,
  onCharacterCreated
}: CharacterCreateFormProps) {
  const [newCharacterName, setNewCharacterName] = useState("");
  const [selectedClass, setSelectedClass] = useState("fighter");
  const [showBuilder, setShowBuilder] = useState(false);

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

  const handleBuilderCharacterCreated = (characterId: string) => {
    setShowBuilder(false);
    if (onCharacterCreated) {
      onCharacterCreated(characterId);
    }
    onCancel?.(); // Close the form as well
  };

  const formContent = (
    <div className="space-y-4">
      {/* Character Builder Option */}
      <div className="text-center">
        <Button 
          onClick={() => setShowBuilder(true)}
          className="w-full mb-4"
          variant="default"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Character Builder
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or create quickly</span>
          </div>
        </div>
      </div>

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
          Quick Create
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
      <>
        <Card className="border-dashed">
          <CardContent className="pt-4">
            {formContent}
          </CardContent>
        </Card>
        
        {/* Character Builder Modal */}
        <CharacterBuilder
          isOpen={showBuilder}
          onClose={() => setShowBuilder(false)}
          onCharacterCreated={handleBuilderCharacterCreated}
        />
      </>
    );
  }

  return (
    <>
      {formContent}
      
      {/* Character Builder Modal */}
      <CharacterBuilder
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        onCharacterCreated={handleBuilderCharacterCreated}
      />
    </>
  );
}