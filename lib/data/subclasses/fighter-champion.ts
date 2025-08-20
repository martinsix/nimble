import { SubclassDefinition } from '../../types/class';

export const fighterChampion: SubclassDefinition = {
  id: 'fighter-champion',
  name: 'Champion',
  description: 'A master of physical prowess who excels at straightforward combat techniques and athletic feats.',
  parentClassId: 'fighter',
  features: [
    {
      level: 3,
      type: 'passive_feature',
      name: 'Improved Critical',
      description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.',
      category: 'combat'
    },
    {
      level: 7,
      type: 'ability',
      name: 'Remarkable Athlete',
      description: 'You can add half your proficiency bonus to any Strength, Dexterity, or Constitution check.',
      ability: {
        id: 'champion-remarkable-athlete',
        name: 'Remarkable Athlete',
        description: 'Add half proficiency bonus to physical ability checks.',
        type: 'action',
        frequency: 'at_will'
      }
    },
    {
      level: 10,
      type: 'passive_feature',
      name: 'Additional Fighting Style',
      description: 'You can choose a second option from the Fighting Style class feature.',
      category: 'combat'
    },
    {
      level: 15,
      type: 'passive_feature',
      name: 'Superior Critical',
      description: 'Your weapon attacks score a critical hit on a roll of 18-20.',
      category: 'combat'
    },
    {
      level: 18,
      type: 'passive_feature',
      name: 'Survivor',
      description: 'You regain hit points equal to 5 + your Constitution modifier at the start of your turn if you have no more than half your hit points left.',
      category: 'combat'
    }
  ]
};