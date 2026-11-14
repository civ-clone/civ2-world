"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const AvailableTerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Created_1 = require("@civ-clone/core-terrain/Rules/Created");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const placeFeatures_1 = require("@civ-clone/base-terrain-feature/lib/placeFeatures");
const getRules = (ruleRegistry = RuleRegistry_1.instance, availableTerrainFeatureRegistry = AvailableTerrainFeatureRegistry_1.instance) => [
    new Created_1.default(new Effect_1.default((0, placeFeatures_1.default)(ruleRegistry, availableTerrainFeatureRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=created.js.map