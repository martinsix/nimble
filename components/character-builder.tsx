"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Centralized navigation logic
  const canProceedFromCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'class':
        return !!builderState.classId;
      case 'ancestry-background':
        return canProceedFromStep2();
      case 'attributes':
        return !!builderState.characterId;
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    switch (currentStep) {
      case 'class':
        setCurrentStep('ancestry-background');
        break;
      case 'ancestry-background':
        await proceedToAttributes();
        break;
      case 'attributes':
        handleCreateCharacter();
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'ancestry-background':
        setCurrentStep('class');
        break;
      case 'attributes':
        setCurrentStep('ancestry-background');
        break;
      // Class step has no previous step
    }
  };

  const getNextButtonText = (): string => {
    switch (currentStep) {
      case 'class':
        return 'Next: Heritage';
      case 'ancestry-background':
        return 'Create Character';
      case 'attributes':
        return 'Finish Character';
      default:
        return 'Next';
    }
  };

  const getPreviousButtonText = (): string => {
    switch (currentStep) {
      case 'ancestry-background':
        return 'Back to Class';
      case 'attributes':
        return 'Back to Heritage';
      default:
        return 'Previous';
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
          />
        );
      case 'attributes':
        if (!builderState.characterId) return null;
        return (
          <AttributeSelection />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 flex flex-col">
        <div className="sticky top-0 bg-background border-b px-4 sm:px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-lg sm:text-xl font-bold">Character Builder</DialogTitle>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-4 overflow-x-hidden pb-20">
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
        </div>

        {/* Always Visible Bottom Navigation */}
        <div className="sticky bg-background border-t px-4 sm:px-6 py-4">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={currentStep === 'class'}
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {getPreviousButtonText()}
            </Button>
            <Button 
              onClick={handleNextStep}
              disabled={!canProceedFromCurrentStep()}
              size="sm"
            >
              {getNextButtonText()}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}