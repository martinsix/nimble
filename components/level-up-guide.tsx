'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { Character } from '@/lib/types/character';
import { useCharacterService } from '@/lib/hooks/use-character-service';
import { getCharacterService, getDiceService, getClassService, getContentRepository } from '@/lib/services/service-factory';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WizardDialog } from '@/components/wizard/wizard-dialog';

interface LevelUpGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LevelUpData {
  levelsToGain: number;
  hpRolls: Array<{
    level: number;
    roll1: number;
    roll2: number;
    result: number;
  }>;
  totalHpGain: number;
  newMaxHp: number;
  newHitDice: { current: number; max: number };
}

const STEPS = [
  { id: 'levels', label: 'Choose Levels' },
  { id: 'hp', label: 'Roll Hit Points' },
  // More steps to come: 'features', 'abilities', 'review'
];

export function LevelUpGuide({ open, onOpenChange }: LevelUpGuideProps) {
  const { character, updateCharacter } = useCharacterService();
  const [currentStep, setCurrentStep] = useState(0);
  const [levelUpData, setLevelUpData] = useState<LevelUpData>({
    levelsToGain: 1,
    hpRolls: [],
    totalHpGain: 0,
    newMaxHp: character?.hitPoints.max || 0,
    newHitDice: character ? { ...character.hitDice } : { current: 0, max: 0 }
  });

  // Service instances
  const diceService = getDiceService();
  const contentRepo = getContentRepository();
  
  // Early return if no character loaded (after all hooks)
  if (!character) return null;

  // Get class definition for hit die size
  const classDefinition = contentRepo.getClassDefinition(character.classId);
  const hitDieSize = classDefinition?.hitDieSize || 8;

  const handleNext = () => {
    if (currentStep === 0) {
      // Moving from level selection to HP rolling - roll the dice
      rollHitPoints();
      setCurrentStep(1);
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - apply changes
      applyLevelUp();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const rollHitPoints = () => {
    const rolls: Array<{
      level: number;
      roll1: number;
      roll2: number;
      result: number;
    }> = [];
    let totalGain = 0;

    for (let i = 0; i < levelUpData.levelsToGain; i++) {
      const currentLevel = character.level + i + 1;
      
      // Roll with advantage (roll twice, take the higher)
      const roll1 = diceService.rollSingleDie(hitDieSize as any);
      const roll2 = diceService.rollSingleDie(hitDieSize as any);
      const result = Math.max(roll1, roll2);
      
      rolls.push({
        level: currentLevel,
        roll1,
        roll2,
        result
      });
      
      totalGain += result;
    }

    setLevelUpData(prev => ({
      ...prev,
      hpRolls: rolls,
      totalHpGain: totalGain,
      newMaxHp: character.hitPoints.max + totalGain,
      newHitDice: {
        current: character.hitDice.current + levelUpData.levelsToGain,
        max: character.hitDice.max + levelUpData.levelsToGain
      }
    }));
  };

  const applyLevelUp = async () => {
    try {
      // Update character with new level and HP
      const updatedCharacter = {
        ...character,
        level: character.level + levelUpData.levelsToGain,
        hitPoints: {
          ...character.hitPoints,
          max: levelUpData.newMaxHp,
          current: levelUpData.newMaxHp // Set current HP to new max HP after level up
        },
        hitDice: {
          ...character.hitDice,
          current: levelUpData.newHitDice.current,
          max: levelUpData.newHitDice.max
        }
      };
      
      // Save the updated character
      await updateCharacter(updatedCharacter);
      
      // Sync class features for the new level
      const classService = getClassService();
      await classService.syncCharacterFeatures();
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to apply level up:', error);
    }
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'levels':
        return <LevelSelectionStep 
          character={character}
          levelsToGain={levelUpData.levelsToGain}
          onLevelsChange={(levels) => setLevelUpData(prev => ({ ...prev, levelsToGain: levels }))}
        />;
      
      case 'hp':
        return <HitPointsStep 
          character={character}
          levelUpData={levelUpData}
          hitDieSize={`d${hitDieSize}`}
          onHpChange={(newHp) => setLevelUpData(prev => ({ ...prev, newMaxHp: newHp }))}
        />;
      
      default:
        return null;
    }
  };

  return (
    <WizardDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Level Up Guide"
      titleIcon={<Sparkles className="h-5 w-5 text-yellow-500" />}
      steps={STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      canProceed={true}
      className="max-w-2xl"
    >
      <div className="px-4 sm:px-6 py-4">
        {renderStepContent()}
      </div>
    </WizardDialog>
  );
}

// Level Selection Step Component
function LevelSelectionStep({ 
  character, 
  levelsToGain, 
  onLevelsChange 
}: { 
  character: Character;
  levelsToGain: number;
  onLevelsChange: (levels: number) => void;
}) {
  const maxLevel = 20; // Standard D&D max level
  const availableLevels = maxLevel - character.level;

  const handleIncrement = () => {
    if (levelsToGain < availableLevels) {
      onLevelsChange(levelsToGain + 1);
    }
  };

  const handleDecrement = () => {
    if (levelsToGain > 1) {
      onLevelsChange(levelsToGain - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Level Up Your Character</h3>
        <p className="text-sm text-muted-foreground">
          {character.name} is currently level {character.level}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="levels">How many levels would you like to gain?</Label>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleDecrement}
                  disabled={levelsToGain <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="levels"
                  type="number"
                  min={1}
                  max={availableLevels}
                  value={levelsToGain}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    onLevelsChange(Math.min(Math.max(1, value), availableLevels));
                  }}
                  className="w-20 text-center text-lg font-semibold"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleIncrement}
                  disabled={levelsToGain >= availableLevels}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  (Max: {availableLevels})
                </span>
              </div>
            </div>

            {/* Level Progression Indicator */}
            <div className="flex items-center justify-center py-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">
                Level {character.level} → Level {character.level + levelsToGain}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">What you'll gain:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• {levelsToGain} additional hit {levelsToGain === 1 ? 'die' : 'dice'} to roll for HP</p>
                <p>• Increased maximum hit points</p>
                <p>• Possible new class features</p>
                <p>• Possible ability score improvements</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hit Points Step Component
function HitPointsStep({ 
  character, 
  levelUpData,
  hitDieSize,
  onHpChange 
}: { 
  character: Character;
  levelUpData: LevelUpData;
  hitDieSize: string;
  onHpChange: (hp: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Roll for Hit Points</h3>
        <p className="text-sm text-muted-foreground">
          Rolling {hitDieSize} with advantage for each level
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Current HP</Label>
              <div className="text-2xl font-bold">{character.hitPoints.max}</div>
            </div>
            <div>
              <Label htmlFor="new-hp">New HP</Label>
              <Input
                id="new-hp"
                type="number"
                value={levelUpData.newMaxHp}
                onChange={(e) => onHpChange(parseInt(e.target.value) || 0)}
                className="text-2xl font-bold h-auto py-1"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Hit Die Rolls (with advantage):</p>
            <div className="space-y-2">
              {levelUpData.hpRolls.map((roll, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Level {roll.level}:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Rolled: {roll.roll1} & {roll.roll2}
                    </span>
                    <Badge variant="default">
                      Result: {roll.result}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <span className="font-medium">Total HP Gain:</span>
              <Badge className="text-lg px-3 py-1">+{levelUpData.totalHpGain}</Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Hit Dice:</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Current: {character.hitDice.current}/{character.hitDice.max}</span>
              <span>→</span>
              <span className="text-foreground font-medium">
                New: {levelUpData.newHitDice.current}/{levelUpData.newHitDice.max}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}