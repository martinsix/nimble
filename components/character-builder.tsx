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
  featureSelections: Record<string, FeatureSelectionType>,
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

// Character builder state - maintains all character data until final creation
interface CharacterBuilderState {
  // Basic info
  classId?: string;
  ancestryId?: string;
  backgroundId?: string;
  name: string;
  
  // Features
  featureSelections: Record<string, FeatureSelectionType>;
  
  // Attributes
  attributes: {
    strength: number;
    dexterity: number;
    intelligence: number;
    will: number;
  };
  
  // Skills
  skillAllocations: Record<string, number>;
  
  // Equipment
  selectedEquipment: string[];
  equipmentReady: boolean;
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
    featureSelections: {},
    attributes: {
      strength: 0,
      dexterity: 0,
      intelligence: 0,
      will: 0
    },
    skillAllocations: {},
    selectedEquipment: [],
    equipmentReady: false
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

  const handleEquipmentReady = (equipment: string[]) => {
    setBuilderState(prev => ({ 
      ...prev, 
      selectedEquipment: equipment,
      equipmentReady: true 
    }));
  };

  const handleFeatureSelectionsChange = (selections: Record<string, FeatureSelectionType>) => {
    setBuilderState(prev => ({ ...prev, featureSelections: selections }));
  };
  
  const handleAttributesChange = (attributes: typeof builderState.attributes) => {
    setBuilderState(prev => ({ ...prev, attributes }));
  };
  
  const handleSkillsChange = (skillAllocations: Record<string, number>) => {
    setBuilderState(prev => ({ ...prev, skillAllocations }));
  };

  const canProceedFromHeritage = (): boolean => {
    return !!(builderState.classId && 
              builderState.ancestryId && 
              builderState.backgroundId && 
              builderState.name.trim());
  };

  const createCharacterFromBuilder = async () => {
    if (!canProceedFromHeritage()) return;
    if (!builderState.classId || !builderState.ancestryId || !builderState.backgroundId) return;

    try {
      // Prepare selected features from feature selections
      const selectedFeatures = await applyFeatureSelections(
        builderState.featureSelections,
      );

      // Create the complete character at the end
      const character = await characterCreationService.createCompleteCharacter({
        name: builderState.name.trim(),
        classId: builderState.classId,
        ancestryId: builderState.ancestryId,
        backgroundId: builderState.backgroundId,
        attributes: builderState.attributes,
        skillAllocations: builderState.skillAllocations,
        selectedFeatures,
        selectedEquipment: builderState.selectedEquipment
      });
      
      // Load the character into the character service
      await characterService.loadCharacter(character.id);
      
      // Notify parent and close
      onCharacterCreated(character.id);
      onClose();
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const handleFinalizeCharacter = async () => {
    await createCharacterFromBuilder();
  };

  // Determine if we can proceed from current step
  const canProceedFromCurrentStep = (): boolean => {
    switch (STEPS[currentStep].id) {
      case 'class':
        return !!builderState.classId;
      case 'heritage':
        return canProceedFromHeritage();
      case 'features':
        return canProceedFromHeritage();
      case 'attributes':
        return true; // Can always proceed from attributes
      case 'skills':
        return true; // Skills are optional, can always proceed
      case 'equipment':
        return !!builderState.equipmentReady; // Equipment step is ready when items are selected
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
        setCurrentStep(3); // Go to attributes
        break;
      case 'attributes':
        setCurrentStep(4); // Go to skills
        break;
      case 'skills':
        setCurrentStep(5); // Go to equipment
        break;
      case 'equipment':
        await handleFinalizeCharacter();
        break;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
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
        return 'Next: Attributes';
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
        return 'Back to Features';
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
        return (
          <AttributeSelection 
            attributes={builderState.attributes}
            onAttributesChange={handleAttributesChange}
            classId={builderState.classId}
            ancestryId={builderState.ancestryId}
          />
        );
      case 'skills':
        return (
          <SkillsSelection 
            skillAllocations={builderState.skillAllocations}
            onSkillsChange={handleSkillsChange}
            attributes={builderState.attributes}
          />
        );
      case 'equipment':
        return (
          <EquipmentSelection 
            classId={builderState.classId!}
            selectedEquipment={builderState.selectedEquipment}
            onEquipmentReady={handleEquipmentReady} 
          />
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
    
    if (canProceedFromHeritage()) {
      completed.push(1); // Heritage step
    }
    
    if (canProceedFromHeritage()) {
      completed.push(2); // Features step (available after heritage)
      
      // Mark subsequent steps as available once features are done
      if (currentStep > 2) {
        completed.push(3); // Attributes step
        completed.push(4); // Skills step
      }
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