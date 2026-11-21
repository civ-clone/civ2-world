"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.improvementYieldDescription = exports.terrainYieldDescription = exports.baseYieldTypes = void 0;
const Yields_1 = require("../../Yields");
const TileImprovements_1 = require("../../TileImprovements");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const terrain_1 = require("../../data/terrain");
const terrainTable_1 = require("../../lib/terrainTable");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TerrainFeatures_1 = require("../../TerrainFeatures");
const Yield_1 = require("@civ-clone/core-world/Rules/Yield");
const lifecycle_1 = require("@civ-clone/base-tile-improvement/lib/lifecycle");
const river_1 = require("../../lib/river");
/** The yields each of `[food, shields, trade]` is, in `baseYield`'s order. */
exports.baseYieldTypes = [
    Yields_1.Food,
    Yields_1.Production,
    Yields_1.Trade,
];
/**
 * What a square of each terrain gives with no special resource or anything else on it, as `baseYield` says (so
 *  Grassland's shield, which comes only with its `Shield`, isn't counted), for the Civilopedia
 *  (civ-clone/web-renderer#620): one line per yield that isn't 0.
 */
const terrainYieldDescription = () => new Description_1.default(...terrainTable_1.terrainTypes.flatMap((TerrainType) => 
// A terrain of the class, made without its constructor, which would take an id and run the `Created` rules.
(0, terrainTable_1.baseYield)(Object.create(TerrainType.prototype), new TerrainFeatureRegistry_1.default())
    .map((value, index) => ({
    type: 'terrain_yield',
    subject: TerrainType,
    yield: exports.baseYieldTypes[index],
    value,
}))
    .filter(({ value }) => value !== 0)));
exports.terrainYieldDescription = terrainYieldDescription;
/**
 * What irrigation (`change` 5) or a mine (6) adds on each terrain it's built on in place (`@TERRAIN`'s result `yes`),
 *  from that terrain's row, where it adds anything.
 */
const improvementYieldDescription = (YieldType, Improvement, change) => new Description_1.default(...terrainTable_1.terrainTypes.flatMap((TerrainType, index) => {
    const [result, bonus] = (0, terrainTable_1.terrainRow)(index)[change];
    return result === terrain_1.YES && bonus > 0
        ? [
            {
                type: 'improvement_yield',
                subject: TerrainType,
                yield: YieldType,
                value: bonus,
                improvement: Improvement,
            },
        ]
        : [];
}));
exports.improvementYieldDescription = improvementYieldDescription;
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
        return [food, shields, trade]
            .map((value, index) => [
            exports.baseYieldTypes[index],
            value,
        ])
            .filter(([, value]) => value !== 0)
            .map(([YieldType, value]) => new YieldType(value, provider));
    }), (0, exports.terrainYieldDescription)()),
    // The bonuses come from the terrain's own row, special or not.
    ...[
        [Yields_1.Food, TileImprovements_1.Irrigation, 5],
        [Yields_1.Production, TileImprovements_1.Mine, 6],
    ].map(([YieldType, Improvement, change]) => new Yield_1.default(new Criterion_1.default((0, lifecycle_1.hasImprovement)(tileImprovementRegistry, Improvement)), new Criterion_1.default((tile) => (0, terrainTable_1.terrainIndex)(tile.terrain()) >= 0 &&
        (0, terrainTable_1.terrainRow)((0, terrainTable_1.terrainIndex)(tile.terrain()))[change][1] > 0), new Effect_1.default((tile) => new YieldType((0, terrainTable_1.terrainRow)((0, terrainTable_1.terrainIndex)(tile.terrain()))[change][1], Improvement.name)), (0, exports.improvementYieldDescription)(YieldType, Improvement, change))),
    new Yield_1.default(new Criterion_1.default((tile) => (0, river_1.hasRiver)(tile, terrainFeatureRegistry)), new Effect_1.default(() => new Yields_1.Trade(1, TerrainFeatures_1.River.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map