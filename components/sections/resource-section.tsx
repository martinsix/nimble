"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Minus, Plus, ChevronDown, ChevronRight, Sparkles, Flame, Target, Zap } from "lucide-react";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { useUIStateService } from "@/lib/hooks/use-ui-state-service";
import { useResourceService } from "@/lib/hooks/use-resource-service";

const RESOURCE_ICONS = {
  sparkles: Sparkles,
  flame: Flame,
  target: Target,
  lightning: Zap,
} as const;

export function ResourceSection() {
  // Direct singleton access with automatic re-rendering - no context needed!
  const { character } = useCharacterService();
  const { uiState, updateCollapsibleState } = useUIStateService();
  const { activeResources, spendResource, restoreResource, getResourceDefinition } = useResourceService();
  
  const [spendAmounts, setSpendAmounts] = useState<Record<string, string>>({});
  const [restoreAmounts, setRestoreAmounts] = useState<Record<string, string>>({});
  
  // Early return if no character or no resources
  if (!character || activeResources.length === 0) return null;
  
  const isOpen = uiState.collapsibleSections.resources;
  const onToggle = (isOpen: boolean) => updateCollapsibleState('resources', isOpen);

  const applySpend = async (resourceId: string, amount: number, resetInput: boolean = false) => {
    await spendResource(resourceId, amount);
    
    if (resetInput) {
      setSpendAmounts(prev => ({ ...prev, [resourceId]: "1" }));
    }
  };

  const applyRestore = async (resourceId: string, amount: number, resetInput: boolean = false) => {
    await restoreResource(resourceId, amount);
    
    if (resetInput) {
      setRestoreAmounts(prev => ({ ...prev, [resourceId]: "1" }));
    }
  };

  const handleSpend = (resourceId: string) => {
    const amount = parseInt(spendAmounts[resourceId] || "1") || 1;
    applySpend(resourceId, amount, true);
  };

  const handleRestore = (resourceId: string) => {
    const amount = parseInt(restoreAmounts[resourceId] || "1") || 1;
    applyRestore(resourceId, amount, true);
  };

  const getResourceBarColor = (resourceId: string, current: number, max: number) => {
    const definition = getResourceDefinition(resourceId);
    if (definition) {
      // Use resource-specific color
      if (definition.color.startsWith('#')) {
        return `bg-[${definition.color}]`;
      }
      return `bg-${definition.color}-500`;
    }
    
    // Fallback based on percentage
    const percentage = (current / max) * 100;
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getResourceIcon = (resourceId: string) => {
    const definition = getResourceDefinition(resourceId);
    if (definition?.icon && definition.icon in RESOURCE_ICONS) {
      return RESOURCE_ICONS[definition.icon as keyof typeof RESOURCE_ICONS];
    }
    return Sparkles; // Default icon
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Resources
          </h2>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4">
          {activeResources.map((resource) => {
            const definition = getResourceDefinition(resource.id);
            const ResourceIcon = getResourceIcon(resource.id);
            const resourceBarColor = getResourceBarColor(resource.id, resource.current, resource.maxValue);
            const resourcePercentage = (resource.current / resource.maxValue) * 100;
            const resourceName = definition?.name || resource.id;
            const spendAmount = spendAmounts[resource.id] || "1";
            const restoreAmount = restoreAmounts[resource.id] || "1";
            
            return (
              <Card key={resource.id} className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <ResourceIcon className={`w-5 h-5 text-${definition?.color || 'blue'}-500`} />
                    {resourceName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Resource Display and Bar */}
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold">
                      {resource.current} / {resource.maxValue}
                      {resource.current === 0 && (
                        <span className="text-lg text-red-600 ml-2 font-semibold">
                          (Depleted)
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${resourceBarColor}`}
                        style={{ width: `${resourcePercentage}%` }}
                      />
                    </div>
                    {definition?.description && (
                      <div className="text-sm text-muted-foreground">
                        {definition.description}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-destructive">Spend {resourceName}</Label>
                      <div className="flex gap-1">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => applySpend(resource.id, 1)}
                          disabled={resource.current <= 0}
                        >
                          -1
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => applySpend(resource.id, 3)}
                          disabled={resource.current <= 0}
                        >
                          -3
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => applySpend(resource.id, 5)}
                          disabled={resource.current <= 0}
                        >
                          -5
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium text-${definition?.color || 'blue'}-600`}>Restore</Label>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => applyRestore(resource.id, 1)}
                          disabled={resource.current >= resource.maxValue}
                          className={`text-${definition?.color || 'blue'}-600 border-${definition?.color || 'blue'}-600 hover:bg-${definition?.color || 'blue'}-50`}
                        >
                          +1
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => applyRestore(resource.id, 3)}
                          disabled={resource.current >= resource.maxValue}
                          className={`text-${definition?.color || 'blue'}-600 border-${definition?.color || 'blue'}-600 hover:bg-${definition?.color || 'blue'}-50`}
                        >
                          +3
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => applyRestore(resource.id, 5)}
                          disabled={resource.current >= resource.maxValue}
                          className={`text-${definition?.color || 'blue'}-600 border-${definition?.color || 'blue'}-600 hover:bg-${definition?.color || 'blue'}-50`}
                        >
                          +5
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Custom Amount Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`spend-${resource.id}`} className="text-sm">Custom Spend</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`spend-${resource.id}`}
                          type="number"
                          min="1"
                          value={spendAmount}
                          onChange={(e) => setSpendAmounts(prev => ({ ...prev, [resource.id]: e.target.value }))}
                          className="flex-1"
                          placeholder="Amount"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleSpend(resource.id)}
                          disabled={resource.current <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`restore-${resource.id}`} className="text-sm">Custom Restore</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`restore-${resource.id}`}
                          type="number"
                          min="1"
                          value={restoreAmount}
                          onChange={(e) => setRestoreAmounts(prev => ({ ...prev, [resource.id]: e.target.value }))}
                          className="flex-1"
                          placeholder="Amount"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRestore(resource.id)}
                          disabled={resource.current >= resource.maxValue}
                          className={`text-${definition?.color || 'blue'}-600 border-${definition?.color || 'blue'}-600 hover:bg-${definition?.color || 'blue'}-50`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}