"use client";

import { useState } from "react";
import { Character } from "@/lib/types/character";
import { ClassFeature, PickFeatureFromPoolFeature } from "@/lib/types/class";
import { useCharacterService } from "@/lib/hooks/use-character-service";
import { getClassService } from "@/lib/services/service-factory";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface FeaturePoolSelectionDialogProps {
  pickFeature: PickFeatureFromPoolFeature;
  onClose: () => void;
}

export function FeaturePoolSelectionDialog({ pickFeature, onClose }: FeaturePoolSelectionDialogProps) {
  const { character } = useCharacterService();
  const [selectedFeature, setSelectedFeature] = useState<ClassFeature | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  if (!character) {
    return null;
  }

  const classService = getClassService();
  const pool = classService.getFeaturePool(character.classId, pickFeature.poolId);
  const availableFeatures = classService.getAvailablePoolFeatures(character, pickFeature.poolId);
  const remaining = classService.getRemainingPoolSelections(character, pickFeature);

  if (!pool) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pool Not Found</DialogTitle>
            <DialogDescription>
              The feature pool &ldquo;{pickFeature.poolId}&rdquo; could not be found.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSelectFeature = async () => {
    if (!selectedFeature) return;

    setIsSelecting(true);
    try {
      const grantedByFeatureId = classService.generateFeatureId(character.classId, pickFeature.level, pickFeature.name);
      await classService.selectPoolFeature(character, pickFeature.poolId, selectedFeature, grantedByFeatureId);
      onClose();
    } catch (error) {
      console.error('Failed to select pool feature:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  const getFeatureTypeDisplay = (feature: ClassFeature) => {
    switch (feature.type) {
      case 'ability':
        return 'Ability';
      case 'passive_feature':
        return 'Passive Feature';
      case 'stat_boost':
        return 'Stat Boost';
      case 'proficiency':
        return 'Proficiency';
      case 'spell_school':
        return 'Spell School';
      case 'spell_tier_access':
        return 'Spell Tier Access';
      case 'resource':
        return 'Resource';
      default:
        return 'Feature';
    }
  };

  const getFeatureBadgeColor = (feature: ClassFeature) => {
    switch (feature.type) {
      case 'ability':
        return 'bg-red-100 text-red-800';
      case 'passive_feature':
        return 'bg-blue-100 text-blue-800';
      case 'stat_boost':
        return 'bg-green-100 text-green-800';
      case 'proficiency':
        return 'bg-yellow-100 text-yellow-800';
      case 'spell_school':
        return 'bg-purple-100 text-purple-800';
      case 'spell_tier_access':
        return 'bg-indigo-100 text-indigo-800';
      case 'resource':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select from {pool.name}</DialogTitle>
          <DialogDescription>
            {pool.description}
            <br />
            <span className="font-medium">
              Remaining selections: {remaining}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 pr-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {availableFeatures.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No features available for selection
              </div>
            ) : (
              availableFeatures.map((feature: ClassFeature, index: number) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-colors ${
                    selectedFeature === feature 
                      ? 'ring-2 ring-primary bg-accent' 
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <Badge className={getFeatureBadgeColor(feature)}>
                        {getFeatureTypeDisplay(feature)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    
                    {feature.type === 'ability' && feature.ability && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div>Type: {feature.ability.type}</div>
                        {feature.ability.type === 'action' && feature.ability.frequency && (
                          <div>Frequency: {feature.ability.frequency.replace('_', ' ')}</div>
                        )}
                      </div>
                    )}
                    
                    {feature.type === 'stat_boost' && feature.statBoosts && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Boosts: {feature.statBoosts.map((boost: any) => 
                          `${boost.attribute} ${boost.amount > 0 ? '+' : ''}${boost.amount}`
                        ).join(', ')}
                      </div>
                    )}
                    
                    {feature.type === 'proficiency' && feature.proficiencies && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Proficiencies: {feature.proficiencies.map((prof: any) => prof.name).join(', ')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelectFeature}
            disabled={!selectedFeature || isSelecting || remaining <= 0}
          >
            {isSelecting ? 'Selecting...' : 'Select Feature'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}