import { customLimits, worldSizes } from './WorldSizes';
import { instance as worldSizeRegistryInstance } from '@civ-clone/core-world-generator/WorldSizeRegistry';

// Only the sizes not registered yet: this module run a second time (a second copy of the package, say) registers nothing
//  more, where registering a key twice would refuse it.
worldSizeRegistryInstance.register(
  ...worldSizes().filter(
    (size) => worldSizeRegistryInstance.getByKey(size.key()) === null
  )
);
worldSizeRegistryInstance.setCustomLimits(customLimits);
