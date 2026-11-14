"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TerrainRegistry_1 = require("@civ-clone/core-terrain/TerrainRegistry");
const terrainTable_1 = require("./lib/terrainTable");
TerrainRegistry_1.instance.register(...terrainTable_1.terrainTypes);
//# sourceMappingURL=registerTerrains.js.map