"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Character } from "@/lib/types/character";
import { Plus, Trash2, User, Clock } from "lucide-react";

interface CharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  activeCharacterId: string;
  onCharacterSwitch: (characterId: string) => void;
  onCharacterDelete: (characterId: string) => void;
}

export function CharacterSelector({ 
  isOpen, 
  onClose, 
  characters,
  activeCharacterId,
  onCharacterSwitch,
  onCharacterDelete
}: CharacterSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");

  const handleCreateCharacter = () => {
    if (newCharacterName.trim()) {
      // This will be handled by the parent component
      const name = newCharacterName.trim();
      setNewCharacterName("");
      setShowCreateForm(false);
      
      // Trigger creation through a custom event or callback
      const event = new CustomEvent('createCharacter', { detail: name });
      window.dispatchEvent(event);
    }
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (characters.length <= 1) {
      alert("Cannot delete the last character. Create another character first.");
      return;
    }
    
    const character = characters.find(c => c.id === characterId);
    if (character && confirm(`Are you sure you want to delete "${character.name}"?`)) {
      onCharacterDelete(characterId);
    }
  };

  const formatLastPlayed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const sortedCharacters = [...characters].sort((a, b) => 
    b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Characters</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Character Section */}
          {!showCreateForm ? (
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Character
            </Button>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-4 space-y-4">
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
                        setShowCreateForm(false);
                        setNewCharacterName("");
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateCharacter}
                    disabled={!newCharacterName.trim()}
                    size="sm"
                  >
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCharacterName("");
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Character List */}
          <div className="space-y-2">
            {sortedCharacters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No characters found. Create your first character above!
              </div>
            ) : (
              sortedCharacters.map((character) => (
                <Card 
                  key={character.id}
                  className={`cursor-pointer transition-colors ${
                    character.id === activeCharacterId 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    if (character.id !== activeCharacterId) {
                      onCharacterSwitch(character.id);
                      onClose();
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">
                            {character.name}
                            {character.id === activeCharacterId && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                Active
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatLastPlayed(character.updatedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCharacter(character.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                          disabled={character.id === activeCharacterId && characters.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}