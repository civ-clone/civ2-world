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
const core_random_1 = require("@civ-clone/core-random");
const feature_1 = require("../Terrain/feature");
exports.FEATURES = 'civ2-world:terrain-changed/features';
exports.CLEAR_YIELD_CACHE = 'civ2-world:terrain-changed/clear-yield-cache';
/**
 * What a square's features become when its terrain changes, whatever changed it (`map.cpp` `tile_set_terrain`, which
 *  keeps the river bit and replaces only the terrain):
 *  - a river stays (asked as `River`, not base-terrain-feature's `Watercourse`: while this package pins that from a
 *    branch, base-terrain-feature-river has its own copy, and its `Watercourse` is another class);
 *  - a special stays in its slot: a Forest's Pheasant (its first) is a Plains' Buffalo, its Silk (its second) Wheat;
 *    on Grassland, which has none, it's gone;
 *  - a square with no special gets none;
 *  - a square that becomes Grassland rolls for its shield once, here, at the odds a Grassland is made with.
 *
 * The new terrain was made for this change, so everything on it was rolled for it: by its `Created` rules, and, for a
 *  cleared Jungle or Swamp, by the conversion action's own Shield roll as well. All of it is taken off first, or a
 *  Grassland would keep a shield from either roll (three in four, not one in two).
 */
const getRules = (terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, randomNumberGenerator = core_random_1.instance) => {
    // Built on the registry these rules move features in, so the shield can never land in another one.
    const shield = (0, feature_1.shieldRule)(terrainFeatureRegistry, randomNumberGenerator);
    return [
        new TerrainChanged_1.default(exports.FEATURES, new Effect_1.default((0, replaceFeatures_1.default)(terrainFeatureRegistry, (features, to, from) => {
            const toIndex = (0, terrainTable_1.terrainIndex)(to), special = (0, terrainTable_1.specialOf)(from, terrainFeatureRegistry), NewSpecial = special && toIndex >= 0
                ? terrainTable_1.specialTypes[special[1] - 1][toIndex]
                : null, rolled = terrainFeatureRegistry.getByTerrain(to);
            if (rolled.length > 0) {
                terrainFeatureRegistry.unregister(...rolled);
            }
            return [
                ...features
                    .filter((feature) => feature instanceof TerrainFeatures_1.River)
                    .map((feature) => feature.clone(to)),
                ...(NewSpecial ? [new NewSpecial(to)] : []),
                ...(shield.validate(TerrainFeatures_1.Shield, to) ? [new TerrainFeatures_1.Shield(to)] : []),
            ];
        }))),
        // Nothing else works a square's yields out again when its terrain changes (`Tile.setTerrain` doesn't, and nothing
        //  clears the cache at the start of a turn), so the old terrain's yields would stay: for nobody, and for each player.
        new TerrainChanged_1.default(exports.CLEAR_YIELD_CACHE, new Effect_1.default((tile) => {
            tile.clearYieldCache(null);
            playerRegistry.forEach((player) => tile.clearYieldCache(player));
        })),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=terrain-changed.js.map