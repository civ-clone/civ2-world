import { Food, Production, Trade } from '../../Yields';
import { Irrigation, Mine } from '../../TileImprovements';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import {
  baseYield,
  specialOf,
  terrainIndex,
  terrainRow,
  terrainTypes,
} from '../../lib/terrainTable';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { River } from '../../TerrainFeatures';
import Tile from '@civ-clone/core-world/Tile';
import TileYield from '@civ-clone/core-world/Rules/Yield';
import Yield from '@civ-clone/core-yield/Yield';
import { hasImprovement } from '@civ-clone/base-tile-improvement/lib/lifecycle';
import { hasRiver } from '../../lib/river';

/**
 * A square's own yields, the first steps of `city.cpp` `city_tile_yield`: its terrain's or its special's food, shields
 *  and trade (a special replaces them), then the irrigation and mine bonuses from its terrain's row, then +1 trade for
 *  a river. The road, railroad, government and pollution steps are `yield-modifier`'s. Each part is its own yield, from
 *  the terrain, the special, the improvement or the river, and none is given for 0.
 */
export const getRules = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
): TileYield[] => [
  new TileYield(
    new Criterion((tile: Tile): boolean => terrainIndex(tile.terrain()) >= 0),
    new Effect((tile: Tile): Yield[] => {
      const terrain = tile.terrain(),
        special = specialOf(terrain, terrainFeatureRegistry),
        provider = special
          ? special[0].constructor.name
          : terrainTypes[terrainIndex(terrain)].name,
        [food, shields, trade] = baseYield(terrain, terrainFeatureRegistry)!;

      return (
        [
          [Food, food],
          [Production, shields],
          [Trade, trade],
        ] as [typeof Yield, number][]
      )
        .filter(([, value]) => value !== 0)
        .map(([YieldType, value]) => new YieldType(value, provider));
    })
  ),

  // The bonuses come from the terrain's own row, special or not.
  ...(
    [
      [Food, Irrigation, 5],
      [Production, Mine, 6],
    ] as [typeof Yield, typeof Irrigation, 5 | 6][]
  ).map(
    ([YieldType, Improvement, change]): TileYield =>
      new TileYield(
        new Criterion(hasImprovement(tileImprovementRegistry, Improvement)),
        new Criterion(
          (tile: Tile): boolean =>
            terrainIndex(tile.terrain()) >= 0 &&
            terrainRow(terrainIndex(tile.terrain()))[change][1] > 0
        ),
        new Effect(
          (tile: Tile): Yield =>
            new YieldType(
              terrainRow(terrainIndex(tile.terrain()))[change][1],
              Improvement.name
            )
        )
      )
  ),

  new TileYield(
    new Criterion((tile: Tile): boolean =>
      hasRiver(tile, terrainFeatureRegistry)
    ),
    new Effect((): Yield => new Trade(1, River.name))
  ),
];

export default getRules;
