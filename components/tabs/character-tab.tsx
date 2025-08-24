"use client";

import { AbilitySection } from "../sections/ability-section";
import { ResourceSection } from "../sections/resource-section";
import { ClassFeaturesSection } from "../sections/class-features-section";

export function CharacterTab() {
  return (
    <div className="space-y-6">
      <ResourceSection />
      <AbilitySection />
      <ClassFeaturesSection />
    </div>
  );
}