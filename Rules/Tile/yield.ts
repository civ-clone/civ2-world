import { Food, Production, Trade } from '../../Yields';
import { Irrigation, Mine } from '../../TileImprovements';
import TerrainFeatureRegistry, {
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { YES } from '../../data/terrain';
import {
  baseYield,
  specialOf,
  terrainIndex,
  terrainRow,
  terrainTypes,
} from '../../lib/terrainTable';
import Criterion from '@civ-clone/core-rule/Criterion';
import Description from '@civ-clone/core-rule/Description';
import Effect from '@civ-clone/core-rule/Effect';
import { River } from '../../TerrainFeatures';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import TileYield from '@civ-clone/core-world/Rules/Yield';
import Yield from '@civ-clone/core-yield/Yield';
import { hasImprovement } from '@civ-clone/base-tile-improvement/lib/lifecycle';
import { hasRiver } from '../../lib/river';

/** The yields each of `[food, shields, trade]` is, in `baseYield`'s order. */
export const baseYieldTypes: [typeof Yield, typeof Yield, typeof Yield] = [
  Food,
  Production,
  Trade,
];

/**
 * What a square of each terrain gives with no special resource or anything else on it, as `baseYield` says (so
 *  Grassland's shield, which comes only with its `Shield`, isn't counted), for the Civilopedia
 *  (civ-clone/web-renderer#620): one line per yield that isn't 0.
 */
export const terrainYieldDescription = (): Description =>
  new Description(
    ...terrainTypes.flatMap((TerrainType: typeof Terrain) =>
      // A terrain of the class, made without its constructor, which would take an id and run the `Created` rules.
      baseYield(
        Object.create(TerrainType.prototype) as Terrain,
        new TerrainFeatureRegistry()
      )!
        .map((value: number, index: number) => ({
          type: 'terrain_yield',
          subject: TerrainType,
          yield: baseYieldTypes[index],
          value,
        }))
        .filter(({ value }) => value !== 0)
    )
  );

/**
 * What irrigation (`change` 5) or a mine (6) adds on each terrain it's built on in place (`@TERRAIN`'s result `yes`),
 *  from that terrain's row, where it adds anything.
 */
export const improvementYieldDescription = (
  YieldType: typeof Yield,
  Improvement: typeof Irrigation,
  change: 5 | 6
): Description =>
  new Description(
    ...terrainTypes.flatMap((TerrainType: typeof Terrain, index: number) => {
      const [result, bonus] = terrainRow(index)[change];

      return result === YES && bonus > 0
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
    })
  );

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

      return [food, shields, trade]
        .map((value: number, index: number): [typeof Yield, number] => [
          baseYieldTypes[index],
          value,
        ])
        .filter(([, value]) => value !== 0)
        .map(([YieldType, value]) => new YieldType(value, provider));
    }),
    terrainYieldDescription()
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
        ),
        improvementYieldDescription(YieldType, Improvement, change)
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
