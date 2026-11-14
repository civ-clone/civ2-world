import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { Irrigation } from '../TileImprovements';
import { River } from '../TerrainFeatures';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

/** Whether a river runs through `tile`. */
export const hasRiver = (
  tile: Tile,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
): boolean =>
  terrainFeatureRegistry
    .getByTerrain(tile.terrain())
    .some((feature: TerrainFeature): boolean => feature instanceof River);

/**
 * Whether `tile` can be irrigated from water: it, or a square sharing one of its edges, is ocean, has a river, or is
 *  irrigated (`map.cpp` `tile_has_irrigation_source`: the four edge directions and the square itself). A city isn't a
 *  source in itself: founding one takes the square's irrigation away.
 */
export const isIrrigationSource = (
  tile: Tile,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
): boolean =>
  [tile, ...tile.getAdjacent()].some(
    (source: Tile): boolean =>
      source.isWater() ||
      hasRiver(source, terrainFeatureRegistry) ||
      tileImprovementRegistry
        .getByTile(source)
        .some(
          (improvement: TileImprovement): boolean =>
            improvement instanceof Irrigation
        )
  );
