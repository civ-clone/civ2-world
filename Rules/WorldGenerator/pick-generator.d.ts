import { GeneratorRegistry } from '@civ-clone/core-world-generator/GeneratorRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import PickGenerator from '@civ-clone/core-world-generator/Rules/PickGenerator';
export declare const getRules: (
  generatorRegistry?: GeneratorRegistry,
  randomNumberGenerator?: () => number,
  engine?: Engine
) => PickGenerator[];
export default getRules;
