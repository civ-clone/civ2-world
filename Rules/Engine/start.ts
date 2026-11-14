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
import startWorld from '@civ-clone/base-world-start/lib/startWorld';

/** Civilization II's maps are staggered isometric: specials, huts and rivers all follow its edges. */
export const topologyIds = ['staggered-iso'];

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
          height: 80,
          width: 50,
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
