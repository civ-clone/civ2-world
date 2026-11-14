"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIrrigationSource = exports.hasRiver = void 0;
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const TileImprovements_1 = require("../TileImprovements");
const TerrainFeatures_1 = require("../TerrainFeatures");
/** Whether a river runs through `tile`. */
const hasRiver = (tile, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => terrainFeatureRegistry
    .getByTerrain(tile.terrain())
    .some((feature) => feature instanceof TerrainFeatures_1.River);
exports.hasRiver = hasRiver;
/**
 * Whether `tile` can be irrigated from water: it, or a square sharing one of its edges, is ocean, has a river, or is
 *  irrigated (`map.cpp` `tile_has_irrigation_source`: the four edge directions and the square itself). A city isn't a
 *  source in itself: founding one takes the square's irrigation away.
 */
const isIrrigationSource = (tile, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => [tile, ...tile.getAdjacent()].some((source) => source.isWater() ||
    (0, exports.hasRiver)(source, terrainFeatureRegistry) ||
    tileImprovementRegistry
        .getByTile(source)
        .some((improvement) => improvement instanceof TileImprovements_1.Irrigation));
exports.isIrrigationSource = isIrrigationSource;
//# sourceMappingURL=river.js.map