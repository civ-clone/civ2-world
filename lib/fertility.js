"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fertility = exports.terrainScore = void 0;
const terrain_1 = require("../data/terrain");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const terrainTable_1 = require("./terrainTable");
const TerrainFeatures_1 = require("../TerrainFeatures");
const fatCross_1 = require("@civ-clone/base-city-tiles-fat-cross/lib/fatCross");
const river_1 = require("./river");
// How good a city site a square is, as Civilization II works it out once the map is made (OpenCiv2 `src/auto/map.cpp`
//  `mapgen_calc_fertility`, richardpenman/civ2@49f26ec). Only Grassland and Plains have a fertility, 8 to 15; every
//  other square has 0. The game reads it for huts (`unit_enter_hut`), the computer players' settlers and starts.
/**
 * What a square of terrain row `row` adds: 3 × food + trade, + 2 × shields except on Grassland, then + 3 for Hills or
 *  + 1 for another terrain mined in place, or + 2 for one irrigated in place. Rows 0 to 10 are the terrains and 11 to 21
 *  their first special: any special counts as the first (the game indexes the table by terrain + 11).
 */
const terrainScore = (row) => {
    const terrain = row % 11, [, , food, shields, trade] = row < 11 ? terrain_1.terrains[row] : terrain_1.specials[0][terrain], [, , , , , [irrigateTo], [mineTo]] = terrain_1.terrains[terrain];
    let score = food * 3 + trade;
    if (terrain !== terrain_1.GRASSLAND) {
        score += shields * 2;
    }
    if (mineTo === terrain_1.YES) {
        score += terrain === terrain_1.HILLS ? 3 : 1;
    }
    else if (irrigateTo === terrain_1.YES) {
        score += 2;
    }
    return score;
};
exports.terrainScore = terrainScore;
const hasShield = (tile, terrainFeatureRegistry) => terrainFeatureRegistry
    .getByTerrain(tile.terrain())
    .some((feature) => feature instanceof TerrainFeatures_1.Shield);
/**
 * One of the 21 squares a city there would work, scored: Grassland with its shield + 2, the terrain's score (its
 *  special's, but never for the centre), + 1 for a river; then the 8 squares beside the centre count twice, the others
 *  once, and the centre four times (six times on a river).
 */
const squareScore = (tile, ring, terrainFeatureRegistry) => {
    const index = (0, terrainTable_1.terrainIndex)(tile.terrain());
    if (index < 0) {
        return 0;
    }
    const river = (0, river_1.hasRiver)(tile, terrainFeatureRegistry);
    let score = 0;
    if (index === terrain_1.GRASSLAND && hasShield(tile, terrainFeatureRegistry)) {
        score += 2;
    }
    score += (0, exports.terrainScore)(ring !== 'centre' && (0, terrainTable_1.specialOf)(tile.terrain(), terrainFeatureRegistry)
        ? index + 11
        : index);
    if (river) {
        score += 1;
    }
    if (ring === 'inner') {
        return score * 2;
    }
    if (ring === 'centre') {
        return river ? score * 4 + score * 2 : score * 4;
    }
    return score;
};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
/**
 * The fertility Civilization II gives `tile` when the map is made: 0 unless it is Grassland or Plains, otherwise the
 *  21 squares' scores added up (16 less on Grassland without its shield), then `(total − 120) / 8` kept to 1 to 15,
 *  halved, + 8. The game lowers it later around a city (`city_refresh_area_tiles`); that is the caller's to apply.
 */
const fertility = (tile, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => {
    const index = (0, terrainTable_1.terrainIndex)(tile.terrain());
    if (index !== terrain_1.GRASSLAND && index !== terrain_1.PLAINS) {
        return 0;
    }
    const inner = tile.getNeighbours();
    let total = squareScore(tile, 'centre', terrainFeatureRegistry);
    inner.forEach((neighbour) => {
        total += squareScore(neighbour, 'inner', terrainFeatureRegistry);
    });
    (0, fatCross_1.default)(tile).forEach((square) => {
        if (square !== tile && !inner.includes(square)) {
            total += squareScore(square, 'outer', terrainFeatureRegistry);
        }
    });
    if (index !== terrain_1.PLAINS && !hasShield(tile, terrainFeatureRegistry)) {
        total -= 16;
    }
    return (clamp((total - 120) >> 3, 1, 15) >> 1) + 8;
};
exports.fertility = fertility;
exports.default = exports.fertility;
//# sourceMappingURL=fertility.js.map