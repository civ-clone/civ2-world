"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixedWorld = void 0;
const Loader_1 = require("@civ-clone/simple-world-generator/tests/lib/Loader");
const World_1 = require("@civ-clone/core-world/World");
/**
 * A square-grid world from `rows`, one entry per square, with the features given on each. Terrains are made with
 *  `ruleRegistry`, so no rule registered elsewhere gives them features.
 */
const fixedWorld = (rows, terrainFeatureRegistry, ruleRegistry) => new World_1.default(new Loader_1.default(rows.length, rows[0].length, rows.flat().map(([TerrainType, ...features]) => {
    const terrain = new TerrainType(ruleRegistry);
    return [
        terrain,
        ...features.map((Feature) => new Feature(terrain)),
    ];
}), terrainFeatureRegistry), ruleRegistry).build();
exports.fixedWorld = fixedWorld;
//# sourceMappingURL=world.js.map