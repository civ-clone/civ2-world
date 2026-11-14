import { Engine } from '@civ-clone/core-engine/Engine';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Start from '@civ-clone/core-engine/Rules/Start';
/** Civilization II's maps are staggered isometric: specials, huts and rivers all follow its edges. */
export declare const topologyIds: string[];
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => Start[];
export default getRules;
