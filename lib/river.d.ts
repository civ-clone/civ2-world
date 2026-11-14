import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Tile from '@civ-clone/core-world/Tile';
/** Whether a river runs through `tile`. */
export declare const hasRiver: (
  tile: Tile,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => boolean;
/**
 * Whether `tile` can be irrigated from water: it, or a square sharing one of its edges, is ocean, has a river, or is
 *  irrigated (`map.cpp` `tile_has_irrigation_source`: the four edge directions and the square itself). A city isn't a
 *  source in itself: founding one takes the square's irrigation away.
 */
export declare const isIrrigationSource: (
  tile: Tile,
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  tileImprovementRegistry?: TileImprovementRegistry
) => boolean;
