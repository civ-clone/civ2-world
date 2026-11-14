import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from '../Governments';
import { Food, Production, Trade } from '../Yields';
import { MONARCHY, REPUBLIC } from '@civ-clone/civ2-rules/data/governments';
import Government from '@civ-clone/core-government/Government';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import Yield from '@civ-clone/core-yield/Yield';
import governmentIndex from '@civ-clone/civ2-rules/lib/governmentIndex';
import tilePenalty, {
  TilePenalty,
} from '@civ-clone/base-government-tile-penalty/lib/tilePenalty';
import baseTradeBonus, {
  TradeBonus,
} from '@civ-clone/base-government-trade-bonus/lib/tradeBonus';

// The providers of the yields the government's steps add to a tile, so a city can tell them from the tile's own.
export const DESPOTISM_PENALTY = 'civ2-world:despotism-penalty';
export const TRADE_BONUS = 'civ2-world:trade-bonus';

export const governmentTileYieldTypes: (typeof Yield)[] = [
  Food,
  Production,
  Trade,
];

// Civilization II's governments, in its order. Each step below compares the government's index, as `city.cpp`
//  `city_tile_yield` compares `civs[civ].government`: Fundamentalism (4) is never penalised and gains trade only while
//  the city celebrates.
const governments: (typeof Government)[] = [
    Anarchy,
    Despotism,
    Monarchy,
    Communism,
    Fundamentalism,
    Republic,
    Democracy,
  ],
  where = (test: (index: number) => boolean): (typeof Government)[] =>
    governments.filter((Type) => test(governmentIndex(Type)));

/** Below Monarchy: Anarchy and Despotism. */
export const penalisedGovernments = where((index) => index < MONARCHY);
/** The Republic and Democracy. */
export const tradeBonusGovernments = where((index) => index >= REPUBLIC);
/** Monarchy and above, while the city celebrates. */
export const celebratingTradeBonusGovernments = where(
  (index) => index >= MONARCHY
);

/**
 * Step 8 of `city.cpp` `city_tile_yield`: under a government below Monarchy, a yield of more than 2 loses 1, unless the
 *  city is celebrating. The same rule as Civilization's.
 */
export const despotismPenalty: TilePenalty = tilePenalty(
  penalisedGovernments,
  2,
  1
);

/**
 * Step 9: trade, if there is any, gains 1 under The Republic and Democracy, or, while the city celebrates, under
 *  Monarchy and above (Monarchy, Communism, Fundamentalism, The Republic and Democracy).
 */
export const tradeBonus: TradeBonus = baseTradeBonus(
  Trade,
  tradeBonusGovernments,
  celebratingTradeBonusGovernments,
  0,
  1
);

/** Both steps. A tile's own yields are worked out for a city that isn't celebrating. */
export const governmentTileYield = (
  YieldType: typeof Yield,
  value: number,
  government: PlayerGovernment | null,
  celebrating: boolean = false
): number =>
  tradeBonus(
    YieldType,
    despotismPenalty(value, government, celebrating),
    government,
    celebrating
  );

export default governmentTileYield;
