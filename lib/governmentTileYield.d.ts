import Government from '@civ-clone/core-government/Government';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import Yield from '@civ-clone/core-yield/Yield';
import { TilePenalty } from '@civ-clone/base-government-tile-penalty/lib/tilePenalty';
import { TradeBonus } from '@civ-clone/base-government-trade-bonus/lib/tradeBonus';
export declare const DESPOTISM_PENALTY = 'civ2-world:despotism-penalty';
export declare const TRADE_BONUS = 'civ2-world:trade-bonus';
export declare const governmentTileYieldTypes: (typeof Yield)[];
/** Below Monarchy: Anarchy and Despotism. */
export declare const penalisedGovernments: (typeof Government)[];
/** The Republic and Democracy. */
export declare const tradeBonusGovernments: (typeof Government)[];
/** Monarchy and above, while the city celebrates. */
export declare const celebratingTradeBonusGovernments: (typeof Government)[];
/**
 * Step 8 of `city.cpp` `city_tile_yield`: under a government below Monarchy, a yield of more than 2 loses 1, unless the
 *  city is celebrating. The same rule as Civilization's.
 */
export declare const despotismPenalty: TilePenalty;
/**
 * Step 9: trade, if there is any, gains 1 under The Republic and Democracy, or, while the city celebrates, under
 *  Monarchy and above (Monarchy, Communism, Fundamentalism, The Republic and Democracy).
 */
export declare const tradeBonus: TradeBonus;
/** Both steps. A tile's own yields are worked out for a city that isn't celebrating. */
export declare const governmentTileYield: (
  YieldType: typeof Yield,
  value: number,
  government: PlayerGovernment | null,
  celebrating?: boolean
) => number;
export default governmentTileYield;
