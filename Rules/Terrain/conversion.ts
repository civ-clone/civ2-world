import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainConversion from '@civ-clone/base-unit-action-transform-terrain/Rules/TerrainConversion';
import TransformTerrain from '@civ-clone/base-unit-action-transform-terrain/TransformTerrain';
import { terrainConversions } from '@civ-clone/base-unit-action-transform-terrain/lib/conversion';
import { transform } from '../../lib/terrainProperties';

/** `@TERRAIN`'s transform column, as rows of what each terrain becomes: the terrains that can be transformed. */
export const transformTable: [typeof Terrain, typeof Terrain][] =
  transform.flatMap(([From, result]): [typeof Terrain, typeof Terrain][] =>
    typeof result === 'function' ? [[From, result]] : []
  );

/**
 * What an Engineers' transform makes of each terrain (`unit.cpp` `unit_terrain_work_finish`, order 8: the terrain's
 *  `transform_to`), as base-unit-action-transform-terrain's `TerrainConversion` rules, `civ2-world:terrain/conversion/
 *  transform/<terrain>`. Ocean has no transform, so it has no rule.
 */
export const getRules = (): TerrainConversion[] =>
  terrainConversions('civ2-world', TransformTerrain.kind, transformTable);

export default getRules;
