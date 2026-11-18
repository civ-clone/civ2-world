"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.HUTS = exports.RIVERS = void 0;
const GoodyHutRegistry_1 = require("@civ-clone/core-goody-hut/GoodyHutRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Built_1 = require("@civ-clone/core-world/Rules/Built");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const placement_1 = require("@civ-clone/base-goody-hut/lib/placement");
const earth_1 = require("../../lib/earth");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const placeRivers_1 = require("../../lib/placeRivers");
const core_random_1 = require("@civ-clone/core-random");
exports.RIVERS = 'civ2-world:world/built/rivers';
exports.HUTS = 'civ2-world:world/built/huts';
/**
 * Once the world is built: its rivers, then its huts (`Rules/GoodyHut/distribution`). On Earth, the map's own rivers,
 *  and the specials and Grassland shields its seed places (`lib/earth`), in place of the walk.
 */
const getRules = (terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, goodyHutRegistry = GoodyHutRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, randomNumberGenerator = core_random_1.instance, engine = Engine_1.instance) => [
    new Built_1.default(exports.RIVERS, new Effect_1.default((world) => {
        const map = (0, earth_1.earthMapOf)(world, engine);
        if (map !== null) {
            (0, earth_1.placeEarth)(world, map, terrainFeatureRegistry);
            return;
        }
        (0, placeRivers_1.default)(world, terrainFeatureRegistry, randomNumberGenerator);
    })),
    new Built_1.default(exports.HUTS, new Effect_1.default((0, placement_1.distributeHuts)(goodyHutRegistry, ruleRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map