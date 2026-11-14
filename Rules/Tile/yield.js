"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const TileImprovements_1 = require("../../TileImprovements");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const terrainTable_1 = require("../../lib/terrainTable");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TerrainFeatures_1 = require("../../TerrainFeatures");
const Yield_1 = require("@civ-clone/core-world/Rules/Yield");
const lifecycle_1 = require("@civ-clone/base-tile-improvement/lib/lifecycle");
const river_1 = require("../../lib/river");
/**
 * A square's own yields, the first steps of `city.cpp` `city_tile_yield`: its terrain's or its special's food, shields
 *  and trade (a special replaces them), then the irrigation and mine bonuses from its terrain's row, then +1 trade for
 *  a river. The road, railroad, government and pollution steps are `yield-modifier`'s. Each part is its own yield, from
 *  the terrain, the special, the improvement or the river, and none is given for 0.
 */
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => [
    new Yield_1.default(new Criterion_1.default((tile) => (0, terrainTable_1.terrainIndex)(tile.terrain()) >= 0), new Effect_1.default((tile) => {
        const terrain = tile.terrain(), special = (0, terrainTable_1.specialOf)(terrain, terrainFeatureRegistry), provider = special
            ? special[0].constructor.name
            : terrainTable_1.terrainTypes[(0, terrainTable_1.terrainIndex)(terrain)].name, [food, shields, trade] = (0, terrainTable_1.baseYield)(terrain, terrainFeatureRegistry);
        return [
            [Yields_1.Food, food],
            [Yields_1.Production, shields],
            [Yields_1.Trade, trade],
        ]
            .filter(([, value]) => value !== 0)
            .map(([YieldType, value]) => new YieldType(value, provider));
    })),
    // The bonuses come from the terrain's own row, special or not.
    ...[
        [Yields_1.Food, TileImprovements_1.Irrigation, 5],
        [Yields_1.Production, TileImprovements_1.Mine, 6],
    ].map(([YieldType, Improvement, change]) => new Yield_1.default(new Criterion_1.default((0, lifecycle_1.hasImprovement)(tileImprovementRegistry, Improvement)), new Criterion_1.default((tile) => (0, terrainTable_1.terrainIndex)(tile.terrain()) >= 0 &&
        (0, terrainTable_1.terrainRow)((0, terrainTable_1.terrainIndex)(tile.terrain()))[change][1] > 0), new Effect_1.default((tile) => new YieldType((0, terrainTable_1.terrainRow)((0, terrainTable_1.terrainIndex)(tile.terrain()))[change][1], Improvement.name)))),
    new Yield_1.default(new Criterion_1.default((tile) => (0, river_1.hasRiver)(tile, terrainFeatureRegistry)), new Effect_1.default(() => new Yields_1.Trade(1, TerrainFeatures_1.River.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map