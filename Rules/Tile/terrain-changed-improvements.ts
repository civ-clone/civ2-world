import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { Farmland, Irrigation, Mine } from '../../TileImprovements';
import { irrigation, mining } from '../../lib/terrainProperties';
import Effect from '@civ-clone/core-rule/Effect';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import { terrainValue } from '@civ-clone/base-terrain-properties/lib/terrainTable';

export const IMPROVEMENTS = 'civ2-world:terrain-changed/improvements';

/**
 * What a square keeps of its irrigation and mine when its terrain changes (`unit.cpp` `unit_terrain_work_finish`, for a
 *  transform and for an irrigate or mine order that changes the terrain): irrigation and farmland only where the new
 *  terrain is irrigated in place, a mine only where it's mined in place. Anything else is taken off through the
 *  `Removed` rules. Roads, railroads, a fortress and an airbase stay.
 */
export const getRules = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): TerrainChanged[] => [
  new TerrainChanged(
    IMPROVEMENTS,
    new Effect((tile: Tile, from: Terrain, to: Terrain): void => {
      const irrigates = terrainValue(irrigation, to) === 'yes',
        mines = terrainValue(mining, to) === 'yes';

      tileImprovementRegistry
        .getByTile(tile)
        .filter(
          (improvement: TileImprovement): boolean =>
            (!irrigates &&
              (improvement instanceof Irrigation ||
                improvement instanceof Farmland)) ||
            (!mines && improvement instanceof Mine)
        )
        .forEach((improvement: TileImprovement): void => {
          ruleRegistry.process(Removed, tile, improvement);
        });
    })
  ),
];

export default getRules;
