import { Engine } from '@civ-clone/core-engine/Engine';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Start from '@civ-clone/core-engine/Rules/Start';
/**
 * The grids a world can be laid out on: Civilization II's own staggered isometric grid, its default, and the square and
 *  hexagonal grids, which the generator, rivers, specials and huts all follow by the grid's own edges
 *  (civ-clone/web-renderer#1249). Its Earth is always on its own grid (civ2-earth-generator).
 */
export declare const topologyIds: string[];
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => Start[];
export default getRules;
