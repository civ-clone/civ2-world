import {
  DESPOTISM_PENALTY,
  TRADE_BONUS,
  despotismPenalty,
  governmentTileYieldTypes,
  tradeBonus,
} from '../../lib/governmentTileYield';
import { Desert, Grassland, Plains } from '../../Terrains';
import { Food, Production, Trade } from '../../Yields';
import { High, Low, Normal } from '@civ-clone/core-rule/Priorities';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { Pollution, Railroad, Road } from '../../TileImprovements';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import {
  addMultiple,
  governmentStep,
  halveRoundingUp,
  hasYield,
  totalOf,
} from '@civ-clone/base-tile-improvement/lib/yieldModifiers';
import Criterion from '@civ-clone/core-rule/Criterion';
import Description from '@civ-clone/core-rule/Description';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import Priority from '@civ-clone/core-rule/Priority';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-world/Rules/YieldModifier';
import { hasImprovement } from '@civ-clone/base-tile-improvement/lib/lifecycle';
import { landTerrains } from '../../Requirements';

/** The trade a road adds. */
export const ROAD_TRADE = 1;

/** The terrains a road always adds trade on; elsewhere it adds trade only to a square already making some. */
export const roadTradeTerrains: (typeof Terrain)[] = [
  Desert,
  Grassland,
  Plains,
];

/** What a railroad adds to a square's shields: half again, rounded down. */
export const RAILROAD_PRODUCTION = 0.5;

/** The road's trade comes before the railroad (`High`), once the river's trade is in. */
export const roadPriority = new Priority(500);

/**
 * The rest of `city.cpp` `city_tile_yield`, in its order, for a square worked by no particular city (the city's own
 *  steps, Supermarket and the like, aren't here):
 *  - a road gives +1 trade on Desert, Plains and Grassland, or on any square already making trade (step 5);
 *  - a railroad gives half again of the shields, rounded down: shields only, unlike Civilization (step 7);
 *  - below Monarchy a yield of more than 2 loses 1, then The Republic and Democracy add 1 to any trade (steps 8, 9);
 *  - pollution halves food, shields and trade, rounded up (step 11).
 */
export const getRules = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance
): YieldModifier[] => [
  new YieldModifier(
    roadPriority,
    new Criterion(hasImprovement(tileImprovementRegistry, Road)),
    new Criterion(
      (tile: Tile, player: Player | null, yields: Yield[]): boolean =>
        roadTradeTerrains.some(
          (TerrainType) => tile.terrain() instanceof TerrainType
        ) || totalOf(yields, Trade) > 0
    ),
    new Effect((tile: Tile, player: Player | null, yields: Yield[]): void => {
      yields.push(new Trade(ROAD_TRADE, Road.name));
    }),
    // For the Civilopedia (civ-clone/web-renderer#620): the terrains it always adds trade on. A square already making
    //  trade (Ocean, a river, a special) is the square's matter, not its terrain's.
    new Description(
      ...roadTradeTerrains.map((TerrainType: typeof Terrain) => ({
        type: 'improvement_yield',
        subject: TerrainType,
        yield: Trade,
        value: ROAD_TRADE,
        improvement: Road,
      }))
    )
  ),

  new YieldModifier(
    new High(),
    new Criterion(hasYield(Production)),
    new Criterion(hasImprovement(tileImprovementRegistry, Railroad)),
    new Effect(addMultiple(Production, RAILROAD_PRODUCTION, Railroad.name)),
    // On every terrain a railroad can be built on (civ2-world's `Requirements`).
    new Description(
      ...landTerrains.map((TerrainType: typeof Terrain) => ({
        type: 'improvement_yield_percent',
        subject: TerrainType,
        yield: Production,
        value: RAILROAD_PRODUCTION,
        improvement: Railroad,
      }))
    )
  ),

  ...(
    [
      [
        DESPOTISM_PENALTY,
        (
          YieldType: typeof Yield,
          value: number,
          government: PlayerGovernment | null
        ): number => despotismPenalty(value, government),
      ],
      [TRADE_BONUS, tradeBonus],
    ] as [
      string,
      (
        YieldType: typeof Yield,
        value: number,
        government: PlayerGovernment | null
      ) => number
    ][]
  ).flatMap(([provider, step]): YieldModifier[] =>
    governmentTileYieldTypes.map(
      (YieldType: typeof Yield): YieldModifier =>
        new YieldModifier(
          new Normal(),
          new Effect(
            governmentStep(YieldType, provider, step, playerGovernmentRegistry)
          )
        )
    )
  ),

  ...([Food, Production, Trade] as (typeof Yield)[]).map(
    (YieldType: typeof Yield): YieldModifier =>
      new YieldModifier(
        new Low(),
        new Criterion(hasImprovement(tileImprovementRegistry, Pollution)),
        new Effect(halveRoundingUp(YieldType, Pollution.name))
      )
  ),
];

export default getRules;
