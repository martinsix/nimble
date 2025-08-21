"use client";

import { useState } from "react";
import { Character, CharacterConfiguration } from "@/lib/types/character";
import { CharacterResource, ResourceResetCondition, ResourceResetType } from "@/lib/types/resources";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Trash2, Plus } from "lucide-react";

interface CharacterConfigDialogProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CharacterConfiguration, resources: CharacterResource[], maxHP: number) => void;
}

export function CharacterConfigDialog({ character, isOpen, onClose, onSave }: CharacterConfigDialogProps) {
  const [config, setConfig] = useState<CharacterConfiguration>(character.config);
  const [resources, setResources] = useState<CharacterResource[]>(character.resources);
  const [maxHP, setMaxHP] = useState<number>(character.hitPoints.max);
  const [newResource, setNewResource] = useState<Partial<CharacterResource> | null>(null);
  const [isCreatingResource, setIsCreatingResource] = useState(false);

  const handleSave = () => {
    onSave(config, resources, maxHP);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original config, resources, and maxHP
    setConfig(character.config);
    setResources(character.resources);
    setMaxHP(character.hitPoints.max);
    setIsCreatingResource(false);
    setNewResource(null);
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
    setMaxHP(Math.max(1, numValue)); // Minimum of 1 HP
  };

  const updateMaxInventorySize = (value: string) => {
    const numValue = parseInt(value) || 1;
    setConfig(prev => ({
      ...prev,
      maxInventorySize: Math.max(1, numValue), // Minimum of 1 inventory slot
    }));
  };

  // Resource Management Functions
  const deleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const startCreatingResource = () => {
    setNewResource({
      id: '',
      name: '',
      description: '',
      color: 'blue',
      icon: '',
      resetCondition: 'safe_rest',
      resetType: 'to_max',
      minValue: 0,
      maxValue: 10,
      current: 10,
      sortOrder: resources.length + 1,
    });
    setIsCreatingResource(true);
  };

  const cancelCreateResource = () => {
    setNewResource(null);
    setIsCreatingResource(false);
  };

  const saveNewResource = () => {
    if (!newResource || !newResource.id || !newResource.name) {
      return; // Validation failed
    }

    // Check for duplicate IDs
    if (resources.some(r => r.id === newResource.id)) {
      return; // ID already exists
    }

    const resource: CharacterResource = {
      id: newResource.id,
      name: newResource.name,
      description: newResource.description || '',
      color: newResource.color || 'blue',
      icon: newResource.icon,
      resetCondition: newResource.resetCondition || 'safe_rest',
      resetType: newResource.resetType || 'to_max',
      resetValue: newResource.resetValue,
      minValue: newResource.minValue || 0,
      maxValue: newResource.maxValue || 10,
      current: newResource.current || newResource.maxValue || 10,
      sortOrder: newResource.sortOrder || resources.length + 1,
    };

    setResources(prev => [...prev, resource]);
    setNewResource(null);
    setIsCreatingResource(false);
  };

  const updateNewResource = (field: keyof CharacterResource, value: any) => {
    setNewResource(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Character Configuration</DialogTitle>
          <DialogDescription>
            Configure advanced settings for {character.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 overflow-y-auto flex-1">
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
                value={maxHP}
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

          {/* Resource Management */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Resources</CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={startCreatingResource}
                  disabled={isCreatingResource}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Resources */}
              {resources.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No resources configured. Add a resource to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{resource.name}</span>
                          <span className="text-xs px-2 py-1 bg-muted rounded" style={{ backgroundColor: resource.color + '20', color: resource.color }}>
                            {resource.color}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {resource.id} | {resource.current}/{resource.maxValue} | 
                          Reset: {resource.resetCondition} → {resource.resetType}
                        </div>
                        {resource.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {resource.description}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteResource(resource.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Resource Form */}
              {isCreatingResource && newResource && (
                <Card className="border-2 border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Create New Resource</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="resource-id" className="text-xs">ID*</Label>
                        <Input
                          id="resource-id"
                          placeholder="mana"
                          value={newResource.id || ''}
                          onChange={(e) => updateNewResource('id', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="resource-name" className="text-xs">Name*</Label>
                        <Input
                          id="resource-name"
                          placeholder="Mana"
                          value={newResource.name || ''}
                          onChange={(e) => updateNewResource('name', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="resource-description" className="text-xs">Description</Label>
                      <Textarea
                        id="resource-description"
                        placeholder="Optional description..."
                        value={newResource.description || ''}
                        onChange={(e) => updateNewResource('description', e.target.value)}
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="resource-color" className="text-xs">Color</Label>
                        <Select 
                          value={newResource.color || 'blue'} 
                          onValueChange={(value) => updateNewResource('color', value)}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="yellow">Yellow</SelectItem>
                            <SelectItem value="gray">Gray</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="resource-icon" className="text-xs">Icon</Label>
                        <Input
                          id="resource-icon"
                          placeholder="sparkles"
                          value={newResource.icon || ''}
                          onChange={(e) => updateNewResource('icon', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="resource-reset-condition" className="text-xs">Reset Condition</Label>
                        <Select 
                          value={newResource.resetCondition || 'safe_rest'} 
                          onValueChange={(value: ResourceResetCondition) => updateNewResource('resetCondition', value)}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safe_rest">Safe Rest</SelectItem>
                            <SelectItem value="encounter_end">Encounter End</SelectItem>
                            <SelectItem value="turn_end">Turn End</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="resource-reset-type" className="text-xs">Reset Type</Label>
                        <Select 
                          value={newResource.resetType || 'to_max'} 
                          onValueChange={(value: ResourceResetType) => updateNewResource('resetType', value)}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to_max">To Maximum</SelectItem>
                            <SelectItem value="to_zero">To Zero</SelectItem>
                            <SelectItem value="to_default">To Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="resource-min" className="text-xs">Min</Label>
                        <Input
                          id="resource-min"
                          type="number"
                          value={newResource.minValue || 0}
                          onChange={(e) => updateNewResource('minValue', parseInt(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="resource-max" className="text-xs">Max</Label>
                        <Input
                          id="resource-max"
                          type="number"
                          value={newResource.maxValue || 10}
                          onChange={(e) => updateNewResource('maxValue', parseInt(e.target.value) || 10)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="resource-current" className="text-xs">Current</Label>
                        <Input
                          id="resource-current"
                          type="number"
                          value={newResource.current || newResource.maxValue || 10}
                          onChange={(e) => updateNewResource('current', parseInt(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="resource-default" className="text-xs">Default</Label>
                        <Input
                          id="resource-default"
                          type="number"
                          value={newResource.resetValue || ''}
                          onChange={(e) => updateNewResource('resetValue', e.target.value ? parseInt(e.target.value) : undefined)}
                          className="text-sm"
                          disabled={newResource.resetType !== 'to_default'}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={saveNewResource}
                        disabled={!newResource.id || !newResource.name || resources.some(r => r.id === newResource.id)}
                      >
                        Save Resource
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelCreateResource}>
                        Cancel
                      </Button>
                    </div>
                    {(!newResource.id || !newResource.name) && (
                      <p className="text-xs text-destructive">ID and Name are required</p>
                    )}
                    {newResource.id && resources.some(r => r.id === newResource.id) && (
                      <p className="text-xs text-destructive">Resource ID already exists</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
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