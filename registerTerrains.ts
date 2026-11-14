import { instance as terrainRegistryInstance } from '@civ-clone/core-terrain/TerrainRegistry';
import { terrainTypes } from './lib/terrainTable';

terrainRegistryInstance.register(...terrainTypes);
