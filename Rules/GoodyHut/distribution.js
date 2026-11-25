"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.hutChance = void 0;
const GoodyHutRegistry_1 = require("@civ-clone/core-goody-hut/GoodyHutRegistry");
const placement_1 = require("@civ-clone/base-goody-hut/lib/placement");
const earth_1 = require("../../lib/earth");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const positional_1 = require("../../lib/positional");
const civ2_earth_generator_1 = require("@civ-clone/civ2-earth-generator");
const Distribution_1 = require("@civ-clone/core-goody-hut/Rules/Distribution");
const core_random_1 = require("@civ-clone/core-random");
// Interim, until huts are placed as Civilization II places them, by position and the map's seed (`map.cpp`
//  `tile_has_hut`: one land square in two 4 by 4 blocks): a hut on about 1 land square in 32, none next to another.
exports.hutChance = 1 / 32;
// On Earth, the map's seed places them, as Civilization II does: where `tile_has_hut` says, and nowhere else.
const getRules = (goodyHutRegistry = GoodyHutRegistry_1.instance, randomNumberGenerator = core_random_1.instance) => {
    const nearby = (0, placement_1.noHutWithin)(1, goodyHutRegistry), roll = (0, placement_1.chance)(exports.hutChance, randomNumberGenerator), seeded = (tile) => {
        const map = (0, earth_1.earthMapOf)(tile.map());
        if (map === null) {
            return null;
        }
        const { x, y } = (0, civ2_earth_generator_1.toDoubled)({ x: tile.x(), y: tile.y() });
        return (0, positional_1.hutAt)(x, y, map.seed);
    };
    return [
        new Distribution_1.default(new Criterion_1.default(placement_1.onLand)),
        new Distribution_1.default(new Criterion_1.default((tile) => { var _a; return (_a = seeded(tile)) !== null && _a !== void 0 ? _a : (nearby(tile) && roll()); })),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=distribution.js.map