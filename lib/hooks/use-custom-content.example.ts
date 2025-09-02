// Example usage of the useCustomContent hook

import { useCustomContent } from "./use-custom-content";
import { ClassDefinition } from "@/lib/types/class";

// Example of how to use the hook in a service-like pattern
export class CustomContentService {
  private hook: ReturnType<typeof useCustomContent>;

  constructor() {
    // Note: This is just for demonstration. In practice, you would use the hook directly in components.
    // This approach won't work in practice because hooks can only be called from React components.
    this.hook = null as any; // This is just for type safety in the example
  }

  getCustomClasses() {
    // In a real component, you would call:
    // const { getCustomClasses } = useCustomContent();
    // return getCustomClasses();
    return [];
  }

  addCustomClass(cls: ClassDefinition) {
    // In a real component, you would call:
    // const { addCustomClass } = useCustomContent();
    // addCustomClass(cls);
  }
}

// Example usage in a React component:
/*
import { useCustomContent } from '@/lib/hooks/use-custom-content';

export function CustomContentManager() {
  const {
    customContent,
    addCustomClass,
    getCustomClasses,
    clearCustomContent
  } = useCustomContent();

  const handleAddClass = () => {
    const newClass: ClassDefinition = {
      id: `custom-class-${Date.now()}`,
      name: 'My Custom Class',
      description: 'A custom class created by the user',
      hitDice: 8,
      primaryAbility: 'strength',
      savingThrows: ['strength', 'constitution'],
      skillChoices: {
        count: 2,
        options: ['acrobatics', 'athletics', 'intimidation', 'perception', 'survival']
      },
      features: [],
      spellTierAccess: 0,
      resourceChoices: []
    };
    
    addCustomClass(newClass);
  };

  return (
    <div>
      <h2>Custom Content Manager</h2>
      <p>Custom Classes: {getCustomClasses().length}</p>
      <button onClick={handleAddClass}>Add Custom Class</button>
      <button onClick={clearCustomContent}>Clear All Custom Content</button>
    </div>
  );
}
*/
