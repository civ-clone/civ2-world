import {
  GoodyHutRegistry,
  instance as goodyHutRegistryInstance,
} from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import {
  chance,
  noHutWithin,
  onLand,
} from '@civ-clone/base-goody-hut/lib/placement';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import { earthMapOf } from '../../lib/earth';
import Criterion from '@civ-clone/core-rule/Criterion';
import Tile from '@civ-clone/core-world/Tile';
import { hutAt } from '../../lib/positional';
import { toDoubled } from '@civ-clone/civ2-earth-generator';
import Distribution from '@civ-clone/core-goody-hut/Rules/Distribution';
import { instance as rngInstance } from '@civ-clone/core-random';

// Interim, until huts are placed as Civilization II places them, by position and the map's seed (`map.cpp`
//  `tile_has_hut`: one land square in two 4 by 4 blocks): a hut on about 1 land square in 32, none next to another.
export const hutChance = 1 / 32;

// On Earth, the map's seed places them, as Civilization II does: where `tile_has_hut` says, and nowhere else.

export const getRules = (
  goodyHutRegistry: GoodyHutRegistry = goodyHutRegistryInstance,
  randomNumberGenerator: () => number = rngInstance,
  engine: Engine = engineInstance
): Distribution[] => {
  const nearby = noHutWithin(1, goodyHutRegistry),
    roll = chance(hutChance, randomNumberGenerator),
    seeded = (tile: Tile): boolean | null => {
      const map = earthMapOf(tile.map(), engine);

      if (map === null) {
        return null;
      }

      const { x, y } = toDoubled({ x: tile.x(), y: tile.y() });

      return hutAt(x, y, map.seed);
    };

  return [
    new Distribution(new Criterion(onLand)),
    new Distribution(
      new Criterion(
        (tile: Tile): boolean => seeded(tile) ?? (nearby(tile) && roll())
      )
    ),
  ];
};

export default getRules;
