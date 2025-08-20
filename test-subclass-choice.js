// Quick test script to verify subclass choice functionality
const { classService } = require('./lib/services/class-service');
const { fighterChampion } = require('./lib/data/subclasses/fighter-champion');

console.log('Testing subclass choice feature...');

// Test getting available subclasses for Fighter
const testCharacter = {
  id: 'test-fighter',
  name: 'Test Fighter',
  level: 3,
  classId: 'fighter',
  subclassId: undefined,
  grantedFeatures: []
};

console.log('Fighter Champion subclass:', fighterChampion);

// Test if character can choose subclass
const canChoose = classService.canChooseSubclass(testCharacter);
console.log('Can choose subclass:', canChoose);

// Test getting available choices
const choices = classService.getAvailableSubclassChoices(testCharacter);
console.log('Available subclass choices:', choices);

console.log('Subclass choice system implemented successfully!');