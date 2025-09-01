"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";
import { ContentRepositoryService } from "@/lib/services/content-repository-service";
import { getCharacterCreation, getCharacterService } from "@/lib/services/service-factory";
import { StepIndicator } from "./character-builder/step-indicator";
import { ClassSelection } from "./character-builder/class-selection";
import { HeritageSelection } from "./character-builder/heritage-selection";
import { AttributeSelection } from "./character-builder/attribute-selection";
import { Attributes, AttributeName } from "@/lib/types/character";

// Character builder state
interface CharacterBuilderState {
  classId?: string;
  ancestryId?: string;
  backgroundId?: string;
  name: string;
  characterId?: string; // Set after character creation in step 2
}

// Builder steps
type BuilderStep = 'class' | 'ancestry-background' | 'attributes' | 'final';

interface CharacterBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterCreated: (characterId: string) => void;
  editingCharacterId?: string; // For future editing support
}


export function CharacterBuilder({ 
  isOpen, 
  onClose, 
  onCharacterCreated,
  editingCharacterId 
}: CharacterBuilderProps) {
  const [currentStep, setCurrentStep] = useState<BuilderStep>('class');
  const [builderState, setBuilderState] = useState<CharacterBuilderState>({
    name: ''
  });

  const contentRepository = ContentRepositoryService.getInstance();
  const characterCreationService = getCharacterCreation();
  const characterService = getCharacterService();

  const availableClasses = contentRepository.getAllClasses();
  const availableAncestries = contentRepository.getAllAncestries();
  const availableBackgrounds = contentRepository.getAllBackgrounds();

  const handleClassSelect = (classId: string) => {
    setBuilderState(prev => ({ ...prev, classId }));
    setCurrentStep('ancestry-background');
  };

  const handleAncestrySelect = (ancestryId: string) => {
    setBuilderState(prev => ({ ...prev, ancestryId }));
  };

  const handleBackgroundSelect = (backgroundId: string) => {
    setBuilderState(prev => ({ ...prev, backgroundId }));
  };

  const handleNameChange = (name: string) => {
    setBuilderState(prev => ({ ...prev, name }));
  };


  const canProceedFromStep2 = (): boolean => {
    return !!(builderState.classId && 
              builderState.ancestryId && 
              builderState.backgroundId && 
              builderState.name.trim());
  };

  const proceedToAttributes = async () => {
    if (!canProceedFromStep2()) return;

    try {
      // Create character with basic info
      const character = await characterCreationService.createCharacterWithClass({
        name: builderState.name.trim(),
        classId: builderState.classId!,
        ancestryId: builderState.ancestryId!,
        backgroundId: builderState.backgroundId!
      });

      setBuilderState(prev => ({ ...prev, characterId: character.id }));
      
      // Load the character into the character service
      await characterService.loadCharacter(character.id);
      
      setCurrentStep('attributes');
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const handleCreateCharacter = () => {
    if (builderState.characterId) {
      onCharacterCreated(builderState.characterId);
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'class':
        return (
          <ClassSelection
            availableClasses={availableClasses}
            selectedClassId={builderState.classId}
            onClassSelect={handleClassSelect}
          />
        );
      case 'ancestry-background':
        return (
          <HeritageSelection
            availableAncestries={availableAncestries}
            availableBackgrounds={availableBackgrounds}
            selectedAncestryId={builderState.ancestryId}
            selectedBackgroundId={builderState.backgroundId}
            characterName={builderState.name}
            onAncestrySelect={handleAncestrySelect}
            onBackgroundSelect={handleBackgroundSelect}
            onNameChange={handleNameChange}
            onBack={() => setCurrentStep('class')}
            onNext={proceedToAttributes}
            canProceed={canProceedFromStep2()}
          />
        );
      case 'attributes':
        if (!builderState.characterId) return null;
        return (
          <AttributeSelection
            characterId={builderState.characterId}
            onBack={() => setCurrentStep('ancestry-background')}
            onNext={handleCreateCharacter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-background border-b px-4 sm:px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-lg sm:text-xl font-bold">Character Builder</DialogTitle>
        </div>
        
        <div className="px-4 sm:px-6 py-4 overflow-x-hidden">
          <StepIndicator
            currentStep={currentStep}
            classSelected={!!builderState.classId}
            heritageComplete={canProceedFromStep2()}
            attributesComplete={!!builderState.characterId}
          />
          <div className="min-w-0">
            {renderStepContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}