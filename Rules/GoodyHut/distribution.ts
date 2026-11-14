import {
  GoodyHutRegistry,
  instance as goodyHutRegistryInstance,
} from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import {
  chance,
  noHutWithin,
  onLand,
} from '@civ-clone/base-goody-hut/lib/placement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Distribution from '@civ-clone/core-goody-hut/Rules/Distribution';
import { instance as rngInstance } from '@civ-clone/core-random';

// Interim, until huts are placed as Civilization II places them, by position and the map's seed (`map.cpp`
//  `tile_has_hut`: one land square in two 4 by 4 blocks): a hut on about 1 land square in 32, none next to another.
export const hutChance = 1 / 32;

export const getRules = (
  goodyHutRegistry: GoodyHutRegistry = goodyHutRegistryInstance,
  randomNumberGenerator: () => number = rngInstance
): Distribution[] => [
  new Distribution(new Criterion(onLand)),
  new Distribution(new Criterion(noHutWithin(1, goodyHutRegistry))),
  new Distribution(new Criterion(chance(hutChance, randomNumberGenerator))),
];

export default getRules;
