import { GoodyHutRegistry } from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import Distribution from '@civ-clone/core-goody-hut/Rules/Distribution';
export declare const hutChance: number;
export declare const getRules: (
  goodyHutRegistry?: GoodyHutRegistry,
  randomNumberGenerator?: () => number,
  engine?: Engine
) => Distribution[];
export default getRules;
