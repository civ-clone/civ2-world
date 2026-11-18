"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldSizes_1 = require("./WorldSizes");
const WorldSizeRegistry_1 = require("@civ-clone/core-world-generator/WorldSizeRegistry");
// Only the sizes not registered yet: this module run a second time (a second copy of the package, say) registers nothing
//  more, where registering a key twice would refuse it.
WorldSizeRegistry_1.instance.register(...(0, WorldSizes_1.worldSizes)().filter((size) => WorldSizeRegistry_1.instance.getByKey(size.key()) === null));
WorldSizeRegistry_1.instance.setCustomLimits(WorldSizes_1.customLimits);
//# sourceMappingURL=registerWorldSizes.js.map