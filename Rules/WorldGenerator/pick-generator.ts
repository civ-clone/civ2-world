import {
  GeneratorRegistry,
  instance as generatorRegistryInstance,
} from '@civ-clone/core-world-generator/GeneratorRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Earth from '@civ-clone/civ2-earth-generator/Earth';
import Effect from '@civ-clone/core-rule/Effect';
import { isEarth } from '../../lib/earth';
import PickGenerator from '@civ-clone/core-world-generator/Rules/PickGenerator';
import pickGenerator from '@civ-clone/base-world-start/lib/pickGenerator';
import { instance as rngInstance } from '@civ-clone/core-random';

export const getRules = (
  generatorRegistry: GeneratorRegistry = generatorRegistryInstance,
  randomNumberGenerator: () => number = rngInstance,
  engine: Engine = engineInstance
): PickGenerator[] => [
  // Civilization II's own Earth, when the game asks for it (`earth`, as civ1-world's), or one of the generators.
  new PickGenerator(
    new Effect(() =>
      isEarth(engine)
        ? Earth
        : pickGenerator(generatorRegistry, randomNumberGenerator)
    )
  ),
];

export default getRules;
