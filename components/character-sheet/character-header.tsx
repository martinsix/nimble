import { Character } from "@/lib/types/character";
import { CharacterNameSection } from "../sections/character-name-section";
import { ClassFeaturesSection } from "../sections/class-features-section";
import { useCharacterActions } from "@/lib/contexts/character-actions-context";

interface CharacterHeaderProps {
  onNameChange: (name: string) => void;
  onOpenConfig: () => void;
}

export function CharacterHeader({
  onNameChange,
  onOpenConfig,
}: CharacterHeaderProps) {
  // Get character from context
  const { character } = useCharacterActions();
  
  // Early return if no character (shouldn't happen in normal usage)
  if (!character) return null;
  return (
    <>
      {/* Character Name and Summary */}
      <CharacterNameSection 
        name={character.name}
        onNameChange={onNameChange}
        onOpenConfig={onOpenConfig}
      />

      {/* Class Features Section - Now completely self-contained */}
      <ClassFeaturesSection />
    </>
  );
}