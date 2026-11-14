"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseYield = exports.specialRow = exports.terrainRow = exports.specialOf = exports.specialSlot = exports.terrainIndex = exports.specialResourceTypes = exports.specialTypes = exports.terrainTypes = void 0;
const TerrainFeatures_1 = require("../TerrainFeatures");
const Terrains_1 = require("../Terrains");
const terrain_1 = require("../data/terrain");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
/** The terrain classes, by Civilization II's terrain index (`data/terrain`). */
exports.terrainTypes = [
    Terrains_1.Desert,
    Terrains_1.Plains,
    Terrains_1.Grassland,
    Terrains_1.Forest,
    Terrains_1.Hills,
    Terrains_1.Mountains,
    Terrains_1.Tundra,
    Terrains_1.Glacier,
    Terrains_1.Swamp,
    Terrains_1.Jungle,
    Terrains_1.Ocean,
];
/**
 * The special resources, `specialTypes[slot - 1][terrain index]`. Grassland's are `null`: a Grassland square never has
 *  one, and its shield is the `Shield` feature instead. Oil is the second special of both Desert and Glacier.
 */
exports.specialTypes = [
    [TerrainFeatures_1.Oasis, TerrainFeatures_1.Buffalo, null, TerrainFeatures_1.Pheasant, TerrainFeatures_1.Coal, TerrainFeatures_1.Gold, TerrainFeatures_1.Game, TerrainFeatures_1.Ivory, TerrainFeatures_1.Peat, TerrainFeatures_1.Gems, TerrainFeatures_1.Fish],
    [TerrainFeatures_1.Oil, TerrainFeatures_1.Wheat, null, TerrainFeatures_1.Silk, TerrainFeatures_1.Wine, TerrainFeatures_1.Iron, TerrainFeatures_1.Furs, TerrainFeatures_1.Oil, TerrainFeatures_1.Spice, TerrainFeatures_1.Fruit, TerrainFeatures_1.Whales],
];
/** Every special resource class, once each. */
exports.specialResourceTypes = [
    ...new Set([...exports.specialTypes[0], ...exports.specialTypes[1]].filter((Type) => Type !== null)),
];
/** The terrain index of `terrain`, or -1 for a terrain that isn't one of Civilization II's. */
const terrainIndex = (terrain) => exports.terrainTypes.findIndex((TerrainType) => terrain instanceof TerrainType);
exports.terrainIndex = terrainIndex;
/** Which special of terrain `index` `feature` is: 1 or 2, or 0 if it isn't one. */
const specialSlot = (index, feature) => {
    if (index < 0) {
        return 0;
    }
    if (exports.specialTypes[0][index] && feature instanceof exports.specialTypes[0][index]) {
        return 1;
    }
    if (exports.specialTypes[1][index] && feature instanceof exports.specialTypes[1][index]) {
        return 2;
    }
    return 0;
};
exports.specialSlot = specialSlot;
/** The special resource `terrain` holds, and which of its two it is, if any. */
const specialOf = (terrain, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => {
    const index = (0, exports.terrainIndex)(terrain);
    for (const feature of terrainFeatureRegistry.getByTerrain(terrain)) {
        const slot = (0, exports.specialSlot)(index, feature);
        if (slot !== 0) {
            return [feature, slot];
        }
    }
    return null;
};
exports.specialOf = specialOf;
const terrainRow = (index) => terrain_1.terrains[index];
exports.terrainRow = terrainRow;
const specialRow = (index, slot) => terrain_1.specials[slot - 1][index];
exports.specialRow = specialRow;
/**
 * A square's food, shields and trade before anything is built on it (`city.cpp` `city_tile_yield`, step 1): its
 *  special's row if it has one, otherwise its terrain's, and no shield on Grassland without its `Shield`. `null` for a
 *  terrain that isn't one of Civilization II's.
 */
const baseYield = (terrain, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => {
    const index = (0, exports.terrainIndex)(terrain);
    if (index < 0) {
        return null;
    }
    const special = (0, exports.specialOf)(terrain, terrainFeatureRegistry), [, , food, shields, trade] = special
        ? (0, exports.specialRow)(index, special[1])
        : (0, exports.terrainRow)(index);
    if (index === terrain_1.GRASSLAND &&
        !terrainFeatureRegistry
            .getByTerrain(terrain)
            .some((feature) => feature instanceof TerrainFeatures_1.Shield)) {
        return [food, 0, trade];
    }
    return [food, shields, trade];
};
exports.baseYield = baseYield;
//# sourceMappingURL=terrainTable.js.map