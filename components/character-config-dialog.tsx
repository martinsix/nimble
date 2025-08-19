"use client";

import { useState } from "react";
import { Character, AttributeName, CharacterConfiguration } from "@/lib/types/character";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CharacterConfigDialogProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CharacterConfiguration) => void;
}

export function CharacterConfigDialog({ character, isOpen, onClose, onSave }: CharacterConfigDialogProps) {
  const [config, setConfig] = useState<CharacterConfiguration>(character.config);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original config
    setConfig(character.config);
    onClose();
  };

  const updateMaxWounds = (value: string) => {
    const numValue = parseInt(value) || 1;
    setConfig(prev => ({
      ...prev,
      maxWounds: Math.max(1, numValue), // Minimum of 1 wound
    }));
  };

  const updateMaxHP = (value: string) => {
    const numValue = parseInt(value) || 1;
    setConfig(prev => ({
      ...prev,
      maxHP: Math.max(1, numValue), // Minimum of 1 HP
    }));
  };

  const updateMaxInventorySize = (value: string) => {
    const numValue = parseInt(value) || 1;
    setConfig(prev => ({
      ...prev,
      maxInventorySize: Math.max(1, numValue), // Minimum of 1 inventory slot
    }));
  };

  const updateManaEnabled = (enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      mana: {
        ...prev.mana,
        enabled,
      },
    }));
  };

  const updateManaAttribute = (attribute: AttributeName) => {
    setConfig(prev => ({
      ...prev,
      mana: {
        ...prev.mana,
        attribute,
      },
    }));
  };

  const attributeOptions: { value: AttributeName; label: string }[] = [
    { value: 'strength', label: 'Strength' },
    { value: 'dexterity', label: 'Dexterity' },
    { value: 'intelligence', label: 'Intelligence' },
    { value: 'will', label: 'Will' },
  ];

  // Calculate what the mana pool would be if enabled
  const manaAttributeValue = character.attributes[config.mana.attribute];
  const calculatedMaxMana = 3 * manaAttributeValue + character.level;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Character Configuration</DialogTitle>
          <DialogDescription>
            Configure advanced settings for {character.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Wounds Configuration */}
          <div className="space-y-2">
            <Label htmlFor="max-wounds" className="text-sm font-medium">
              Maximum Wounds
            </Label>
            <div className="space-y-1">
              <Input
                id="max-wounds"
                type="number"
                min="1"
                max="20"
                value={config.maxWounds}
                onChange={(e) => updateMaxWounds(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Number of wounds the character can sustain before death.
              </p>
            </div>
          </div>

          {/* Max HP Configuration */}
          <div className="space-y-2">
            <Label htmlFor="max-hp" className="text-sm font-medium">
              Maximum Hit Points
            </Label>
            <div className="space-y-1">
              <Input
                id="max-hp"
                type="number"
                min="1"
                max="1000"
                value={config.maxHP}
                onChange={(e) => updateMaxHP(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Base maximum hit points for the character.
              </p>
            </div>
          </div>

          {/* Max Inventory Size Configuration */}
          <div className="space-y-2">
            <Label htmlFor="max-inventory" className="text-sm font-medium">
              Base Inventory Size
            </Label>
            <div className="space-y-1">
              <Input
                id="max-inventory"
                type="number"
                min="1"
                max="100"
                value={config.maxInventorySize}
                onChange={(e) => updateMaxInventorySize(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Base inventory slots (before strength bonus). Final size = {config.maxInventorySize} + {character.attributes.strength} (strength) = {config.maxInventorySize + character.attributes.strength}.
              </p>
            </div>
          </div>

          {/* Mana Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Mana System
                </Label>
                <div className="text-xs text-muted-foreground">
                  Enable mana points for spellcasting or special abilities.
                </div>
              </div>
              <Switch
                checked={config.mana.enabled}
                onCheckedChange={updateManaEnabled}
              />
            </div>

            {config.mana.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Mana Attribute
                  </Label>
                  <Select 
                    value={config.mana.attribute} 
                    onValueChange={updateManaAttribute}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {attributeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Which attribute determines the mana pool size.
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Calculated Mana Pool
                  </Label>
                  <div className="p-2 bg-muted rounded text-sm">
                    <div className="font-mono">
                      {calculatedMaxMana} mana points
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Formula: (3 × {config.mana.attribute} [{manaAttributeValue}]) + level [{character.level}] = {calculatedMaxMana}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}