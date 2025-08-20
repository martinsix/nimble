import { SubclassDefinition } from '../../types/class';

export const voidwalkerNihilist: SubclassDefinition = {
  id: 'voidwalker-nihilist',
  name: 'Existential Nihilist',
  description: 'You embrace the meaninglessness of existence, drawing power from the fundamental emptiness of all things.',
  parentClassId: 'voidwalker',
  features: [
    {
      level: 3,
      type: 'ability',
      name: 'Nothing Matters',
      description: 'Convince others that their actions are meaningless, causing them to lose motivation and purpose.',
      ability: {
        id: 'nihilist-nothing-matters',
        name: 'Nothing Matters',
        description: 'Target becomes apathetic and loses the will to take meaningful action.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2,
        roll: {
          dice: '2d6',
          attribute: 'will'
        }
      }
    },
    {
      level: 7,
      type: 'passive_feature',
      name: 'Immune to Despair',
      description: 'Having embraced meaninglessness, you cannot be frightened, charmed, or emotionally manipulated.',
      category: 'utility'
    },
    {
      level: 11,
      type: 'ability',
      name: 'Unmake Concept',
      description: 'Temporarily erase an abstract concept from local reality, making it cease to exist.',
      ability: {
        id: 'nihilist-unmake-concept',
        name: 'Unmake Concept',
        description: 'Choose a concept (love, fear, gravity, etc.) and make it temporarily not exist in a small area.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 15,
      type: 'ability',
      name: 'Existential Crisis',
      description: 'Force a creature to confront the meaninglessness of existence, potentially breaking their mind.',
      ability: {
        id: 'nihilist-existential-crisis',
        name: 'Existential Crisis',
        description: 'Target must grapple with cosmic meaninglessness, potentially causing them to shut down completely.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '4d8',
          attribute: 'will'
        }
      }
    }
  ]
};