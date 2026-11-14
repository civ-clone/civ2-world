import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
export declare const FEATURES = 'civ2-world:terrain-changed/features';
/**
 * What a square's features become when its terrain changes, whatever changed it (`map.cpp` `tile_set_terrain`, which
 *  keeps the river bit and replaces only the terrain):
 *  - a river stays (asked as `River`, not base-terrain-feature's `Watercourse`: while this package pins that from a
 *    branch, base-terrain-feature-river has its own copy, and its `Watercourse` is another class);
 *  - a special stays in its slot: a Forest's Pheasant (its first) is a Plains' Buffalo, its Silk (its second) Wheat;
 *    on Grassland, which has none, it's gone;
 *  - a square with no special gets none, so any special the new terrain was given when it was made is taken off it,
 *    but a Grassland's shield, which is the square's own pattern rather than a special, is left as it was rolled.
 */
export declare const getRules: (
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => TerrainChanged[];
export default getRules;
