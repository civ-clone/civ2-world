import { SpecialRow, TerrainRow } from '../data/terrain';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
/** The terrain classes, by Civilization II's terrain index (`data/terrain`). */
export declare const terrainTypes: (typeof Terrain)[];
/**
 * The special resources, `specialTypes[slot - 1][terrain index]`. Grassland's are `null`: a Grassland square never has
 *  one, and its shield is the `Shield` feature instead. Oil is the second special of both Desert and Glacier.
 */
export declare const specialTypes: [
  (typeof TerrainFeature | null)[],
  (typeof TerrainFeature | null)[]
];
/** Every special resource class, once each. */
export declare const specialResourceTypes: (typeof TerrainFeature)[];
/** The terrain index of `terrain`, or -1 for a terrain that isn't one of Civilization II's. */
export declare const terrainIndex: (terrain: Terrain) => number;
/** Which special of terrain `index` `feature` is: 1 or 2, or 0 if it isn't one. */
export declare const specialSlot: (
  index: number,
  feature: TerrainFeature
) => 0 | 1 | 2;
/** The special resource `terrain` holds, and which of its two it is, if any. */
export declare const specialOf: (
  terrain: Terrain,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => [TerrainFeature, 1 | 2] | null;
export declare const terrainRow: (index: number) => TerrainRow;
export declare const specialRow: (index: number, slot: 1 | 2) => SpecialRow;
/**
 * A square's food, shields and trade before anything is built on it (`city.cpp` `city_tile_yield`, step 1): its
 *  special's row if it has one, otherwise its terrain's, and no shield on Grassland without its `Shield`. `null` for a
 *  terrain that isn't one of Civilization II's.
 */
export declare const baseYield: (
  terrain: Terrain,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => [food: number, shields: number, trade: number] | null;
