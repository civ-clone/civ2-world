"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableRequirements = exports.improvedBy = exports.landTerrains = exports.NO_FORTRESS = exports.NO_RIVER = exports.RIVER = exports.IRRIGATION_SOURCE = void 0;
const TileImprovements_1 = require("./TileImprovements");
const Advances_1 = require("./Advances");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const terrain_1 = require("./data/terrain");
const Types_1 = require("@civ-clone/core-terrain/Types");
const terrainTable_1 = require("./lib/terrainTable");
// Where Civilization II's tile improvements can be built and what else they need (`unit.cpp` `unit_cmd_terraform`), as
//  the entries `Rules/TileImprovement/available` makes its rules from. A tile improvement can be built by any one of its
//  entries. Converting a terrain (irrigating a Forest, mining Plains) is an action, not a tile improvement, so it isn't
//  here.
// What the graph can name but a rule decides (`Rules/TileImprovement/available` checks them).
exports.IRRIGATION_SOURCE = new Requirement_1.Condition('civ2-world:irrigation-source');
exports.RIVER = new Requirement_1.Condition('civ2-world:river');
exports.NO_RIVER = new Requirement_1.Condition('civ2-world:no-river');
exports.NO_FORTRESS = new Requirement_1.Condition('civ2-world:no-fortress');
// Every land terrain: nothing here is built on Ocean.
const 
// The terrains an order improves in place (`yes`).
improvedBy = (change) => terrainTable_1.terrainTypes.filter((TerrainType, index) => terrain_1.terrains[index][change][0] === terrain_1.YES);
exports.landTerrains = terrainTable_1.terrainTypes.filter((TerrainType) => Object.prototype.isPrototypeOf.call(Types_1.Land, TerrainType)), 
// The terrains an order improves in place (`yes`).
exports.improvedBy = improvedBy;
/**
 * One way to build `subject`, or none while one of `targets` is still pending (`null`, see `Advances`): then it can't
 *  be built that way yet.
 */
const tileImprovement = (id, subject, targets, where) => targets.includes(null)
    ? []
    : [
        new Requirement_1.Requirement({
            id: `civ2-world:tile-improvement/available/${id}`,
            subject,
            relation: 'requires',
            targets: targets,
            range: 'tile',
            where,
        }),
    ];
exports.availableRequirements = [
    // Desert, Plains, Grassland, Hills and Tundra, with water next to it.
    ...tileImprovement('Irrigation', TileImprovements_1.Irrigation, [exports.IRRIGATION_SOURCE], (0, exports.improvedBy)(5)),
    // Irrigating an irrigated square makes it Farmland, with Refrigeration.
    ...tileImprovement('Farmland', TileImprovements_1.Farmland, [TileImprovements_1.Irrigation, Advances_1.Refrigeration, exports.IRRIGATION_SOURCE], (0, exports.improvedBy)(5)),
    // Desert, Hills, Mountains and Glacier.
    ...tileImprovement('Mine', TileImprovements_1.Mine, [], (0, exports.improvedBy)(6)),
    ...tileImprovement('Road', TileImprovements_1.Road, [exports.NO_RIVER], exports.landTerrains),
    // A road on a river needs Bridge Building.
    ...tileImprovement('bridge/Road', TileImprovements_1.Road, [Advances_1.BridgeBuilding, exports.RIVER], exports.landTerrains),
    ...tileImprovement('Railroad', TileImprovements_1.Railroad, [Advances_1.Railroad, TileImprovements_1.Road], exports.landTerrains),
    ...tileImprovement('Fortress', TileImprovements_1.Fortress, [Advances_1.Construction], exports.landTerrains),
    // Not on a fortress (a fortress can be built on an airbase, and replaces it).
    ...tileImprovement('Airbase', TileImprovements_1.Airbase, [Advances_1.Radio, exports.NO_FORTRESS], exports.landTerrains),
];
exports.default = exports.availableRequirements;
//# sourceMappingURL=Requirements.js.map