import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { Glacier, Hills, Mountains } from '../Terrains';
import { River } from '../TerrainFeatures';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { hasRiver } from './river';

// Interim, until Civilization II's own river walk is ported with its generator (`map.cpp` `mapgen_place_rivers`).
//  The same shape: a river starts on a random square, runs along edges (`Tile.getAdjacent`) and ends at the sea or at
//  another river, and one that's too short isn't kept. Here it never runs uphill, which with no heights on the map
//  means never away from the nearest sea: it may wander along a level, but never back over itself, so it ends. Civilization II's rivers also change the terrain they cross
//  (Hills and Mountains to Grassland, and so on); these don't, and keep off the terrains that would change.

/** About 14 rivers on a normal map of about 1,300 land squares (`12 + 2 × land mass + 2 × climate`): one per 90. */
export const landSquaresPerRiver = 90;

/** A river must cross at least this many squares (`5 − attempts / 800` in Civilization II). */
export const minimumLength = 4;

/** Civilization II gives up after this many tries. */
export const maximumAttempts = 1024;

/** Where these rivers don't run: the terrains Civilization II's would change as they crossed them. */
export const unriverable: (typeof Terrain)[] = [Glacier, Hills, Mountains];

const canCarry = (tile: Tile): boolean =>
  tile.isLand() &&
  !unriverable.some((TerrainType) => tile.terrain() instanceof TerrainType);

/** How many edge steps each land square is from the sea. */
export const distanceToSea = (world: World): Map<Tile, number> => {
  const distances = new Map<Tile, number>(),
    queue: Tile[] = world.filter((tile: Tile): boolean => tile.isWater());

  queue.forEach((tile: Tile) => distances.set(tile, 0));

  for (let index = 0; index < queue.length; index++) {
    const tile = queue[index],
      distance = distances.get(tile)!;

    tile.getAdjacent().forEach((neighbour: Tile): void => {
      if (neighbour.isLand() && !distances.has(neighbour)) {
        distances.set(neighbour, distance + 1);
        queue.push(neighbour);
      }
    });
  }

  return distances;
};

/** Gives `world` its rivers, as `River` features on each square's terrain. Returns each river's squares, source first. */
export const placeRivers = (
  world: World,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  randomNumberGenerator: () => number
): Tile[][] => {
  const distances = distanceToSea(world),
    starts = world.filter(
      (tile: Tile): boolean => canCarry(tile) && (distances.get(tile) ?? 0) >= 2
    ),
    landSquares = world.filter((tile: Tile): boolean => tile.isLand()).length,
    target = Math.round(landSquares / landSquaresPerRiver),
    rivers: Tile[][] = [];

  for (
    let attempt = 0;
    attempt < maximumAttempts && rivers.length < target && starts.length > 0;
    attempt++
  ) {
    const start = starts[Math.floor(randomNumberGenerator() * starts.length)];

    if (hasRiver(start, terrainFeatureRegistry)) {
      continue;
    }

    const river: Tile[] = [start];
    let current = start,
      ended = false;

    while (!ended) {
      const neighbours = current.getAdjacent();

      // At the sea, or joining another river.
      if (
        neighbours.some(
          (tile: Tile): boolean =>
            tile.isWater() || hasRiver(tile, terrainFeatureRegistry)
        )
      ) {
        ended = true;

        break;
      }

      const downhill = neighbours.filter(
        (tile: Tile): boolean =>
          canCarry(tile) &&
          !river.includes(tile) &&
          (distances.get(tile) ?? Infinity) <= distances.get(current)!
      );

      if (downhill.length === 0) {
        break;
      }

      current = downhill[Math.floor(randomNumberGenerator() * downhill.length)];
      river.push(current);
    }

    if (!ended || river.length < minimumLength) {
      continue;
    }

    terrainFeatureRegistry.register(
      ...river.map((tile: Tile): River => new River(tile.terrain()))
    );

    rivers.push(river);
  }

  return rivers;
};

export default placeRivers;
