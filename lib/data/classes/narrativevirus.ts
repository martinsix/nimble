import { ClassDefinition } from '../../types/class';

export const narrativevirus: ClassDefinition = {
  id: 'narrativevirus',
  name: 'Narrative Virus',
  description: 'You are a sentient story that has escaped from fiction into reality. You rewrite the world around you to fit narrative conventions and tropes.',
  hitDieSize: 6,
  keyAttributes: ['intelligence', 'will'],
  startingHP: 9,
  armorProficiencies: [
    { type: 'freeform', name: 'Plot Armor' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Narrative Devices' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Genre Shift',
      description: 'Change the narrative genre of your current situation, altering what\'s possible and expected.',
      ability: {
        id: 'narrativevirus-genre-shift',
        name: 'Genre Shift',
        description: 'Switch reality between genres: horror (fear effects work better), comedy (absurd things happen), action (violence is enhanced), etc.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 3,
        currentUses: 3
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Metanarrative Awareness',
      description: 'You can perceive the underlying story structure of events and manipulate dramatic timing.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'resource',
      name: 'Story Points',
      description: 'Accumulate narrative energy from dramatic moments, plot twists, and character development.',
      resource: {
        resourceName: 'Story Points',
        amount: 5,
        rechargeType: 'long_rest'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Deus Ex Machina',
      description: 'Invoke an improbable but dramatically appropriate solution to your current problem.',
      ability: {
        id: 'narrativevirus-deus-ex-machina',
        name: 'Deus Ex Machina',
        description: 'Reality provides an unlikely but thematically perfect solution to your immediate crisis.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Rewrite Reality',
      description: 'Literally edit the "text" of reality, changing past events to better fit your preferred narrative.',
      ability: {
        id: 'narrativevirus-rewrite-reality',
        name: 'Rewrite Reality',
        description: 'Retroactively alter recent events by "editing" the story of what happened.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '2d12',
          attribute: 'intelligence'
        }
      }
    }
  ]
};