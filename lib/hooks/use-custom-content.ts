import { useLocalStorage } from "./use-local-storage";
import { ClassDefinition, SubclassDefinition } from "@/lib/types/class";
import { AncestryDefinition } from "@/lib/types/ancestry";
import { BackgroundDefinition } from "@/lib/types/background";
import { ActionAbility, SpellAbility } from "@/lib/types/abilities";

interface CustomContent {
  classes: ClassDefinition[];
  subclasses: SubclassDefinition[];
  ancestries: AncestryDefinition[];
  backgrounds: BackgroundDefinition[];
  actionAbilities: ActionAbility[];
  spellAbilities: SpellAbility[];
  spellSchools: any[]; // TODO: Define proper type
}

const CUSTOM_CONTENT_STORAGE_KEY = "nimble-navigator-custom-content";

const DEFAULT_CUSTOM_CONTENT: CustomContent = {
  classes: [],
  subclasses: [],
  ancestries: [],
  backgrounds: [],
  actionAbilities: [],
  spellAbilities: [],
  spellSchools: [],
};

/**
 * Custom hook for managing custom content with localStorage persistence
 */
export function useCustomContent() {
  const [customContent, setCustomContent] = useLocalStorage<CustomContent>(
    CUSTOM_CONTENT_STORAGE_KEY,
    DEFAULT_CUSTOM_CONTENT
  );

  const addCustomClass = (cls: ClassDefinition) => {
    setCustomContent((prev) => ({
      ...prev,
      classes: [...prev.classes, cls],
    }));
  };

  const addCustomSubclass = (subclass: SubclassDefinition) => {
    setCustomContent((prev) => ({
      ...prev,
      subclasses: [...prev.subclasses, subclass],
    }));
  };

  const addCustomAncestry = (ancestry: AncestryDefinition) => {
    setCustomContent((prev) => ({
      ...prev,
      ancestries: [...prev.ancestries, ancestry],
    }));
  };

  const addCustomBackground = (background: BackgroundDefinition) => {
    setCustomContent((prev) => ({
      ...prev,
      backgrounds: [...prev.backgrounds, background],
    }));
  };

  const addCustomActionAbility = (ability: ActionAbility) => {
    setCustomContent((prev) => ({
      ...prev,
      actionAbilities: [...prev.actionAbilities, ability],
    }));
  };

  const addCustomSpellAbility = (spell: SpellAbility) => {
    setCustomContent((prev) => ({
      ...prev,
      spellAbilities: [...prev.spellAbilities, spell],
    }));
  };

  const addCustomSpellSchool = (school: any) => {
    setCustomContent((prev) => ({
      ...prev,
      spellSchools: [...prev.spellSchools, school],
    }));
  };

  const getCustomClasses = () => {
    return customContent.classes;
  };

  const getCustomSubclasses = () => {
    return customContent.subclasses;
  };

  const getCustomAncestries = () => {
    return customContent.ancestries;
  };

  const getCustomBackgrounds = () => {
    return customContent.backgrounds;
  };

  const getCustomActionAbilities = () => {
    return customContent.actionAbilities;
  };

  const getCustomSpellAbilities = () => {
    return customContent.spellAbilities;
  };

  const getCustomSpellSchools = () => {
    return customContent.spellSchools;
  };

  const clearCustomContent = () => {
    setCustomContent(DEFAULT_CUSTOM_CONTENT);
  };

  return {
    customContent,
    addCustomClass,
    addCustomSubclass,
    addCustomAncestry,
    addCustomBackground,
    addCustomActionAbility,
    addCustomSpellAbility,
    addCustomSpellSchool,
    getCustomClasses,
    getCustomSubclasses,
    getCustomAncestries,
    getCustomBackgrounds,
    getCustomActionAbilities,
    getCustomSpellAbilities,
    getCustomSpellSchools,
    clearCustomContent,
  };
}
