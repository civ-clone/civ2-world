"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.CLEAR_YIELD_CACHE = exports.FEATURES = void 0;
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const terrainTable_1 = require("../../lib/terrainTable");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TerrainFeatures_1 = require("../../TerrainFeatures");
const TerrainChanged_1 = require("@civ-clone/core-world/Rules/TerrainChanged");
const replaceFeatures_1 = require("@civ-clone/base-terrain-feature/lib/replaceFeatures");
exports.FEATURES = 'civ2-world:terrain-changed/features';
exports.CLEAR_YIELD_CACHE = 'civ2-world:terrain-changed/clear-yield-cache';
/**
 * What a square's features become when its terrain changes, whatever changed it (`map.cpp` `tile_set_terrain`, which
 *  keeps the river bit and replaces only the terrain):
 *  - a river stays (asked as `River`, not base-terrain-feature's `Watercourse`: while this package pins that from a
 *    branch, base-terrain-feature-river has its own copy, and its `Watercourse` is another class);
 *  - a special stays in its slot: a Forest's Pheasant (its first) is a Plains' Buffalo, its Silk (its second) Wheat;
 *    on Grassland, which has none, it's gone;
 *  - a square with no special gets none, so any special the new terrain was given when it was made is taken off it,
 *    but a Grassland's shield, which is the square's own pattern rather than a special, is left as it was rolled.
 */
const getRules = (terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance) => [
    new TerrainChanged_1.default(exports.FEATURES, new Effect_1.default((0, replaceFeatures_1.default)(terrainFeatureRegistry, (features, to, from) => {
        const toIndex = (0, terrainTable_1.terrainIndex)(to), special = (0, terrainTable_1.specialOf)(from, terrainFeatureRegistry), NewSpecial = special && toIndex >= 0
            ? terrainTable_1.specialTypes[special[1] - 1][toIndex]
            : null, rolled = terrainFeatureRegistry
            .getByTerrain(to)
            .filter((feature) => (0, terrainTable_1.specialSlot)(toIndex, feature) !== 0);
        if (rolled.length > 0) {
            terrainFeatureRegistry.unregister(...rolled);
        }
        return [
            ...features
                .filter((feature) => feature instanceof TerrainFeatures_1.River)
                .map((feature) => feature.clone(to)),
            ...(NewSpecial ? [new NewSpecial(to)] : []),
        ];
    }))),
    // Nothing else works a square's yields out again when its terrain changes (`Tile.setTerrain` doesn't, and nothing
    //  clears the cache at the start of a turn), so the old terrain's yields would stay: for nobody, and for each player.
    new TerrainChanged_1.default(exports.CLEAR_YIELD_CACHE, new Effect_1.default((tile) => {
        tile.clearYieldCache(null);
        playerRegistry.forEach((player) => tile.clearYieldCache(player));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=terrain-changed.js.map