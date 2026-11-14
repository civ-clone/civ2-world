import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { specialOf, specialTypes, terrainIndex } from '../../lib/terrainTable';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import { River, Shield } from '../../TerrainFeatures';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import replaceFeatures from '@civ-clone/base-terrain-feature/lib/replaceFeatures';
import { instance as rngInstance } from '@civ-clone/core-random';
import { shieldRule } from '../Terrain/feature';

export const FEATURES = 'civ2-world:terrain-changed/features';
export const CLEAR_YIELD_CACHE = 'civ2-world:terrain-changed/clear-yield-cache';

/**
 * What a square's features become when its terrain changes, whatever changed it (`map.cpp` `tile_set_terrain`, which
 *  keeps the river bit and replaces only the terrain):
 *  - a river stays (asked as `River`, not base-terrain-feature's `Watercourse`: while this package pins that from a
 *    branch, base-terrain-feature-river has its own copy, and its `Watercourse` is another class);
 *  - a special stays in its slot: a Forest's Pheasant (its first) is a Plains' Buffalo, its Silk (its second) Wheat;
 *    on Grassland, which has none, it's gone;
 *  - a square with no special gets none;
 *  - a square that becomes Grassland rolls for its shield once, here, at the odds a Grassland is made with.
 *
 * The new terrain was made for this change, so everything on it was rolled for it: by its `Created` rules, and, for a
 *  cleared Jungle or Swamp, by the conversion action's own Shield roll as well. All of it is taken off first, or a
 *  Grassland would keep a shield from either roll (three in four, not one in two).
 */
export const getRules = (
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  randomNumberGenerator: () => number = rngInstance
): TerrainChanged[] => {
  // Built on the registry these rules move features in, so the shield can never land in another one.
  const shield = shieldRule(terrainFeatureRegistry, randomNumberGenerator);

  return [
    new TerrainChanged(
      FEATURES,
      new Effect(
        replaceFeatures(
          terrainFeatureRegistry,
          (
            features: TerrainFeature[],
            to: Terrain,
            from: Terrain
          ): TerrainFeature[] => {
            const toIndex = terrainIndex(to),
              special = specialOf(from, terrainFeatureRegistry),
              NewSpecial =
                special && toIndex >= 0
                  ? specialTypes[special[1] - 1][toIndex]
                  : null,
              rolled = terrainFeatureRegistry.getByTerrain(to);

            if (rolled.length > 0) {
              terrainFeatureRegistry.unregister(...rolled);
            }

            return [
              ...features
                .filter(
                  (feature: TerrainFeature): boolean => feature instanceof River
                )
                .map((feature: TerrainFeature) => feature.clone(to)),
              ...(NewSpecial ? [new NewSpecial(to)] : []),
              ...(shield.validate(Shield, to) ? [new Shield(to)] : []),
            ];
          }
        )
      )
    ),
    // Nothing else works a square's yields out again when its terrain changes (`Tile.setTerrain` doesn't, and nothing
    //  clears the cache at the start of a turn), so the old terrain's yields would stay: for nobody, and for each player.
    new TerrainChanged(
      CLEAR_YIELD_CACHE,
      new Effect((tile: Tile): void => {
        tile.clearYieldCache(null);

        playerRegistry.forEach((player: Player): void =>
          tile.clearYieldCache(player)
        );
      })
    ),
  ];
};

export default getRules;
