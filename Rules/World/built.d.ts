import { GoodyHutRegistry } from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
import { Engine } from '@civ-clone/core-engine/Engine';
export declare const RIVERS = 'civ2-world:world/built/rivers';
export declare const HUTS = 'civ2-world:world/built/huts';
/**
 * Once the world is built: its rivers, then its huts (`Rules/GoodyHut/distribution`). On Earth, the map's own rivers,
 *  and the specials and Grassland shields its seed places (`lib/earth`), in place of the walk.
 */
export declare const getRules: (
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  goodyHutRegistry?: GoodyHutRegistry,
  ruleRegistry?: RuleRegistry,
  randomNumberGenerator?: () => number,
  engine?: Engine
) => Built[];
export default getRules;
