"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refrigeration = exports.Radio = exports.Railroad = exports.Construction = exports.BridgeBuilding = void 0;
var BridgeBuilding_1 = require("@civ-clone/base-science-advance-bridgebuilding/BridgeBuilding");
Object.defineProperty(exports, "BridgeBuilding", { enumerable: true, get: function () { return BridgeBuilding_1.BridgeBuilding; } });
var Construction_1 = require("@civ-clone/base-science-advance-construction/Construction");
Object.defineProperty(exports, "Construction", { enumerable: true, get: function () { return Construction_1.Construction; } });
var Railroad_1 = require("@civ-clone/base-science-advance-railroad/Railroad");
Object.defineProperty(exports, "Railroad", { enumerable: true, get: function () { return Railroad_1.Railroad; } });
// Pending stage C1 of the M2a plan (civ-clone/web-renderer#1008), which creates the 23 advances Civilization II adds.
//  Until then each is `null`, and a way to build something that needs one is left out of `Requirements` (so Farmland
//  and Airbases can't be built yet). Wiring each in is its one line.
exports.Radio = null;
exports.Refrigeration = null;
//# sourceMappingURL=Advances.js.map