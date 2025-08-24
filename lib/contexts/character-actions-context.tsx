"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Character, AttributeName, SkillName, ActionTracker, CharacterConfiguration } from '../types/character';
import { Abilities } from '../types/abilities';

export interface CharacterActionsContextValue {
  // Character state
  character: Character | null;
  
  // Character management
  onCharacterUpdate: (character: Character) => void;
  onUpdateCharacterConfiguration: (config: CharacterConfiguration) => void;
  
  // Health management actions
  onApplyDamage: (amount: number, targetType?: 'hp' | 'temp_hp') => void;
  onApplyHealing: (amount: number) => void;
  onApplyTemporaryHP: (amount: number) => void;
  
  // Dice rolling actions
  onRollAttribute: (attributeName: AttributeName, value: number, advantageLevel: number) => void;
  onRollSave: (attributeName: AttributeName, value: number, advantageLevel: number) => void;
  onRollSkill: (skillName: SkillName, attributeValue: number, skillModifier: number, advantageLevel: number) => void;
  onRollInitiative: (totalModifier: number, advantageLevel: number) => void;
  onAttack: (weaponName: string, damage: string, attributeModifier: number, advantageLevel: number) => void;
  
  // Combat actions
  onUpdateActions: (actionTracker: ActionTracker) => void;
  onEndEncounter: () => void;
  onUpdateAbilities: (abilities: Abilities) => void;
  onEndTurn: (actionTracker: ActionTracker, abilities: Abilities) => void;
  onUseAbility: (abilityId: string) => void;
  
  // Rest actions
  onCatchBreath: () => void;
  onMakeCamp: () => void;
  onSafeRest: () => void;
}

const CharacterActionsContext = createContext<CharacterActionsContextValue | undefined>(undefined);

export interface CharacterActionsProviderProps {
  children: ReactNode;
  value: CharacterActionsContextValue;
}

export function CharacterActionsProvider({ children, value }: CharacterActionsProviderProps) {
  return (
    <CharacterActionsContext.Provider value={value}>
      {children}
    </CharacterActionsContext.Provider>
  );
}

export function useCharacterActions(): CharacterActionsContextValue {
  const context = useContext(CharacterActionsContext);
  if (context === undefined) {
    throw new Error('useCharacterActions must be used within a CharacterActionsProvider');
  }
  return context;
}