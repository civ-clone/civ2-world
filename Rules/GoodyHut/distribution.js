"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.hutChance = void 0;
const GoodyHutRegistry_1 = require("@civ-clone/core-goody-hut/GoodyHutRegistry");
const placement_1 = require("@civ-clone/base-goody-hut/lib/placement");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Distribution_1 = require("@civ-clone/core-goody-hut/Rules/Distribution");
const core_random_1 = require("@civ-clone/core-random");
// Interim, until huts are placed as Civilization II places them, by position and the map's seed (`map.cpp`
//  `tile_has_hut`: one land square in two 4 by 4 blocks): a hut on about 1 land square in 32, none next to another.
exports.hutChance = 1 / 32;
const getRules = (goodyHutRegistry = GoodyHutRegistry_1.instance, randomNumberGenerator = core_random_1.instance) => [
    new Distribution_1.default(new Criterion_1.default(placement_1.onLand)),
    new Distribution_1.default(new Criterion_1.default((0, placement_1.noHutWithin)(1, goodyHutRegistry))),
    new Distribution_1.default(new Criterion_1.default((0, placement_1.chance)(exports.hutChance, randomNumberGenerator))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=distribution.js.map