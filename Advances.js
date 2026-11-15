"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refrigeration = exports.Railroad = exports.Radio = exports.Construction = exports.BridgeBuilding = void 0;
var BridgeBuilding_1 = require("@civ-clone/base-science-advance-bridgebuilding/BridgeBuilding");
Object.defineProperty(exports, "BridgeBuilding", { enumerable: true, get: function () { return BridgeBuilding_1.BridgeBuilding; } });
var Construction_1 = require("@civ-clone/base-science-advance-construction/Construction");
Object.defineProperty(exports, "Construction", { enumerable: true, get: function () { return Construction_1.Construction; } });
var Radio_1 = require("@civ-clone/base-science-advance-radio/Radio");
Object.defineProperty(exports, "Radio", { enumerable: true, get: function () { return Radio_1.Radio; } });
var Railroad_1 = require("@civ-clone/base-science-advance-railroad/Railroad");
Object.defineProperty(exports, "Railroad", { enumerable: true, get: function () { return Railroad_1.Railroad; } });
// An advance that is `null` here leaves a way to build something that needs it out of `Requirements`, so Farmland
//  can't be built yet: it waits for the Supermarket's effect. Wiring it in is its one line.
exports.Refrigeration = null;
//# sourceMappingURL=Advances.js.map