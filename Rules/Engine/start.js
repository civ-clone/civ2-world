"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.topologyIds = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const LandMassRegistry_1 = require("@civ-clone/core-world/LandMassRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Start_1 = require("@civ-clone/core-engine/Rules/Start");
const WorldSizes_1 = require("../../WorldSizes");
const startWorld_1 = require("@civ-clone/base-world-start/lib/startWorld");
/**
 * The grids a world can be laid out on: Civilization II's own staggered isometric grid, its default, and the square and
 *  hexagonal grids, which the generator, rivers, specials and huts all follow by the grid's own edges
 *  (civ-clone/web-renderer#1249). Its Earth is always on its own grid (civ2-earth-generator).
 */
exports.topologyIds = ['staggered-iso', 'square', 'hex-odd-r'];
const getRules = (ruleRegistry = RuleRegistry_1.instance, engine = Engine_1.instance, landMassRegistry = LandMassRegistry_1.instance) => [
    new Start_1.default(new Effect_1.default(() => {
        (0, startWorld_1.default)(ruleRegistry, engine, {
            landMassRegistry,
            defaults: {
                topologyId: 'staggered-iso',
                // A normal map: 50 squares across (100 in Civilization II's doubled x) and 80 down, like `WORLD_M.MP`.
                height: WorldSizes_1.normal.height,
                width: WorldSizes_1.normal.width,
                // A normal land mass (`mapgen_place_landmasses`: about 1,280 of 4,000 squares), taking the encoding of
                //  "normal" as 0, which isn't confirmed.
                landCoverage: 0.32,
                landSize: 0.2,
                maxIterations: 20,
            },
            topologyIds: exports.topologyIds,
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map