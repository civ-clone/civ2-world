import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import TileYield from '@civ-clone/core-world/Rules/Yield';
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
