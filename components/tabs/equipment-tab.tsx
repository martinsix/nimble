"use client";

import { ArmorSection } from "../sections/armor-section";
import { InventorySection } from "../sections/inventory-section";

export function EquipmentTab() {
  return (
    <div className="space-y-6">
      <ArmorSection />
      <InventorySection />
    </div>
  );
}