"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.transformTable = void 0;
const TransformTerrain_1 = require("@civ-clone/base-unit-action-transform-terrain/TransformTerrain");
const conversion_1 = require("@civ-clone/base-unit-action-transform-terrain/lib/conversion");
const terrainProperties_1 = require("../../lib/terrainProperties");
/** `@TERRAIN`'s transform column, as rows of what each terrain becomes: the terrains that can be transformed. */
exports.transformTable = terrainProperties_1.transform.flatMap(([From, result]) => typeof result === 'function' ? [[From, result]] : []);
/**
 * What an Engineers' transform makes of each terrain (`unit.cpp` `unit_terrain_work_finish`, order 8: the terrain's
 *  `transform_to`), as base-unit-action-transform-terrain's `TerrainConversion` rules, `civ2-world:terrain/conversion/
 *  transform/<terrain>`. Ocean has no transform, so it has no rule.
 */
const getRules = () => (0, conversion_1.terrainConversions)('civ2-world', TransformTerrain_1.default.kind, exports.transformTable);
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=conversion.js.map