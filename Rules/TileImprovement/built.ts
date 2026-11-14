import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  Airbase,
  Farmland,
  Fortress,
  Irrigation,
  Mine,
} from '../../TileImprovements';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
import { builtRules } from '@civ-clone/base-tile-improvement/lib/lifecycle';

/**
 * Building a tile improvement, and what it takes off the square (`unit.cpp` `unit_terrain_work_finish`): a mine takes
 *  the irrigation and farmland, irrigation the mine, and a fortress an airbase (`unit_cmd_terraform`'s order 4).
 */
export const getRules = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  engine: Engine = engineInstance
): Built[] =>
  builtRules(
    [
      [Mine, Irrigation],
      [Mine, Farmland],
      [Irrigation, Mine],
      [Fortress, Airbase],
    ],
    tileImprovementRegistry,
    engine
  );

export default getRules;
