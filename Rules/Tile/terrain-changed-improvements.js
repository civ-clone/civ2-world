"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.IMPROVEMENTS = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const TileImprovements_1 = require("../../TileImprovements");
const terrainProperties_1 = require("../../lib/terrainProperties");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Removed_1 = require("@civ-clone/core-tile-improvement/Rules/Removed");
const TerrainChanged_1 = require("@civ-clone/core-world/Rules/TerrainChanged");
const terrainTable_1 = require("@civ-clone/base-terrain-properties/lib/terrainTable");
exports.IMPROVEMENTS = 'civ2-world:terrain-changed/improvements';
/**
 * What a square keeps of its irrigation and mine when its terrain changes (`unit.cpp` `unit_terrain_work_finish`, for a
 *  transform and for an irrigate or mine order that changes the terrain): irrigation and farmland only where the new
 *  terrain is irrigated in place, a mine only where it's mined in place. Anything else is taken off through the
 *  `Removed` rules. Roads, railroads, a fortress and an airbase stay.
 */
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new TerrainChanged_1.default(exports.IMPROVEMENTS, new Effect_1.default((tile, from, to) => {
        const irrigates = (0, terrainTable_1.terrainValue)(terrainProperties_1.irrigation, to) === 'yes', mines = (0, terrainTable_1.terrainValue)(terrainProperties_1.mining, to) === 'yes';
        tileImprovementRegistry
            .getByTile(tile)
            .filter((improvement) => (!irrigates &&
            (improvement instanceof TileImprovements_1.Irrigation ||
                improvement instanceof TileImprovements_1.Farmland)) ||
            (!mines && improvement instanceof TileImprovements_1.Mine))
            .forEach((improvement) => {
            ruleRegistry.process(Removed_1.default, tile, improvement);
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=terrain-changed-improvements.js.map