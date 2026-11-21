import { Irrigation } from '../../TileImprovements';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Description from '@civ-clone/core-rule/Description';
import TileYield from '@civ-clone/core-world/Rules/Yield';
import Yield from '@civ-clone/core-yield/Yield';
/** The yields each of `[food, shields, trade]` is, in `baseYield`'s order. */
export declare const baseYieldTypes: [typeof Yield, typeof Yield, typeof Yield];
/**
 * What a square of each terrain gives with no special resource or anything else on it, as `baseYield` says (so
 *  Grassland's shield, which comes only with its `Shield`, isn't counted), for the Civilopedia
 *  (civ-clone/web-renderer#620): one line per yield that isn't 0.
 */
export declare const terrainYieldDescription: () => Description;
/**
 * What irrigation (`change` 5) or a mine (6) adds on each terrain it's built on in place (`@TERRAIN`'s result `yes`),
 *  from that terrain's row, where it adds anything.
 */
export declare const improvementYieldDescription: (
  YieldType: typeof Yield,
  Improvement: typeof Irrigation,
  change: 5 | 6
) => Description;
/**
 * A square's own yields, the first steps of `city.cpp` `city_tile_yield`: its terrain's or its special's food, shields
 *  and trade (a special replaces them), then the irrigation and mine bonuses from its terrain's row, then +1 trade for
 *  a river. The road, railroad, government and pollution steps are `yield-modifier`'s. Each part is its own yield, from
 *  the terrain, the special, the improvement or the river, and none is given for 0.
 */
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => TileYield[];
export default getRules;
