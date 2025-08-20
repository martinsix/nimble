import { ClassDefinition } from '../../types/class';

export const quantumghost: ClassDefinition = {
  id: 'quantumghost',
  name: 'Quantum Ghost',
  description: 'You exist in quantum superposition, simultaneously alive and dead until observed. Your quantum state collapses and reforms constantly.',
  hitDieSize: 8,
  keyAttributes: ['will', 'intelligence'],
  startingHP: 11,
  armorProficiencies: [
    { type: 'freeform', name: 'Probability Fields' }
  ],
  weaponProficiencies: [
    { type: 'freeform', name: 'Quantum Uncertainties' }
  ],
  features: [
    {
      level: 1,
      type: 'ability',
      name: 'Superposition',
      description: 'Exist in multiple quantum states simultaneously until someone observes the outcome.',
      ability: {
        id: 'quantumghost-superposition',
        name: 'Superposition',
        description: 'Take multiple contradictory actions at once; reality decides which one "actually" happened when observed.',
        type: 'action',
        frequency: 'per_encounter',
        maxUses: 2,
        currentUses: 2
      }
    },
    {
      level: 1,
      type: 'passive_feature',
      name: 'Observer Effect',
      description: 'Your quantum state changes based on who is looking at you and what they expect to see.',
      category: 'utility'
    },
    {
      level: 2,
      type: 'resource',
      name: 'Quantum Coherence',
      description: 'Maintain quantum entanglement with parallel versions of yourself across dimensions.',
      resource: {
        resourceName: 'Coherence Points',
        amount: 4,
        rechargeType: 'short_rest'
      }
    },
    {
      level: 3,
      type: 'ability',
      name: 'Probability Collapse',
      description: 'Force multiple potential outcomes to exist simultaneously, then choose which becomes real.',
      ability: {
        id: 'quantumghost-probability-collapse',
        name: 'Probability Collapse',
        description: 'Retroactively change the outcome of a recent event by selecting from quantum alternatives.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 1,
        currentUses: 1
      }
    },
    {
      level: 4,
      type: 'ability',
      name: 'Quantum Tunneling',
      description: 'Phase through solid matter by exploiting quantum mechanical principles.',
      ability: {
        id: 'quantumghost-quantum-tunneling',
        name: 'Quantum Tunneling',
        description: 'Pass through any barrier by briefly existing in a parallel dimension where it doesn\'t exist.',
        type: 'action',
        frequency: 'per_safe_rest',
        maxUses: 2,
        currentUses: 2,
        roll: {
          dice: '2d10',
          attribute: 'intelligence'
        }
      }
    }
  ]
};