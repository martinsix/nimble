import { ClassDefinition } from '../../types/class';

export const mutant: ClassDefinition = {
  id: 'mutant',
  name: 'Mutant',
  description: 'A being whose body has been twisted by strange energies, able to manifest grotesque but powerful aberrant appendages and mutations.',
  hitDieSize: 8,
  keyAttributes: ['strength', 'intelligence'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'cloth' },
    { type: 'freeform', name: 'Chitinous Growth' }
  ],
  weaponProficiencies: [
    { type: 'strength_weapons' },
    { type: 'freeform', name: 'Mutant Appendages' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Aberrant Manifestation',
      description: 'Rapidly grow twisted appendages like tentacles, spines, or extra limbs for combat or utility.',
      ability: {
        id: 'mutant-manifestation',
        name: 'Aberrant Manifestation',
        description: 'Manifest a grotesque appendage: tentacle (grapple), bone spike (weapon), eye stalk (perception), etc.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 3,
        currentUses: 3
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Unstable Genetics',
      description: 'Your body constantly adapts and changes, making you resistant to toxins and diseases.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'resource',
      name: 'Mutation Energy',
      description: 'Chaotic energies within your cells fuel rapid biological changes and adaptations.',
      resource: {
        resourceName: 'Mutation Points',
        amount: 4,
        rechargeType: 'long_rest'
      }
    },
    {
      level: 2,
      type: 'ability',
      name: 'Reactive Evolution',
      description: 'Your body rapidly adapts to threats, developing resistances or countermeasures in real-time.',
      ability: {
        id: 'mutant-reactive-evolution',
        name: 'Reactive Evolution',
        description: 'Temporarily develop immunity or resistance to a damage type you just received.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Horrific Transformation',
      description: 'Undergo a disturbing metamorphosis, becoming a writhing mass of eyes, mouths, and grasping appendages.',
      ability: {
        id: 'mutant-transformation',
        name: 'Horrific Transformation',
        description: 'Transform into an aberrant horror form with multiple attacks and terrifying presence.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Cellular Reconstruction',
      description: 'Completely restructure your body at the cellular level, healing wounds or gaining new capabilities.',
      ability: {
        id: 'mutant-reconstruction',
        name: 'Cellular Reconstruction',
        description: 'Rapidly heal injuries or temporarily gain a completely new physical capability.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1,
        roll: {
          dice: '3d6',
          attribute: 'intelligence'
        }
      }
    }
  ]
};