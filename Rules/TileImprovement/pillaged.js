"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const lifecycle_1 = require("@civ-clone/base-tile-improvement/lib/lifecycle");
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, engine = Engine_1.instance) => (0, lifecycle_1.pillagedRules)(tileImprovementRegistry, engine);
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pillaged.js.map