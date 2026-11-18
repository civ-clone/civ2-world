"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const GeneratorRegistry_1 = require("@civ-clone/core-world-generator/GeneratorRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Earth_1 = require("@civ-clone/civ2-earth-generator/Earth");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const earth_1 = require("../../lib/earth");
const PickGenerator_1 = require("@civ-clone/core-world-generator/Rules/PickGenerator");
const pickGenerator_1 = require("@civ-clone/base-world-start/lib/pickGenerator");
const core_random_1 = require("@civ-clone/core-random");
const getRules = (generatorRegistry = GeneratorRegistry_1.instance, randomNumberGenerator = core_random_1.instance, engine = Engine_1.instance) => [
    // Civilization II's own Earth, when the game asks for it (`earth`, as civ1-world's), or one of the generators.
    new PickGenerator_1.default(new Effect_1.default(() => (0, earth_1.isEarth)(engine)
        ? Earth_1.default
        : (0, pickGenerator_1.default)(generatorRegistry, randomNumberGenerator))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pick-generator.js.map