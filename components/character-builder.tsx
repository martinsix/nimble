"use client";

import { useState } from "react";
import { WizardDialog } from "./wizard/wizard-dialog";
import { ContentRepositoryService } from "@/lib/services/content-repository-service";
import { getCharacterCreation, getCharacterService } from "@/lib/services/service-factory";
import { ClassSelection } from "./character-builder/class-selection";
import { HeritageSelection } from "./character-builder/heritage-selection";
import { AttributeSelection } from "./character-builder/attribute-selection";
import { SkillsSelection } from "./character-builder/skills-selection";
import { EquipmentSelection } from "./character-builder/equipment-selection";
import { FeaturesOverview, FeatureSelectionType } from "./character-builder/features-overview";
import { Wand2 } from "lucide-react";
import { SelectedFeature, Character } from "@/lib/types/character";

// Helper function to apply feature selections to a character
async function applyFeatureSelections(
  character: Character,
  featureSelections: Record<string, FeatureSelectionType>,
  classId: string,
  ancestryId: string,
  backgroundId: string
): Promise<SelectedFeature[]> {
  const selectedFeatures: SelectedFeature[] = [];
  const now = new Date();

  // Process each selection
  for (const [featureId, selection] of Object.entries(featureSelections)) {
    switch (selection.type) {
      case 'stat_boost':
        selectedFeatures.push({
          type: 'stat_boost',
          attribute: selection.attribute,
          amount: 1, // Default amount, could be extracted from feature definition
          selectedAt: now,
          grantedByFeatureId: featureId
        });
        break;

      case 'spell_school_choice':
        selectedFeatures.push({
          type: 'spell_school',
          schoolId: selection.schoolId,
          selectedAt: now,
          grantedByFeatureId: featureId
        });
        break;

      case 'utility_spells':
        if (selection.spellIds.length > 0) {
          selectedFeatures.push({
            type: 'utility_spells',
            spellIds: selection.spellIds,
            fromSchools: [], // Would need to determine from feature definition
            selectedAt: now,
            grantedByFeatureId: featureId
          });
        }
        break;

      case 'feature_pool':
        // Need to get the actual feature from the pool
        // This would require looking up the feature definition
        selectedFeatures.push({
          type: 'pool_feature',
          poolId: '', // Would need to extract from feature definition
          featureId: selection.selectedFeatureId,
          feature: {} as any, // Would need to get actual feature
          selectedAt: now,
          grantedByFeatureId: featureId
        });
        break;
    }
  }

  return selectedFeatures;
}

// Character builder state
interface CharacterBuilderState {
  classId?: string;
  ancestryId?: string;
  backgroundId?: string;
  name: string;
  featureSelections: Record<string, FeatureSelectionType>; // Feature selections before character creation
  characterId?: string; // Set after character creation
  equipmentReady?: boolean; // Whether equipment step is ready
}

// Builder steps
const STEPS = [
  { id: 'class', label: 'Class' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'features', label: 'Features' },
  { id: 'attributes', label: 'Attributes' },
  { id: 'skills', label: 'Skills' },
  { id: 'equipment', label: 'Equipment' }
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [builderState, setBuilderState] = useState<CharacterBuilderState>({
    name: '',
    featureSelections: {}
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

  const handleEquipmentReady = () => {
    setBuilderState(prev => ({ ...prev, equipmentReady: true }));
  };

  const handleFeatureSelectionsChange = (selections: Record<string, FeatureSelectionType>) => {
    setBuilderState(prev => ({ ...prev, featureSelections: selections }));
  };

  const canProceedFromHeritage = (): boolean => {
    return !!(builderState.classId && 
              builderState.ancestryId && 
              builderState.backgroundId && 
              builderState.name.trim());
  };

  const createCharacterWithFeatures = async () => {
    if (!canProceedFromHeritage()) return;

    try {
      // Create character with basic info
      const character = await characterCreationService.createCharacterWithClass({
        name: builderState.name.trim(),
        classId: builderState.classId!,
        ancestryId: builderState.ancestryId!,
        backgroundId: builderState.backgroundId!
      });

      // Apply feature selections to the character
      if (Object.keys(builderState.featureSelections).length > 0) {
        const selectedFeatures = await applyFeatureSelections(
          character,
          builderState.featureSelections,
          builderState.classId!,
          builderState.ancestryId!,
          builderState.backgroundId!
        );
        
        // Update character with selected features
        const updatedCharacter = {
          ...character,
          selectedFeatures: [...(character.selectedFeatures || []), ...selectedFeatures]
        };
        await characterService.updateCharacter(updatedCharacter);
      }
      
      setBuilderState(prev => ({ ...prev, characterId: character.id }));
      
      // Load the character into the character service
      await characterService.loadCharacter(character.id);
      
      setCurrentStep(3); // Move to attributes step
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

  // Determine if we can proceed from current step
  const canProceedFromCurrentStep = (): boolean => {
    switch (STEPS[currentStep].id) {
      case 'class':
        return !!builderState.classId;
      case 'heritage':
        return canProceedFromHeritage();
      case 'features':
        return canProceedFromHeritage(); // Can proceed once selections are made (or if none required)
      case 'attributes':
        return !!builderState.characterId;
      case 'skills':
        return !!builderState.characterId; // Skills are optional, can always proceed
      case 'equipment':
        return !!builderState.equipmentReady; // Equipment step is ready when items are loaded
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const currentStepId = STEPS[currentStep].id;
    
    switch (currentStepId) {
      case 'class':
        setCurrentStep(1); // Go to heritage
        break;
      case 'heritage':
        setCurrentStep(2); // Go to features
        break;
      case 'features':
        await createCharacterWithFeatures(); // This creates the character and moves to attributes
        break;
      case 'attributes':
        setCurrentStep(4); // Go to skills
        break;
      case 'skills':
        setCurrentStep(5); // Go to equipment
        break;
      case 'equipment':
        handleCreateCharacter();
        break;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Don't allow going back from attributes to features after character is created
      if (currentStep === 3 && builderState.characterId) {
        // Character already created, can't go back to features
        return;
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const getNextButtonText = (): string => {
    switch (STEPS[currentStep].id) {
      case 'class':
        return 'Next: Heritage';
      case 'heritage':
        return 'Next: Features';
      case 'features':
        return 'Create Character';
      case 'attributes':
        return 'Next: Skills';
      case 'skills':
        return 'Next: Equipment';
      case 'equipment':
        return 'Finish Character';
      default:
        return 'Next';
    }
  };

  const getPreviousButtonText = (): string => {
    switch (STEPS[currentStep].id) {
      case 'heritage':
        return 'Back to Class';
      case 'features':
        return 'Back to Heritage';
      case 'attributes':
        return builderState.characterId ? 'Previous' : 'Back to Features';
      case 'skills':
        return 'Back to Attributes';
      case 'equipment':
        return 'Back to Skills';
      default:
        return 'Previous';
    }
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'class':
        return (
          <ClassSelection
            availableClasses={availableClasses}
            selectedClassId={builderState.classId}
            onClassSelect={handleClassSelect}
          />
        );
      case 'heritage':
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
      case 'features':
        if (!builderState.classId || !builderState.ancestryId || !builderState.backgroundId) return null;
        return (
          <FeaturesOverview
            classId={builderState.classId}
            ancestryId={builderState.ancestryId}
            backgroundId={builderState.backgroundId}
            featureSelections={builderState.featureSelections}
            onFeatureSelectionsChange={handleFeatureSelectionsChange}
          />
        );
      case 'attributes':
        if (!builderState.characterId) return null;
        return (
          <AttributeSelection />
        );
      case 'skills':
        if (!builderState.characterId) return null;
        return (
          <SkillsSelection />
        );
      case 'equipment':
        if (!builderState.characterId) return null;
        return (
          <EquipmentSelection onEquipmentReady={handleEquipmentReady} />
        );
      default:
        return null;
    }
  };

  // Determine which steps are completed for visual indication
  const getCompletedSteps = (): number[] => {
    const completed: number[] = [];
    
    if (builderState.classId) {
      completed.push(0); // Class step
    }
    
    if (canProceedFromHeritage() || builderState.characterId) {
      completed.push(1); // Heritage step
    }
    
    if (canProceedFromHeritage()) {
      completed.push(2); // Features step (available after heritage)
    }
    
    if (builderState.characterId) {
      completed.push(3); // Attributes step (auto-completed when character created)
      completed.push(4); // Skills step (optional, so marked complete when available)
    }
    
    if (builderState.equipmentReady) {
      completed.push(4); // Equipment step
    }
    
    return completed;
  };

  return (
    <WizardDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Character Builder"
      titleIcon={<Wand2 className="h-5 w-5 text-primary" />}
      steps={STEPS}
      currentStep={currentStep}
      onStepChange={(step) => {
        // Only allow direct step navigation if the step is accessible
        if (step < currentStep || (step === 0 || (step === 1 && builderState.classId))) {
          setCurrentStep(step);
        }
      }}
      onNext={handleNext}
      onPrevious={handlePrevious}
      canProceed={canProceedFromCurrentStep()}
      nextButtonText={getNextButtonText()}
      previousButtonText={getPreviousButtonText()}
      className="max-w-4xl w-[95vw]"
      completedSteps={getCompletedSteps()}
    >
      <div className="min-w-0 px-4 sm:px-6 py-4">
        {renderStepContent()}
      </div>
    </WizardDialog>
  );
}