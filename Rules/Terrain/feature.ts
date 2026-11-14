import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { specialTypes, terrainTypes } from '../../lib/terrainTable';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Feature from '@civ-clone/core-terrain-feature/Rules/Feature';
import { Grassland } from '../../Terrains';
import { Shield } from '../../TerrainFeatures';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import { instance as rngInstance } from '@civ-clone/core-random';

// Interim, until specials are placed as Civilization II places them, by position and the map's seed (`map.cpp`
//  `tile_resource`, `tile_grassland_has_shield`): about the same numbers, drawn at random.

/** One square in 16 has a special (one cell of each 4 by 4 block), either of its terrain's two, equally. */
export const specialChance = 1 / 16;

/** Half of Grassland squares have a shield (`tile_grassland_has_shield`'s diagonal pattern). */
export const shieldChance = 0.5;

/**
 * The `Feature` rules that give a new terrain its special: at most one, unlike independent rolls, which could give a
 *  Desert both an Oasis and Oil. Which special (none, the first or the second) is drawn once per terrain, the first
 *  time a rule asks.
 */
export const getRules = (
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  randomNumberGenerator: () => number = rngInstance
): Feature[] => {
  const slots = new WeakMap<Terrain, 0 | 1 | 2>(),
    slotOf = (terrain: Terrain): 0 | 1 | 2 => {
      if (!slots.has(terrain)) {
        slots.set(
          terrain,
          randomNumberGenerator() < specialChance
            ? randomNumberGenerator() < 0.5
              ? 1
              : 2
            : 0
        );
      }

      return slots.get(terrain)!;
    },
    rule = (
      FeatureType: typeof TerrainFeature,
      TerrainType: typeof Terrain,
      chosen: (terrain: Terrain) => boolean
    ): Feature =>
      new Feature(
        new Criterion(
          (TerrainFeatureType: typeof TerrainFeature): boolean =>
            TerrainFeatureType === FeatureType
        ),
        new Criterion(
          (TerrainFeatureType: typeof TerrainFeature, terrain: Terrain) =>
            terrain instanceof TerrainType
        ),
        new Criterion(
          (TerrainFeatureType: typeof TerrainFeature, terrain: Terrain) =>
            chosen(terrain)
        ),
        new Effect(
          (TerrainFeatureType: typeof TerrainFeature, terrain: Terrain): void =>
            terrainFeatureRegistry.register(new TerrainFeatureType(terrain))
        )
      );

  return [
    ...terrainTypes.flatMap((TerrainType: typeof Terrain, index: number) =>
      ([1, 2] as const)
        .filter((slot) => specialTypes[slot - 1][index] !== null)
        .map(
          (slot): Feature =>
            rule(
              specialTypes[slot - 1][index]!,
              TerrainType,
              (terrain: Terrain): boolean => slotOf(terrain) === slot
            )
        )
    ),
    rule(
      Shield,
      Grassland,
      (): boolean => randomNumberGenerator() < shieldChance
    ),
  ];
};

export default getRules;
