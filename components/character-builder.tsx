"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";
import { ContentRepositoryService } from "@/lib/services/content-repository-service";
import { getCharacterCreation } from "@/lib/services/service-factory";
import { StepIndicator } from "./character-builder/step-indicator";
import { ClassSelection } from "./character-builder/class-selection";
import { HeritageSelection } from "./character-builder/heritage-selection";

// Character builder state for first 2 steps
interface CharacterBuilderState {
  classId?: string;
  ancestryId?: string;
  backgroundId?: string;
  name: string;
}

// Builder steps
type BuilderStep = 'class' | 'ancestry-background' | 'attributes' | 'final';

interface CharacterBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterCreated: (characterId: string) => void;
  editingCharacterId?: string; // For future editing support
}

// Name suggestions by ancestry
const ANCESTRY_NAMES = {
  human: ['Aiden', 'Lyra', 'Marcus', 'Elena', 'Garrett', 'Sera', 'Tobias', 'Aria'],
  elf: ['Aelindra', 'Thalion', 'Silviana', 'Valdris', 'Caelynn', 'Erevan', 'Lyralei', 'Fenris'],
  dwarf: ['Thorin', 'Dara', 'Balin', 'Vera', 'Durin', 'Nala', 'Gimli', 'Brina'],
  halfling: ['Pippin', 'Rosie', 'Milo', 'Daisy', 'Frodo', 'Pearl', 'Samwise', 'Ruby']
};

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

  const suggestName = () => {
    if (builderState.ancestryId && ANCESTRY_NAMES[builderState.ancestryId as keyof typeof ANCESTRY_NAMES]) {
      const names = ANCESTRY_NAMES[builderState.ancestryId as keyof typeof ANCESTRY_NAMES];
      const randomName = names[Math.floor(Math.random() * names.length)];
      handleNameChange(randomName);
    }
  };

  const canProceedFromStep2 = (): boolean => {
    return !!(builderState.classId && 
              builderState.ancestryId && 
              builderState.backgroundId && 
              builderState.name.trim());
  };

  const handleCreateCharacter = async () => {
    if (!canProceedFromStep2()) return;

    try {
      const character = await characterCreationService.createCharacterWithClass({
        name: builderState.name.trim(),
        classId: builderState.classId!,
        ancestryId: builderState.ancestryId!,
        backgroundId: builderState.backgroundId!
      });

      onCharacterCreated(character.id);
      onClose();
    } catch (error) {
      console.error('Failed to create character:', error);
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
            onSuggestName={suggestName}
            onBack={() => setCurrentStep('class')}
            onNext={handleCreateCharacter}
            canProceed={canProceedFromStep2()}
          />
        );
      case 'attributes':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Attribute Selection</h2>
            <p className="text-muted-foreground mb-6">Coming soon! For now, characters start with default attributes.</p>
            <Button onClick={() => setCurrentStep('ancestry-background')}>
              Back
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">Character Builder</DialogTitle>
        </div>
        
        <div className="px-6 py-4">
          <StepIndicator
            currentStep={currentStep}
            classSelected={!!builderState.classId}
            heritageComplete={canProceedFromStep2()}
          />
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}