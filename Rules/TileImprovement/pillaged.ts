import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Pillaged from '@civ-clone/core-tile-improvement/Rules/Pillaged';
import { pillagedRules } from '@civ-clone/base-tile-improvement/lib/lifecycle';

export const getRules = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  engine: Engine = engineInstance
): Pillaged[] => pillagedRules(tileImprovementRegistry, engine);

export default getRules;
