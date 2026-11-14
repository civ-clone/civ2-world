"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TerrainFeatures_1 = require("./TerrainFeatures");
const AvailableTerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry");
const terrainTable_1 = require("./lib/terrainTable");
// River has no `Feature` rule, so it's never placed when a terrain is made: `Rules/World/built` walks the rivers in.
AvailableTerrainFeatureRegistry_1.instance.register(...terrainTable_1.specialResourceTypes, TerrainFeatures_1.Shield, TerrainFeatures_1.River);
//# sourceMappingURL=registerTerrainFeatures.js.map