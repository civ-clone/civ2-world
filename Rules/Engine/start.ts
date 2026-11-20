import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  RuleRegistry,
  instance as ruleRegistryInstances,
} from '@civ-clone/core-rule/RuleRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Start from '@civ-clone/core-engine/Rules/Start';
import { normal } from '../../WorldSizes';
import startWorld from '@civ-clone/base-world-start/lib/startWorld';

/**
 * The grids a world can be laid out on: Civilization II's own staggered isometric grid, its default, and the square and
 *  hexagonal grids, which the generator, rivers, specials and huts all follow by the grid's own edges
 *  (civ-clone/web-renderer#1249). Its Earth is always on its own grid (civ2-earth-generator).
 */
export const topologyIds = ['staggered-iso', 'square', 'hex-odd-r'];

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstances,
  engine: Engine = engineInstance
): Start[] => [
  new Start(
    new Effect((): void => {
      startWorld(ruleRegistry, engine, {
        defaults: {
          topologyId: 'staggered-iso',
          // A normal map: 50 squares across (100 in Civilization II's doubled x) and 80 down, like `WORLD_M.MP`.
          height: normal.height,
          width: normal.width,
          // A normal land mass (`mapgen_place_landmasses`: about 1,280 of 4,000 squares), taking the encoding of
          //  "normal" as 0, which isn't confirmed.
          landCoverage: 0.32,
          landSize: 0.2,
          maxIterations: 20,
        },
        topologyIds,
      });
    })
  ),
];

export default getRules;
