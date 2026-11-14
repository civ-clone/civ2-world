"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.governmentTileYield = exports.tradeBonus = exports.despotismPenalty = exports.celebratingTradeBonusGovernments = exports.tradeBonusGovernments = exports.penalisedGovernments = exports.governmentTileYieldTypes = exports.TRADE_BONUS = exports.DESPOTISM_PENALTY = void 0;
const Governments_1 = require("../Governments");
const Yields_1 = require("../Yields");
const governments_1 = require("@civ-clone/civ2-rules/data/governments");
const governmentIndex_1 = require("@civ-clone/civ2-rules/lib/governmentIndex");
const tilePenalty_1 = require("@civ-clone/base-government-tile-penalty/lib/tilePenalty");
const tradeBonus_1 = require("@civ-clone/base-government-trade-bonus/lib/tradeBonus");
// The providers of the yields the government's steps add to a tile, so a city can tell them from the tile's own.
exports.DESPOTISM_PENALTY = 'civ2-world:despotism-penalty';
exports.TRADE_BONUS = 'civ2-world:trade-bonus';
exports.governmentTileYieldTypes = [
    Yields_1.Food,
    Yields_1.Production,
    Yields_1.Trade,
];
// Civilization II's governments that exist so far, in its order. Fundamentalism is pending (see `Governments`); it
//  falls into place by its index once it does.
const governments = [
    Governments_1.Anarchy,
    Governments_1.Despotism,
    Governments_1.Monarchy,
    Governments_1.Communism,
    Governments_1.Fundamentalism,
    Governments_1.Republic,
    Governments_1.Democracy,
].filter((Type) => Type !== null), where = (test) => governments.filter((Type) => test((0, governmentIndex_1.default)(Type)));
/** Below Monarchy: Anarchy and Despotism. */
exports.penalisedGovernments = where((index) => index < governments_1.MONARCHY);
/** The Republic and Democracy. */
exports.tradeBonusGovernments = where((index) => index >= governments_1.REPUBLIC);
/** Monarchy and above, while the city celebrates. */
exports.celebratingTradeBonusGovernments = where((index) => index >= governments_1.MONARCHY);
/**
 * Step 8 of `city.cpp` `city_tile_yield`: under a government below Monarchy, a yield of more than 2 loses 1, unless the
 *  city is celebrating. The same rule as Civilization's.
 */
exports.despotismPenalty = (0, tilePenalty_1.default)(exports.penalisedGovernments, 2, 1);
/**
 * Step 9: trade, if there is any, gains 1 under The Republic and Democracy, or, while the city celebrates, under
 *  Monarchy and above (Monarchy, Communism, Fundamentalism, The Republic and Democracy).
 */
exports.tradeBonus = (0, tradeBonus_1.default)(Yields_1.Trade, exports.tradeBonusGovernments, exports.celebratingTradeBonusGovernments, 0, 1);
/** Both steps. A tile's own yields are worked out for a city that isn't celebrating. */
const governmentTileYield = (YieldType, value, government, celebrating = false) => (0, exports.tradeBonus)(YieldType, (0, exports.despotismPenalty)(value, government, celebrating), government, celebrating);
exports.governmentTileYield = governmentTileYield;
exports.default = exports.governmentTileYield;
//# sourceMappingURL=governmentTileYield.js.map