import { River, Shield } from './TerrainFeatures';
import { instance as availableTerrainFeatureRegistryInstance } from '@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry';
import { specialResourceTypes } from './lib/terrainTable';

// River has no `Feature` rule, so it's never placed when a terrain is made: `Rules/World/built` walks the rivers in.
availableTerrainFeatureRegistryInstance.register(
  ...specialResourceTypes,
  Shield,
  River
);
