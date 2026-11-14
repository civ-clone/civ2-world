import { GoodyHutRegistry } from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
export declare const RIVERS = 'civ2-world:world/built/rivers';
export declare const HUTS = 'civ2-world:world/built/huts';
/** Once the world is built: its rivers, then its huts (`Rules/GoodyHut/distribution`). */
export declare const getRules: (
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  goodyHutRegistry?: GoodyHutRegistry,
  ruleRegistry?: RuleRegistry,
  randomNumberGenerator?: () => number
) => Built[];
export default getRules;
