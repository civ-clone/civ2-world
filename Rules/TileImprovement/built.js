"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const TileImprovements_1 = require("../../TileImprovements");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const lifecycle_1 = require("@civ-clone/base-tile-improvement/lib/lifecycle");
/**
 * Building a tile improvement, and what it takes off the square (`unit.cpp` `unit_terrain_work_finish`): a mine takes
 *  the irrigation and farmland, irrigation the mine, and a fortress an airbase (`unit_cmd_terraform`'s order 4).
 */
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, engine = Engine_1.instance) => (0, lifecycle_1.builtRules)([
    [TileImprovements_1.Mine, TileImprovements_1.Irrigation],
    [TileImprovements_1.Mine, TileImprovements_1.Farmland],
    [TileImprovements_1.Irrigation, TileImprovements_1.Mine],
    [TileImprovements_1.Fortress, TileImprovements_1.Airbase],
], tileImprovementRegistry, engine);
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map