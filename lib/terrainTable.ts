import {
  Buffalo,
  Coal,
  Fish,
  Fruit,
  Furs,
  Game,
  Gems,
  Gold,
  Iron,
  Ivory,
  Oasis,
  Oil,
  Peat,
  Pheasant,
  Shield,
  Silk,
  Spice,
  Whales,
  Wheat,
  Wine,
} from '../TerrainFeatures';
import {
  Desert,
  Forest,
  Glacier,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  Swamp,
  Tundra,
} from '../Terrains';
import {
  GRASSLAND,
  SpecialRow,
  TerrainRow,
  specials,
  terrains,
} from '../data/terrain';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';

/** The terrain classes, by Civilization II's terrain index (`data/terrain`). */
export const terrainTypes: (typeof Terrain)[] = [
  Desert,
  Plains,
  Grassland,
  Forest,
  Hills,
  Mountains,
  Tundra,
  Glacier,
  Swamp,
  Jungle,
  Ocean,
];

/**
 * The special resources, `specialTypes[slot - 1][terrain index]`. Grassland's are `null`: a Grassland square never has
 *  one, and its shield is the `Shield` feature instead. Oil is the second special of both Desert and Glacier.
 */
export const specialTypes: [
  (typeof TerrainFeature | null)[],
  (typeof TerrainFeature | null)[]
] = [
  [Oasis, Buffalo, null, Pheasant, Coal, Gold, Game, Ivory, Peat, Gems, Fish],
  [Oil, Wheat, null, Silk, Wine, Iron, Furs, Oil, Spice, Fruit, Whales],
];

/** Every special resource class, once each. */
export const specialResourceTypes: (typeof TerrainFeature)[] = [
  ...new Set(
    [...specialTypes[0], ...specialTypes[1]].filter(
      (Type): Type is typeof TerrainFeature => Type !== null
    )
  ),
];

/** The terrain index of `terrain`, or -1 for a terrain that isn't one of Civilization II's. */
export const terrainIndex = (terrain: Terrain): number =>
  terrainTypes.findIndex(
    (TerrainType: typeof Terrain): boolean => terrain instanceof TerrainType
  );

/** Which special of terrain `index` `feature` is: 1 or 2, or 0 if it isn't one. */
export const specialSlot = (
  index: number,
  feature: TerrainFeature
): 0 | 1 | 2 => {
  if (index < 0) {
    return 0;
  }

  if (specialTypes[0][index] && feature instanceof specialTypes[0][index]!) {
    return 1;
  }

  if (specialTypes[1][index] && feature instanceof specialTypes[1][index]!) {
    return 2;
  }

  return 0;
};

/** The special resource `terrain` holds, and which of its two it is, if any. */
export const specialOf = (
  terrain: Terrain,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
): [TerrainFeature, 1 | 2] | null => {
  const index = terrainIndex(terrain);

  for (const feature of terrainFeatureRegistry.getByTerrain(terrain)) {
    const slot = specialSlot(index, feature);

    if (slot !== 0) {
      return [feature, slot];
    }
  }

  return null;
};

export const terrainRow = (index: number): TerrainRow => terrains[index];

export const specialRow = (index: number, slot: 1 | 2): SpecialRow =>
  specials[slot - 1][index];

/**
 * A square's food, shields and trade before anything is built on it (`city.cpp` `city_tile_yield`, step 1): its
 *  special's row if it has one, otherwise its terrain's, and no shield on Grassland without its `Shield`. `null` for a
 *  terrain that isn't one of Civilization II's.
 */
export const baseYield = (
  terrain: Terrain,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
): [food: number, shields: number, trade: number] | null => {
  const index = terrainIndex(terrain);

  if (index < 0) {
    return null;
  }

  const special = specialOf(terrain, terrainFeatureRegistry),
    [, , food, shields, trade] = special
      ? specialRow(index, special[1])
      : terrainRow(index);

  if (
    index === GRASSLAND &&
    !terrainFeatureRegistry
      .getByTerrain(terrain)
      .some((feature: TerrainFeature): boolean => feature instanceof Shield)
  ) {
    return [food, 0, trade];
  }

  return [food, shields, trade];
};
