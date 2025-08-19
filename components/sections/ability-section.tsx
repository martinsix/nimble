"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Abilities, Ability, ActionAbility, FreeformAbility, AbilityFrequency, AbilityRoll } from "@/lib/types/abilities";
import { AttributeName, Character } from "@/lib/types/character";
import { abilityService } from "@/lib/services/ability-service";
import { Sparkles, Plus, Trash2, Edit, ChevronDown, ChevronRight, Zap, FileText } from "lucide-react";

interface AbilitySectionProps {
  abilities: Abilities;
  character: Character;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onUpdateAbilities: (abilities: Abilities) => void;
  onUseAbility?: (abilityId: string) => void;
}

interface NewAbilityForm {
  name: string;
  description: string;
  type: 'freeform' | 'action';
  frequency: AbilityFrequency;
  maxUses?: number;
  roll?: {
    dice: string;
    modifier?: number;
    attribute?: AttributeName;
  };
}

export function AbilitySection({ 
  abilities, 
  character,
  isOpen, 
  onToggle, 
  onUpdateAbilities,
  onUseAbility 
}: AbilitySectionProps) {
  const [isAddingAbility, setIsAddingAbility] = useState(false);
  const [editingAbility, setEditingAbility] = useState<string | null>(null);
  const [newAbility, setNewAbility] = useState<NewAbilityForm>({
    name: '',
    description: '',
    type: 'freeform',
    frequency: 'per_encounter',
    maxUses: 1,
  });

  const handleUseAbility = (abilityId: string) => {
    if (onUseAbility) {
      onUseAbility(abilityId);
    }
  };

  const addAbility = () => {
    if (!newAbility.name.trim()) return;

    const ability: Ability = newAbility.type === 'freeform' 
      ? {
          id: `ability-${Date.now()}`,
          name: newAbility.name,
          description: newAbility.description,
          type: 'freeform',
        }
      : {
          id: `ability-${Date.now()}`,
          name: newAbility.name,
          description: newAbility.description,
          type: 'action',
          frequency: newAbility.frequency,
          ...(newAbility.frequency !== 'at_will' && newAbility.maxUses ? {
            maxUses: newAbility.maxUses,
            currentUses: newAbility.maxUses,
          } : {}),
          ...(newAbility.roll && newAbility.roll.dice ? { roll: newAbility.roll } : {}),
        };

    onUpdateAbilities({
      abilities: [...abilities.abilities, ability],
    });

    setNewAbility({
      name: '',
      description: '',
      type: 'freeform',
      frequency: 'per_encounter',
      maxUses: 1,
    });
    setIsAddingAbility(false);
  };

  const deleteAbility = (abilityId: string) => {
    onUpdateAbilities({
      abilities: abilities.abilities.filter(ability => ability.id !== abilityId),
    });
  };

  const getFrequencyBadge = (frequency: AbilityFrequency) => {
    const colors = {
      per_turn: 'bg-green-100 text-green-800',
      per_encounter: 'bg-blue-100 text-blue-800',
      at_will: 'bg-purple-100 text-purple-800',
    };
    const labels = {
      per_turn: 'Per Turn',
      per_encounter: 'Per Encounter',
      at_will: 'At Will',
    };
    
    return (
      <Badge className={colors[frequency]}>
        {labels[frequency]}
      </Badge>
    );
  };

  const renderAbility = (ability: Ability) => {
    if (ability.type === 'freeform') {
      return (
        <Card key={ability.id} className="mb-2">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h4 className="font-semibold">{ability.name}</h4>
                  <Badge variant="outline">Freeform</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{ability.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAbility(ability.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    const actionAbility = ability as ActionAbility;
    const isUsed = actionAbility.frequency !== 'at_will' && actionAbility.currentUses === 0;

    return (
      <Card key={ability.id} className={`mb-2 ${isUsed ? 'opacity-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <h4 className="font-semibold">{ability.name}</h4>
                {getFrequencyBadge(actionAbility.frequency)}
                {actionAbility.frequency !== 'at_will' && actionAbility.maxUses && (
                  <Badge variant="secondary">
                    {actionAbility.currentUses}/{actionAbility.maxUses} uses
                  </Badge>
                )}
                {actionAbility.frequency === 'at_will' && (
                  <Badge variant="outline">At Will</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{ability.description}</p>
              {actionAbility.roll && (
                <div className="mb-3 p-2 bg-muted/50 rounded text-sm">
                  <strong>Roll:</strong> {abilityService.getAbilityRollDescription(actionAbility.roll, character)}
                </div>
              )}
              <Button
                variant={isUsed ? "outline" : "default"}
                size="sm"
                onClick={() => handleUseAbility(ability.id)}
                disabled={isUsed || !onUseAbility}
              >
                {isUsed ? "Used" : "Use Ability"}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteAbility(ability.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Abilities
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {abilities.abilities.length}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Existing Abilities */}
            <div className="space-y-2">
              {abilities.abilities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No abilities yet. Add your first ability below!
                </div>
              ) : (
                abilities.abilities.map(renderAbility)
              )}
            </div>

            {/* Add New Ability Form */}
            {isAddingAbility ? (
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ability-name">Ability Name</Label>
                    <Input
                      id="ability-name"
                      value={newAbility.name}
                      onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })}
                      placeholder="Enter ability name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ability-description">Description</Label>
                    <Textarea
                      id="ability-description"
                      value={newAbility.description}
                      onChange={(e) => setNewAbility({ ...newAbility, description: e.target.value })}
                      placeholder="Describe what this ability does"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ability-type">Type</Label>
                    <Select
                      value={newAbility.type}
                      onValueChange={(value: 'freeform' | 'action') => 
                        setNewAbility({ ...newAbility, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freeform">Freeform (Text only)</SelectItem>
                        <SelectItem value="action">Action (Limited uses)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newAbility.type === 'action' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="ability-frequency">Frequency</Label>
                        <Select
                          value={newAbility.frequency}
                          onValueChange={(value: AbilityFrequency) => 
                            setNewAbility({ ...newAbility, frequency: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per_turn">Per Turn</SelectItem>
                            <SelectItem value="per_encounter">Per Encounter</SelectItem>
                            <SelectItem value="at_will">At Will</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newAbility.frequency !== 'at_will' && (
                        <div className="space-y-2">
                          <Label htmlFor="ability-uses">Maximum Uses</Label>
                          <Input
                            id="ability-uses"
                            type="number"
                            min="1"
                            max="10"
                            value={newAbility.maxUses}
                            onChange={(e) => setNewAbility({ 
                              ...newAbility, 
                              maxUses: parseInt(e.target.value) || 1 
                            })}
                          />
                        </div>
                      )}
                      
                      {/* Roll Configuration */}
                      <div className="space-y-2">
                        <Label>Roll Configuration (Optional)</Label>
                        <div className="space-y-3 p-3 border rounded-md">
                          <div className="space-y-2">
                            <Label htmlFor="ability-dice">Dice (e.g., 2d4, 1d6)</Label>
                            <Input
                              id="ability-dice"
                              placeholder="2d4"
                              value={newAbility.roll?.dice || ''}
                              onChange={(e) => setNewAbility({
                                ...newAbility,
                                roll: {
                                  ...newAbility.roll,
                                  dice: e.target.value
                                }
                              })}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor="ability-modifier">Fixed Modifier</Label>
                              <Input
                                id="ability-modifier"
                                type="number"
                                placeholder="0"
                                value={newAbility.roll?.modifier || ''}
                                onChange={(e) => setNewAbility({
                                  ...newAbility,
                                  roll: {
                                    ...newAbility.roll,
                                    modifier: e.target.value ? parseInt(e.target.value) : undefined
                                  }
                                })}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="ability-attribute">Attribute</Label>
                              <Select
                                value={newAbility.roll?.attribute || 'none'}
                                onValueChange={(value: AttributeName | 'none') => 
                                  setNewAbility({
                                    ...newAbility,
                                    roll: {
                                      ...newAbility.roll,
                                      attribute: value === 'none' ? undefined : value
                                    }
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="strength">Strength</SelectItem>
                                  <SelectItem value="dexterity">Dexterity</SelectItem>
                                  <SelectItem value="intelligence">Intelligence</SelectItem>
                                  <SelectItem value="will">Will</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={addAbility} disabled={!newAbility.name.trim()}>
                      Add Ability
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingAbility(false);
                        setNewAbility({
                          name: '',
                          description: '',
                          type: 'freeform',
                          frequency: 'per_encounter',
                          maxUses: 1,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsAddingAbility(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Ability
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}