import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
export declare const IMPROVEMENTS = 'civ2-world:terrain-changed/improvements';
/**
 * What a square keeps of its irrigation and mine when its terrain changes (`unit.cpp` `unit_terrain_work_finish`, for a
 *  transform and for an irrigate or mine order that changes the terrain): irrigation and farmland only where the new
 *  terrain is irrigated in place, a mine only where it's mined in place. Anything else is taken off through the
 *  `Removed` rules. Roads, railroads, a fortress and an airbase stay.
 */
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  ruleRegistry?: RuleRegistry
) => TerrainChanged[];
export default getRules;
