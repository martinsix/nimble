import { Character, AttributeName, SkillName } from "@/lib/types/character";
import { AttributesSection } from "../sections/attributes-section";
import { SkillsSection } from "../sections/skills-section";

export function CharacterStats() {
  return (
    <>
      {/* Attributes Section - Now completely self-contained */}
      <AttributesSection />

      {/* Skills Section - Now completely self-contained */}
      <SkillsSection />
    </>
  );
}