// Official Nimble backgrounds
export { backOutOfRetirement } from './back-out-of-retirement';
export { devotedProtector } from './devoted-protector';
export { academyDropout } from './academy-dropout';
export { madeABadChoice } from './made-a-bad-choice';
export { hauntedPast } from './haunted-past';
export { earToTheGround } from './ear-to-the-ground';
export { whatIveBeenAround } from './what-ive-been-around';
export { acrobat } from './acrobat';
export { wildOne } from './wild-one';
export { feyTouched } from './fey-touched';
export { survivalist } from './survivalist';
export { homeAtSea } from './home-at-sea';
export { atHomeUnderground } from './at-home-underground';
export { raisedByGoblins } from './raised-by-goblins';
export { historyBuff } from './history-buff';
export { formerConArtist } from './former-con-artist';
export { secretlyUndead } from './secretly-undead';
export { tasteForTheFinerThings } from './taste-for-the-finer-things';
export { fearless } from './fearless';
export { soDumbImSmartSometimes } from './so-dumb-im-smart-sometimes';
export { wilyUnderdog } from './wily-underdog';
export { bumblewise } from './bumblewise';
export { accidentalAcrobat } from './accidental-acrobat';
export { tradesmanArtisan } from './tradesman-artisan';

// Import all background definitions for the main backgrounds object
import { backOutOfRetirement } from './back-out-of-retirement';
import { devotedProtector } from './devoted-protector';
import { academyDropout } from './academy-dropout';
import { madeABadChoice } from './made-a-bad-choice';
import { hauntedPast } from './haunted-past';
import { earToTheGround } from './ear-to-the-ground';
import { whatIveBeenAround } from './what-ive-been-around';
import { acrobat } from './acrobat';
import { wildOne } from './wild-one';
import { feyTouched } from './fey-touched';
import { survivalist } from './survivalist';
import { homeAtSea } from './home-at-sea';
import { atHomeUnderground } from './at-home-underground';
import { raisedByGoblins } from './raised-by-goblins';
import { historyBuff } from './history-buff';
import { formerConArtist } from './former-con-artist';
import { secretlyUndead } from './secretly-undead';
import { tasteForTheFinerThings } from './taste-for-the-finer-things';
import { fearless } from './fearless';
import { soDumbImSmartSometimes } from './so-dumb-im-smart-sometimes';
import { wilyUnderdog } from './wily-underdog';
import { bumblewise } from './bumblewise';
import { accidentalAcrobat } from './accidental-acrobat';
import { tradesmanArtisan } from './tradesman-artisan';

import { BackgroundDefinition } from '../../types/background';

// Main background definitions array
export const backgroundDefinitions: BackgroundDefinition[] = [
  backOutOfRetirement,
  devotedProtector,
  academyDropout,
  madeABadChoice,
  hauntedPast,
  earToTheGround,
  whatIveBeenAround,
  acrobat,
  wildOne,
  feyTouched,
  survivalist,
  homeAtSea,
  atHomeUnderground,
  raisedByGoblins,
  historyBuff,
  formerConArtist,
  secretlyUndead,
  tasteForTheFinerThings,
  fearless,
  soDumbImSmartSometimes,
  wilyUnderdog,
  bumblewise,
  accidentalAcrobat,
  tradesmanArtisan
];

// Helper function to get a background definition by ID
export function getBackgroundDefinition(backgroundId: string): BackgroundDefinition | null {
  return backgroundDefinitions.find(bg => bg.id === backgroundId) || null;
}

// Helper function to get all available backgrounds
export function getAllBackgrounds(): BackgroundDefinition[] {
  return backgroundDefinitions;
}

// Helper function to get background features
export function getBackgroundFeatures(backgroundId: string): BackgroundDefinition['features'] {
  const backgroundDef = getBackgroundDefinition(backgroundId);
  if (!backgroundDef) return [];
  
  return backgroundDef.features;
}

// Helper function to check if a background is available
export function isValidBackground(backgroundId: string): boolean {
  return backgroundDefinitions.some(bg => bg.id === backgroundId);
}