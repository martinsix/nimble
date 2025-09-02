'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useCharacterService } from '@/lib/hooks/use-character-service';
import { getCharacterService, getDiceService, getClassService, getContentRepository } from '@/lib/services/service-factory';
import { WizardDialog } from '@/components/wizard/wizard-dialog';
import { LevelSelectionStep, HitPointsStep, SkillsStep } from './level-up-guide/steps';

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
  skillAllocations: Record<string, number>;
}

const STEPS = [
  { id: 'levels', label: 'Choose Levels' },
  { id: 'hp', label: 'Roll Hit Points' },
  { id: 'skills', label: 'Allocate Skills' },
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
    newHitDice: character ? { ...character.hitDice } : { current: 0, max: 0 },
    skillAllocations: {}
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
    } else if (currentStep === 1) {
      // Moving from HP to Skills
      setCurrentStep(2);
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
      // Apply skill allocations
      const updatedSkills = { ...character.skills };
      Object.entries(levelUpData.skillAllocations).forEach(([skillName, points]) => {
        const skill = updatedSkills[skillName as keyof typeof updatedSkills];
        if (points > 0 && skill) {
          updatedSkills[skillName as keyof typeof updatedSkills] = {
            ...skill,
            modifier: (skill.modifier || 0) + points
          };
        }
      });
      
      // Update character with new level, HP, and skills
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
        },
        skills: updatedSkills
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
      
      case 'skills':
        return <SkillsStep 
          character={character}
          levelsToGain={levelUpData.levelsToGain}
          skillAllocations={levelUpData.skillAllocations}
          onSkillAllocationsChange={(allocations) => setLevelUpData(prev => ({ ...prev, skillAllocations: allocations }))}
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