"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.deriveAvailableRules = exports.conditions = void 0;
const available_1 = require("@civ-clone/base-tile-improvement/lib/available");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Requirements_1 = require("../../Requirements");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const river_1 = require("../../lib/river");
const TileImprovements_1 = require("../../TileImprovements");
/** How `Requirements`' conditions are decided for a square. */
const conditions = (terrainFeatureRegistry, tileImprovementRegistry, cityRegistry = CityRegistry_1.instance) => ({
    [Requirements_1.IRRIGATION_SOURCE.id]: (tile) => (0, river_1.isIrrigationSource)(tile, terrainFeatureRegistry, tileImprovementRegistry),
    [Requirements_1.RIVER.id]: (tile) => (0, river_1.hasRiver)(tile, terrainFeatureRegistry),
    [Requirements_1.NO_RIVER.id]: (tile) => !(0, river_1.hasRiver)(tile, terrainFeatureRegistry),
    [Requirements_1.NO_FORTRESS.id]: (tile) => !tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Fortress),
    [Requirements_1.NO_CITY.id]: (tile) => cityRegistry.getByTile(tile) === null,
});
exports.conditions = conditions;
/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
const deriveAvailableRules = (playerResearchRegistry, tileImprovementRegistry, terrainFeatureRegistry, cityRegistry = CityRegistry_1.instance) => (0, available_1.deriveAvailableRules)(playerResearchRegistry, tileImprovementRegistry, (0, exports.conditions)(terrainFeatureRegistry, tileImprovementRegistry, cityRegistry));
exports.deriveAvailableRules = deriveAvailableRules;
/** Every rule about where tile improvements can go, one for each of `Requirements`' entries (for tests). */
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, cityRegistry = CityRegistry_1.instance) => (0, available_1.availableRules)(Requirements_1.availableRequirements, playerResearchRegistry, tileImprovementRegistry, (0, exports.conditions)(terrainFeatureRegistry, tileImprovementRegistry, cityRegistry));
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=available.js.map