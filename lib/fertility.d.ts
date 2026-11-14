import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
/**
 * What a square of terrain row `row` adds: 3 × food + trade, + 2 × shields except on Grassland, then + 3 for Hills or
 *  + 1 for another terrain mined in place, or + 2 for one irrigated in place. Rows 0 to 10 are the terrains and 11 to 21
 *  their first special: any special counts as the first (the game indexes the table by terrain + 11).
 */
export declare const terrainScore: (row: number) => number;
/**
 * The fertility Civilization II gives `tile` when the map is made: 0 unless it is Grassland or Plains, otherwise the
 *  21 squares' scores added up (16 less on Grassland without its shield), then `(total − 120) / 8` kept to 1 to 15,
 *  halved, + 8. The game lowers it later around a city (`city_refresh_area_tiles`); that is the caller's to apply.
 */
export declare const fertility: (
  tile: Tile,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => number;
export default fertility;
