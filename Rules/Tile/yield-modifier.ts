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
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import Priority from '@civ-clone/core-rule/Priority';
import Tile from '@civ-clone/core-world/Tile';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-world/Rules/YieldModifier';
import { hasImprovement } from '@civ-clone/base-tile-improvement/lib/lifecycle';

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
        [Desert, Grassland, Plains].some(
          (TerrainType) => tile.terrain() instanceof TerrainType
        ) || totalOf(yields, Trade) > 0
    ),
    new Effect((tile: Tile, player: Player | null, yields: Yield[]): void => {
      yields.push(new Trade(1, Road.name));
    })
  ),

  new YieldModifier(
    new High(),
    new Criterion(hasYield(Production)),
    new Criterion(hasImprovement(tileImprovementRegistry, Railroad)),
    new Effect(addMultiple(Production, 0.5, Railroad.name))
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
