"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.miningTurns = exports.irrigationTurns = exports.transform = exports.mining = exports.irrigation = exports.defence = exports.movementCost = void 0;
const terrain_1 = require("../data/terrain");
const terrainTable_1 = require("./terrainTable");
// `data/terrain`'s other columns as base-terrain-properties tables, for the units package's rules (moving, defending,
//  terraforming), so the numbers live in one place.
const table = (value) => terrainTable_1.terrainTypes.map((TerrainType, index) => [
    TerrainType,
    value(terrain_1.terrains[index]),
]);
/** Movement points to enter a square. */
exports.movementCost = table(([moveCost]) => moveCost);
/** The defence multiplier: `@TERRAIN`'s defence is in half steps, 2 being normal. */
exports.defence = table(([, halfSteps]) => halfSteps / 2);
const outcome = (result) => result === terrain_1.YES ? 'yes' : result === terrain_1.NO ? null : terrainTable_1.terrainTypes[result];
exports.irrigation = table(([, , , , , [result]]) => outcome(result));
exports.mining = table(([, , , , , , [result]]) => outcome(result));
exports.transform = table(([, , , , , , , result]) => outcome(result));
/** Settlers' turns for each order, where it can be done (`null` where not). */
exports.irrigationTurns = table(([, , , , , [result, , turns]]) => (result === terrain_1.NO ? null : turns));
exports.miningTurns = table(([, , , , , , [result, , turns]]) => (result === terrain_1.NO ? null : turns));
//# sourceMappingURL=terrainProperties.js.map