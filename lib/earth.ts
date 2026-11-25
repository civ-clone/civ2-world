// Civilization II's Earth (civ2-earth-generator), as the original sets a map it loads up for a game (`map_generate`
//  with the map kept): the map's own rivers; specials and Grassland shields where the map's seed puts them, in place of
//  the interim random ones, but none on an ocean square with no land within a city's reach
//  (`mapgen_hide_far_ocean_resources`); and huts where the seed puts them (`Rules/GoodyHut/distribution`).

import {
  EarthMap,
  earthGeneratorId,
  findEarthMap,
  playedSquares,
  toDoubled,
} from '@civ-clone/civ2-earth-generator';
import { GRASSLAND, OCEAN } from '../data/terrain';
import { River, Shield } from '../TerrainFeatures';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { shieldAt, specialAt } from './positional';
import { specialSlot, specialTypes, terrainIndex } from './terrainTable';
import Tile from '@civ-clone/core-world/Tile';
import World, { IWorld } from '@civ-clone/core-world/World';
import fatCross from '@civ-clone/base-city-tiles-fat-cross/lib/fatCross';

/**
 * Whether `world` is the Earth: made by civ2-earth-generator's `Earth`, as the world records (`generatorId()`) and keeps
 *  in a save. The engine's `earth` option is what chooses that generator (`Rules/WorldGenerator/pick-generator`), before
 *  there is a world, and isn't saved, so a rule that read it after a load was told "no" (civ-clone/web-renderer#175).
 */
export const isEarth = (world: IWorld | null): boolean =>
  // A square of no world (as a rule's own test makes) isn't the Earth's.
  world !== null && world.generatorId() === earthGeneratorId;

/** The Earth map `world` was made from, when it's the Earth. */
export const earthMapOf = (world: World | null): EarthMap | null =>
  world !== null && isEarth(world)
    ? findEarthMap(world.width(), world.height())
    : null;

/** The special the seed puts on `tile`, as which of its terrain's two, or 0. */
export const seededSpecial = (tile: Tile, seed: number): 0 | 1 | 2 => {
  const index = terrainIndex(tile.terrain()),
    { x, y } = toDoubled({ x: tile.x(), y: tile.y() });

  if (index < 0) {
    return 0;
  }

  const slot = specialAt(x, y, seed, index);

  // An ocean special out of every city's reach is hidden.
  if (
    slot !== 0 &&
    index === OCEAN &&
    !fatCross(tile).some((square: Tile): boolean => square.isLand())
  ) {
    return 0;
  }

  return slot;
};

/** Whether the seed's pattern gives Grassland `tile` a shield. */
export const seededShield = (tile: Tile): boolean => {
  const { x, y } = toDoubled({ x: tile.x(), y: tile.y() });

  return shieldAt(x, y);
};

/**
 * Sets `world`, made from `map`, up as the original does: each square's specials and shield are the seed's, in place of
 *  any rolled as its terrain was made, and the map's rivers run where they do.
 */
export const placeEarth = (
  world: World,
  map: EarthMap,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
): void => {
  const squares = playedSquares(map);

  world.forEach((tile: Tile): void => {
    const terrain = tile.terrain(),
      index = terrainIndex(terrain);

    terrainFeatureRegistry
      .getByTerrain(terrain)
      .filter(
        (feature) =>
          feature instanceof Shield || specialSlot(index, feature) !== 0
      )
      .forEach((feature) => terrainFeatureRegistry.unregister(feature));

    if (index === GRASSLAND) {
      if (seededShield(tile)) {
        terrainFeatureRegistry.register(new Shield(terrain));
      }
    } else {
      const slot = seededSpecial(tile, map.seed),
        SpecialType = slot === 0 ? null : specialTypes[slot - 1][index];

      if (SpecialType) {
        terrainFeatureRegistry.register(new SpecialType(terrain));
      }
    }

    if (squares[tile.y() * map.width + tile.x()]!.river) {
      terrainFeatureRegistry.register(new River(terrain));
    }
  });
};

export default placeEarth;
