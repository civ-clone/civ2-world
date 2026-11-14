"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.steps = exports.spacings = exports.minimumRoom = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Yields_1 = require("../../Yields");
const Terrains_1 = require("../../Terrains");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PickStartTile_1 = require("@civ-clone/core-world-generator/Rules/PickStartTile");
const StartTilePicker_1 = require("@civ-clone/base-world-start/lib/StartTilePicker");
const core_random_1 = require("@civ-clone/core-random");
// A simple start, after Civilization II's (`civ.cpp`, the start search in `civ_create`): on Grassland or Plains, scored
//  as its fertility is (food three times, shields twice, trade once, `map.cpp` `mapgen_calc_fertility`), on a landmass
//  with at least 32 such squares, as far as it can be from the others. Civilization II asks for 16 squares apart and
//  relaxes that as its attempts run out; this asks for each of `spacings` in turn.
exports.minimumRoom = 32;
exports.spacings = [16, 12, 8, 6, 4, 2, 1];
/** Map distance: steps on the grid (`map_distance`, `steps` on the staggered isometric grid). */
const steps = (from, to) => from.map().topology().steps(from.x(), from.y(), to.x(), to.y());
exports.steps = steps;
let spacing = exports.spacings[0];
// One picker for every world, so each is ranked once.
const picker = new StartTilePicker_1.default({
    TerrainTypes: [Terrains_1.Grassland, Terrains_1.Plains],
    weights: [
        [Yields_1.Food, 3],
        [Yields_1.Production, 2],
        [Yields_1.Trade, 1],
    ],
    minimumRoom: exports.minimumRoom,
    tooClose: (startSquare, tile) => (0, exports.steps)(startSquare, tile) < spacing,
});
const getRules = (engine = Engine_1.instance, randomNumberGenerator = core_random_1.instance) => [
    new PickStartTile_1.default(new Effect_1.default((world, player, usedStartSquares) => {
        var _a;
        const pick = (candidate) => {
            spacing = candidate;
            return picker.pick(world, usedStartSquares, engine, randomNumberGenerator);
        };
        // The closest spacing's pick, if even that finds nothing, is `undefined`, as base-world-start's is.
        return ((_a = exports.spacings
            .slice(0, -1)
            .reduce((found, candidate) => found !== null && found !== void 0 ? found : pick(candidate), undefined)) !== null && _a !== void 0 ? _a : pick(exports.spacings[exports.spacings.length - 1]));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pick-start-tile.js.map