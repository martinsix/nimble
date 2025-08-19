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
import { Abilities, Ability, ActionAbility, FreeformAbility, AbilityFrequency } from "@/lib/types/abilities";
import { Sparkles, Plus, Trash2, Edit, ChevronDown, ChevronRight, Zap, FileText } from "lucide-react";

interface AbilitySectionProps {
  abilities: Abilities;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onUpdateAbilities: (abilities: Abilities) => void;
}

interface NewAbilityForm {
  name: string;
  description: string;
  type: 'freeform' | 'action';
  frequency: AbilityFrequency;
  maxUses: number;
}

export function AbilitySection({ 
  abilities, 
  isOpen, 
  onToggle, 
  onUpdateAbilities 
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

  const useAbility = (abilityId: string) => {
    const updatedAbilities = abilities.abilities.map(ability => {
      if (ability.id === abilityId && ability.type === 'action') {
        return {
          ...ability,
          currentUses: Math.max(0, ability.currentUses - 1),
        };
      }
      return ability;
    });
    onUpdateAbilities({ abilities: updatedAbilities });
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
          maxUses: newAbility.maxUses,
          currentUses: newAbility.maxUses,
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
    };
    const labels = {
      per_turn: 'Per Turn',
      per_encounter: 'Per Encounter',
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
    const isUsed = actionAbility.currentUses === 0;

    return (
      <Card key={ability.id} className={`mb-2 ${isUsed ? 'opacity-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <h4 className="font-semibold">{ability.name}</h4>
                {getFrequencyBadge(actionAbility.frequency)}
                <Badge variant="secondary">
                  {actionAbility.currentUses}/{actionAbility.maxUses} uses
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{ability.description}</p>
              <Button
                variant={isUsed ? "outline" : "default"}
                size="sm"
                onClick={() => useAbility(ability.id)}
                disabled={isUsed}
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
                          </SelectContent>
                        </Select>
                      </div>

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