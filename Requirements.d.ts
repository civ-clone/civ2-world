import {
  Condition,
  Requirement,
} from '@civ-clone/core-requirement/Requirement';
import Terrain from '@civ-clone/core-terrain/Terrain';
export declare const IRRIGATION_SOURCE: Condition;
export declare const RIVER: Condition;
export declare const NO_RIVER: Condition;
export declare const NO_FORTRESS: Condition;
export declare const NO_CITY: Condition;
export declare const landTerrains: (typeof Terrain)[],
  improvedBy: (change: 5 | 6) => (typeof Terrain)[];
export declare const availableRequirements: Requirement[];
export default availableRequirements;
