"use strict";
// Civilization II's terrain table: the numbers of `RULES.TXT` `@TERRAIN`, as OpenCiv2 loads them (`src/auto/civ.cpp`
//  `rules_load_terrain`, :1251). Numbers only: no text from the file is held here. `tests/rulesTxt.test.ts` checks
//  every number against a local `RULES.TXT` when `CIV2_PATH` is set.
//
// Rows 0 to 10 are the terrains, in Civilization II's order (the `TerrainId` enum). Rows 11 to 21 are each terrain's
//  first special resource and rows 22 to 32 its second: a special's food, shields and trade replace its terrain's
//  (`city.cpp` `city_tile_yield`), and it's improved as its terrain is.
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptions = exports.specials = exports.terrains = exports.OCEAN = exports.JUNGLE = exports.SWAMP = exports.GLACIER = exports.TUNDRA = exports.MOUNTAINS = exports.HILLS = exports.FOREST = exports.GRASSLAND = exports.PLAINS = exports.DESERT = exports.NO = exports.YES = void 0;
// How an irrigate, mine or transform order's result is stored: in place (`yes`), not at all (`no`), or the terrain
//  (0 to 10) the square becomes. OpenCiv2 stores `yes` as -2 and `no` as -1 too.
exports.YES = -2;
exports.NO = -1;
// The terrain indices.
exports.DESERT = 0, exports.PLAINS = 1, exports.GRASSLAND = 2, exports.FOREST = 3, exports.HILLS = 4, exports.MOUNTAINS = 5, exports.TUNDRA = 6, exports.GLACIER = 7, exports.SWAMP = 8, exports.JUNGLE = 9, exports.OCEAN = 10;
/** Rows 0 to 10, by terrain index. Defence is in half steps (2 is normal). */
exports.terrains = [
    // RULES.TXT @TERRAIN row 0
    [1, 2, 0, 1, 0, [exports.YES, 1, 5, 5], [exports.YES, 1, 5, 3], exports.PLAINS],
    // RULES.TXT @TERRAIN row 1
    [1, 2, 1, 1, 0, [exports.YES, 1, 5, 1], [exports.FOREST, 0, 15, 0], exports.GRASSLAND],
    // RULES.TXT @TERRAIN row 2
    [1, 2, 2, 1, 0, [exports.YES, 1, 5, 2], [exports.FOREST, 0, 10, 0], exports.HILLS],
    // RULES.TXT @TERRAIN row 3
    [2, 3, 1, 2, 0, [exports.PLAINS, 0, 5, 5], [exports.NO, 0, 5, 0], exports.GRASSLAND],
    // RULES.TXT @TERRAIN row 4
    [2, 4, 1, 0, 0, [exports.YES, 1, 10, 0], [exports.YES, 3, 10, 1], exports.PLAINS],
    // RULES.TXT @TERRAIN row 5 (OpenCiv2 civ.cpp:1251). Irrigation is `no`, but its bonus is 1, which a city on Mountains gets (`city_tile_yield`).
    [3, 6, 0, 1, 0, [exports.NO, 1, 10, 0], [exports.YES, 1, 10, 6], exports.HILLS],
    // RULES.TXT @TERRAIN row 6
    [1, 2, 1, 0, 0, [exports.YES, 1, 10, 1], [exports.NO, 0, 0, 0], exports.DESERT],
    // RULES.TXT @TERRAIN row 7
    [2, 2, 0, 0, 0, [exports.NO, 0, 0, 0], [exports.YES, 1, 15, 3], exports.TUNDRA],
    // RULES.TXT @TERRAIN row 8
    [2, 3, 1, 0, 0, [exports.GRASSLAND, 0, 15, 6], [exports.FOREST, 0, 15, 0], exports.PLAINS],
    // RULES.TXT @TERRAIN row 9
    [2, 3, 1, 0, 0, [exports.GRASSLAND, 0, 15, 6], [exports.FOREST, 0, 15, 0], exports.PLAINS],
    // RULES.TXT @TERRAIN row 10
    [1, 2, 1, 0, 2, [exports.NO, 0, 0, 0], [exports.NO, 0, 0, 0], exports.NO],
];
/**
 * Rows 11 to 32: `specials[slot - 1][terrain]`. Grassland's two (rows 13 and 24) are never placed: a Grassland square's
 *  shield comes from its own pattern instead (`map.cpp` `tile_resource`, `tile_grassland_has_shield`).
 */
exports.specials = [
    [
        // RULES.TXT @TERRAIN row 11
        [1, 2, 3, 1, 0],
        // RULES.TXT @TERRAIN row 12
        [1, 2, 1, 3, 0],
        // RULES.TXT @TERRAIN row 13
        [1, 2, 2, 1, 0],
        // RULES.TXT @TERRAIN row 14
        [2, 3, 3, 2, 0],
        // RULES.TXT @TERRAIN row 15
        [2, 4, 1, 2, 0],
        // RULES.TXT @TERRAIN row 16
        [3, 6, 0, 1, 6],
        // RULES.TXT @TERRAIN row 17
        [1, 2, 3, 1, 0],
        // RULES.TXT @TERRAIN row 18
        [2, 2, 1, 1, 4],
        // RULES.TXT @TERRAIN row 19
        [2, 3, 1, 4, 0],
        // RULES.TXT @TERRAIN row 20
        [2, 3, 1, 0, 4],
        // RULES.TXT @TERRAIN row 21
        [1, 2, 3, 0, 2],
    ],
    [
        // RULES.TXT @TERRAIN row 22
        [1, 2, 0, 4, 0],
        // RULES.TXT @TERRAIN row 23
        [1, 2, 3, 1, 0],
        // RULES.TXT @TERRAIN row 24
        [1, 2, 2, 1, 0],
        // RULES.TXT @TERRAIN row 25
        [2, 3, 1, 2, 3],
        // RULES.TXT @TERRAIN row 26
        [2, 4, 1, 0, 4],
        // RULES.TXT @TERRAIN row 27
        [3, 6, 0, 4, 0],
        // RULES.TXT @TERRAIN row 28
        [1, 2, 2, 0, 3],
        // RULES.TXT @TERRAIN row 29
        [2, 2, 0, 4, 0],
        // RULES.TXT @TERRAIN row 30
        [2, 3, 3, 0, 4],
        // RULES.TXT @TERRAIN row 31
        [2, 3, 4, 0, 1],
        // RULES.TXT @TERRAIN row 32
        [1, 2, 2, 2, 3],
    ],
];
/**
 * Rows the game uses differently from the file, which the `CIV2_PATH` test lists as exceptions. None: every number
 *  above is the file's.
 */
exports.exceptions = [];
//# sourceMappingURL=terrain.js.map