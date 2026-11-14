import {
  GoodyHutRegistry,
  instance as goodyHutRegistryInstance,
} from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import World from '@civ-clone/core-world/World';
import { distributeHuts } from '@civ-clone/base-goody-hut/lib/placement';
import placeRivers from '../../lib/placeRivers';
import { instance as rngInstance } from '@civ-clone/core-random';

export const RIVERS = 'civ2-world:world/built/rivers';
export const HUTS = 'civ2-world:world/built/huts';

/** Once the world is built: its rivers, then its huts (`Rules/GoodyHut/distribution`). */
export const getRules = (
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  goodyHutRegistry: GoodyHutRegistry = goodyHutRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  randomNumberGenerator: () => number = rngInstance
): Built[] => [
  new Built(
    RIVERS,
    new Effect((world: World): void => {
      placeRivers(world, terrainFeatureRegistry, randomNumberGenerator);
    })
  ),
  new Built(HUTS, new Effect(distributeHuts(goodyHutRegistry, ruleRegistry))),
];

export default getRules;
