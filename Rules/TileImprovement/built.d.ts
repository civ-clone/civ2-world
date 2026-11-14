import { Engine } from '@civ-clone/core-engine/Engine';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
/**
 * Building a tile improvement, and what it takes off the square (`unit.cpp` `unit_terrain_work_finish`): a mine takes
 *  the irrigation and farmland, irrigation the mine, and a fortress an airbase (`unit_cmd_terraform`'s order 4).
 */
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  engine?: Engine
) => Built[];
export default getRules;
