import { customLimits, worldSizes } from './WorldSizes';
import { instance as worldSizeRegistryInstance } from '@civ-clone/core-world-generator/WorldSizeRegistry';

worldSizeRegistryInstance.register(...worldSizes());
worldSizeRegistryInstance.setCustomLimits(customLimits);
