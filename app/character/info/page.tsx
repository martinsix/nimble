"use client";

import { AttributesSection } from "@/components/sections/attributes-section";
import { HitDiceSection } from "@/components/sections/hit-dice-section";
import { AbilitySection } from "@/components/sections/ability-section";
import { ResourceSection } from "@/components/sections/resource-section";
import { ClassFeaturesSection } from "@/components/sections/class-features-section";
import { PoolSelectionsSection } from "@/components/sections/pool-selections-section";

export default function InfoPage() {
  return (
    <>
      <PoolSelectionsSection />
      <AttributesSection />
      <HitDiceSection />
      <ResourceSection />
      <AbilitySection />
      <ClassFeaturesSection />
    </>
  );
}
