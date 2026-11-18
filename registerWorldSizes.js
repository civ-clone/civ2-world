"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldSizes_1 = require("./WorldSizes");
const WorldSizeRegistry_1 = require("@civ-clone/core-world-generator/WorldSizeRegistry");
WorldSizeRegistry_1.instance.register(...(0, WorldSizes_1.worldSizes)());
WorldSizeRegistry_1.instance.setCustomLimits(WorldSizes_1.customLimits);
//# sourceMappingURL=registerWorldSizes.js.map