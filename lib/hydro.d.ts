import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
/**
 * Whether a city founded on `tile` may build a Hydro Plant: the square, or one of the 8 beside it, has a river or is
 *  Mountains (OpenCiv2 `src/auto/city.cpp` `city_create` sets the city's flag, `city_can_build_improvement` reads it,
 *  richardpenman/civ2@49f26ec). The game decides it when the city is founded and never again, so a city should keep the
 *  answer it had then.
 */
export declare const hydroPossible: (
  tile: Tile,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => boolean;
export default hydroPossible;
