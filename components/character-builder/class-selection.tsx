"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ClassDefinition } from "@/lib/types/class";

interface ClassSelectionProps {
  availableClasses: ClassDefinition[];
  selectedClassId?: string;
  onClassSelect: (classId: string) => void;
}

export function ClassSelection({ availableClasses, selectedClassId, onClassSelect }: ClassSelectionProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Class</h2>
        <p className="text-muted-foreground">Select the class that defines your character&apos;s role and abilities</p>
      </div>
      
      <div className="space-y-3">
        {availableClasses.map((cls: ClassDefinition) => (
          <Card 
            key={cls.id}
            className={`cursor-pointer transition-all ${
              selectedClassId === cls.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
          >
            <Collapsible 
              open={expandedCards.has(cls.id)}
              onOpenChange={(open) => toggleCardExpansion(cls.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cls.description}
                      </p>
                    </div>
                    {selectedClassId === cls.id && (
                      <Badge className="ml-2">Selected</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedClassId === cls.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onClassSelect(cls.id)}
                    >
                      {selectedClassId === cls.id ? 'Selected' : 'Select'}
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        {expandedCards.has(cls.id) ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2">Key Attributes</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cls.keyAttributes.map(attr => (
                        <Badge key={attr} variant="secondary" className="capitalize">
                          {attr}
                        </Badge>
                      ))}
                    </div>
                    <h4 className="font-medium mb-2">Starting Proficiencies</h4>
                    <p className="text-sm text-muted-foreground">
                      Armor: {cls.armorProficiencies?.map(p => p.type === 'freeform' ? p.name : p.type).join(', ') || 'None'} • 
                      Weapons: {cls.weaponProficiencies?.map(p => p.type === 'freeform' ? p.name : p.type.replace('_', ' ')).join(', ') || 'None'}
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}