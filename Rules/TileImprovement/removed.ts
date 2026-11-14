import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
import { removedRules } from '@civ-clone/base-tile-improvement/lib/lifecycle';

export const getRules = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  engine: Engine = engineInstance
): Removed[] =>
  removedRules(
    'civ2-world:tile-improvement/removed',
    tileImprovementRegistry,
    engine
  );

export default getRules;
