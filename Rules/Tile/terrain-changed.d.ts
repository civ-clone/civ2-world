import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
export declare const FEATURES = 'civ2-world:terrain-changed/features';
export declare const CLEAR_YIELD_CACHE =
  'civ2-world:terrain-changed/clear-yield-cache';
/**
 * What a square's features become when its terrain changes, whatever changed it (`map.cpp` `tile_set_terrain`, which
 *  keeps the river bit and replaces only the terrain):
 *  - a river stays (asked as `River`, not base-terrain-feature's `Watercourse`: while this package pins that from a
 *    branch, base-terrain-feature-river has its own copy, and its `Watercourse` is another class);
 *  - a special stays in its slot: a Forest's Pheasant (its first) is a Plains' Buffalo, its Silk (its second) Wheat;
 *    on Grassland, which has none, it's gone;
 *  - a square with no special gets none;
 *  - a square that becomes Grassland rolls for its shield once, here, at the odds a Grassland is made with.
 *
 * The new terrain was made for this change, so everything on it was rolled for it: by its `Created` rules, and, for a
 *  cleared Jungle or Swamp, by the conversion action's own Shield roll as well. All of it is taken off first, or a
 *  Grassland would keep a shield from either roll (three in four, not one in two).
 */
export declare const getRules: (
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  playerRegistry?: PlayerRegistry,
  randomNumberGenerator?: () => number
) => TerrainChanged[];
export default getRules;
