"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.polarRow = void 0;
const Terrains_1 = require("../../Terrains");
const Distribution_1 = require("@civ-clone/core-world-generator/Rules/Distribution");
const Types_1 = require("@civ-clone/core-terrain/Types");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
// The interim generator (simple-world-generator's bands; `from` and `to` are fractions of the map from its first row
//  to its last). These are civ1-world's bands, with Civilization II's Glacier for the poles and no River terrain: rivers
//  are a feature, walked in after the terrain (`Rules/World/built`). Civilization II's own generator
//  (`map.cpp` `map_generate`) is a later port.
/** The first and last rows of the default 80-row map. Glacier fills the land there. */
exports.polarRow = 1 / 80;
const distribution = (TerrainType, Base, bands) => new Distribution_1.Distribution(new Criterion_1.default((Type) => Type === TerrainType), new Criterion_1.default((Type, mapData) => mapData.some((terrain) => terrain instanceof Base)), new Effect_1.default(() => bands));
const getRules = () => [
    distribution(Terrains_1.Glacier, Types_1.Land, [
        { from: 0, to: exports.polarRow, fill: true },
        { from: exports.polarRow, to: exports.polarRow * 2 },
        { from: 1 - exports.polarRow * 2, to: 1 - exports.polarRow },
        { from: 1 - exports.polarRow, to: 1, fill: true },
    ]),
    distribution(Terrains_1.Desert, Types_1.Land, [
        { from: 0.4, to: 0.45 },
        {
            from: 0.45,
            to: 0.55,
            coverage: 0.025,
            cluster: true,
            clusterChance: 0.1,
        },
        { from: 0.55, to: 0.6 },
    ]),
    distribution(Terrains_1.Forest, Types_1.Land, [
        { from: 0.05, to: 0.2 },
        { from: 0.2, to: 0.4, cluster: true, clusterChance: 0.1, coverage: 0.1 },
        { from: 0.4, to: 0.6 },
        { from: 0.6, to: 0.8, cluster: true, clusterChance: 0.1, coverage: 0.1 },
        { from: 0.8, to: 0.95 },
    ]),
    distribution(Terrains_1.Grassland, Types_1.Land, [{ fill: true }]),
    distribution(Terrains_1.Hills, Types_1.Land, [
        { from: 0.1, to: 0.9, path: true, pathChance: 0.1, coverage: 0.06 },
    ]),
    distribution(Terrains_1.Jungle, Types_1.Land, [
        { from: 0.3, to: 0.45, cluster: true, clusterChance: 0.2, coverage: 0.08 },
        { from: 0.55, to: 0.7, cluster: true, clusterChance: 0.2, coverage: 0.08 },
    ]),
    distribution(Terrains_1.Mountains, Types_1.Land, [
        { from: 0.01, to: 0.1, coverage: 0.3, path: true },
        { from: 0.1, to: 0.9, path: true },
        { from: 0.9, to: 0.99, coverage: 0.3, path: true },
    ]),
    distribution(Terrains_1.Ocean, Types_1.Water, [{ fill: true }]),
    distribution(Terrains_1.Plains, Types_1.Land, [
        { from: 0.01, to: 0.2, coverage: 0.3 },
        { from: 0.2, to: 0.4 },
        { from: 0.1, to: 0.4, cluster: true },
        { from: 0.4, to: 0.6 },
        { from: 0.6, to: 0.8 },
        { from: 0.6, to: 0.9, cluster: true },
        { from: 0.8, to: 0.99, coverage: 0.3 },
    ]),
    distribution(Terrains_1.Swamp, Types_1.Land, [
        { from: 0.2, to: 0.4, cluster: true },
        { from: 0.6, to: 0.8, cluster: true },
    ]),
    distribution(Terrains_1.Tundra, Types_1.Land, [
        { from: 0.01, to: 0.15, cluster: true, coverage: 0.15 },
        { from: 0.85, to: 0.99, cluster: true, coverage: 0.15 },
    ]),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=distribution.js.map