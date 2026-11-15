import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainConversion from '@civ-clone/base-unit-action-transform-terrain/Rules/TerrainConversion';
/** `@TERRAIN`'s transform column, as rows of what each terrain becomes: the terrains that can be transformed. */
export declare const transformTable: [typeof Terrain, typeof Terrain][];
/**
 * What an Engineers' transform makes of each terrain (`unit.cpp` `unit_terrain_work_finish`, order 8: the terrain's
 *  `transform_to`), as base-unit-action-transform-terrain's `TerrainConversion` rules, `civ2-world:terrain/conversion/
 *  transform/<terrain>`. Ocean has no transform, so it has no rule.
 */
export declare const getRules: () => TerrainConversion[];
export default getRules;
