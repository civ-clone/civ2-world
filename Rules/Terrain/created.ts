import {
  AvailableTerrainFeatureRegistry,
  instance as availableTerrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Created from '@civ-clone/core-terrain/Rules/Created';
import Effect from '@civ-clone/core-rule/Effect';
import placeFeatures from '@civ-clone/base-terrain-feature/lib/placeFeatures';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  availableTerrainFeatureRegistry: AvailableTerrainFeatureRegistry = availableTerrainFeatureRegistryInstance
): Created[] => [
  new Created(
    new Effect(placeFeatures(ruleRegistry, availableTerrainFeatureRegistry))
  ),
];

export default getRules;
