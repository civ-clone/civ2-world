"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.roadPriority = exports.RAILROAD_PRODUCTION = exports.roadTradeTerrains = exports.ROAD_TRADE = void 0;
const governmentTileYield_1 = require("../../lib/governmentTileYield");
const Terrains_1 = require("../../Terrains");
const Yields_1 = require("../../Yields");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const TileImprovements_1 = require("../../TileImprovements");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const yieldModifiers_1 = require("@civ-clone/base-tile-improvement/lib/yieldModifiers");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const YieldModifier_1 = require("@civ-clone/core-world/Rules/YieldModifier");
const lifecycle_1 = require("@civ-clone/base-tile-improvement/lib/lifecycle");
const Requirements_1 = require("../../Requirements");
/** The trade a road adds. */
exports.ROAD_TRADE = 1;
/** The terrains a road always adds trade on; elsewhere it adds trade only to a square already making some. */
exports.roadTradeTerrains = [
    Terrains_1.Desert,
    Terrains_1.Grassland,
    Terrains_1.Plains,
];
/** What a railroad adds to a square's shields: half again, rounded down. */
exports.RAILROAD_PRODUCTION = 0.5;
/** The road's trade comes before the railroad (`High`), once the river's trade is in. */
exports.roadPriority = new Priority_1.default(500);
/**
 * The rest of `city.cpp` `city_tile_yield`, in its order, for a square worked by no particular city (the city's own
 *  steps, Supermarket and the like, aren't here):
 *  - a road gives +1 trade on Desert, Plains and Grassland, or on any square already making trade (step 5);
 *  - a railroad gives half again of the shields, rounded down: shields only, unlike Civilization (step 7);
 *  - below Monarchy a yield of more than 2 loses 1, then The Republic and Democracy add 1 to any trade (steps 8, 9);
 *  - pollution halves food, shields and trade, rounded up (step 11).
 */
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance) => [
    new YieldModifier_1.default(exports.roadPriority, new Criterion_1.default((0, lifecycle_1.hasImprovement)(tileImprovementRegistry, TileImprovements_1.Road)), new Criterion_1.default((tile, player, yields) => exports.roadTradeTerrains.some((TerrainType) => tile.terrain() instanceof TerrainType) || (0, yieldModifiers_1.totalOf)(yields, Yields_1.Trade) > 0), new Effect_1.default((tile, player, yields) => {
        yields.push(new Yields_1.Trade(exports.ROAD_TRADE, TileImprovements_1.Road.name));
    }), 
    // For the Civilopedia (civ-clone/web-renderer#620): the terrains it always adds trade on. A square already making
    //  trade (Ocean, a river, a special) is the square's matter, not its terrain's.
    new Description_1.default(...exports.roadTradeTerrains.map((TerrainType) => ({
        type: 'improvement_yield',
        subject: TerrainType,
        yield: Yields_1.Trade,
        value: exports.ROAD_TRADE,
        improvement: TileImprovements_1.Road,
    })))),
    new YieldModifier_1.default(new Priorities_1.High(), new Criterion_1.default((0, yieldModifiers_1.hasYield)(Yields_1.Production)), new Criterion_1.default((0, lifecycle_1.hasImprovement)(tileImprovementRegistry, TileImprovements_1.Railroad)), new Effect_1.default((0, yieldModifiers_1.addMultiple)(Yields_1.Production, exports.RAILROAD_PRODUCTION, TileImprovements_1.Railroad.name)), 
    // On every terrain a railroad can be built on (civ2-world's `Requirements`).
    new Description_1.default(...Requirements_1.landTerrains.map((TerrainType) => ({
        type: 'improvement_yield_percent',
        subject: TerrainType,
        yield: Yields_1.Production,
        value: exports.RAILROAD_PRODUCTION,
        improvement: TileImprovements_1.Railroad,
    })))),
    ...[
        [
            governmentTileYield_1.DESPOTISM_PENALTY,
            (YieldType, value, government) => (0, governmentTileYield_1.despotismPenalty)(value, government),
        ],
        [governmentTileYield_1.TRADE_BONUS, governmentTileYield_1.tradeBonus],
    ].flatMap(([provider, step]) => governmentTileYield_1.governmentTileYieldTypes.map((YieldType) => new YieldModifier_1.default(new Priorities_1.Normal(), new Effect_1.default((0, yieldModifiers_1.governmentStep)(YieldType, provider, step, playerGovernmentRegistry))))),
    ...[Yields_1.Food, Yields_1.Production, Yields_1.Trade].map((YieldType) => new YieldModifier_1.default(new Priorities_1.Low(), new Criterion_1.default((0, lifecycle_1.hasImprovement)(tileImprovementRegistry, TileImprovements_1.Pollution)), new Effect_1.default((0, yieldModifiers_1.halveRoundingUp)(YieldType, TileImprovements_1.Pollution.name)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map