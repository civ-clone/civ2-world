"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.shieldChance = exports.specialChance = void 0;
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const terrainTable_1 = require("../../lib/terrainTable");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Feature_1 = require("@civ-clone/core-terrain-feature/Rules/Feature");
const Terrains_1 = require("../../Terrains");
const TerrainFeatures_1 = require("../../TerrainFeatures");
const core_random_1 = require("@civ-clone/core-random");
// Interim, until specials are placed as Civilization II places them, by position and the map's seed (`map.cpp`
//  `tile_resource`, `tile_grassland_has_shield`): about the same numbers, drawn at random.
/** One square in 16 has a special (one cell of each 4 by 4 block), either of its terrain's two, equally. */
exports.specialChance = 1 / 16;
/** Half of Grassland squares have a shield (`tile_grassland_has_shield`'s diagonal pattern). */
exports.shieldChance = 0.5;
/**
 * The `Feature` rules that give a new terrain its special: at most one, unlike independent rolls, which could give a
 *  Desert both an Oasis and Oil. Which special (none, the first or the second) is drawn once per terrain, the first
 *  time a rule asks.
 */
const getRules = (terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, randomNumberGenerator = core_random_1.instance) => {
    const slots = new WeakMap(), slotOf = (terrain) => {
        if (!slots.has(terrain)) {
            slots.set(terrain, randomNumberGenerator() < exports.specialChance
                ? randomNumberGenerator() < 0.5
                    ? 1
                    : 2
                : 0);
        }
        return slots.get(terrain);
    }, rule = (FeatureType, TerrainType, chosen) => new Feature_1.default(new Criterion_1.default((TerrainFeatureType) => TerrainFeatureType === FeatureType), new Criterion_1.default((TerrainFeatureType, terrain) => terrain instanceof TerrainType), new Criterion_1.default((TerrainFeatureType, terrain) => chosen(terrain)), new Effect_1.default((TerrainFeatureType, terrain) => terrainFeatureRegistry.register(new TerrainFeatureType(terrain))));
    return [
        ...terrainTable_1.terrainTypes.flatMap((TerrainType, index) => [1, 2]
            .filter((slot) => terrainTable_1.specialTypes[slot - 1][index] !== null)
            .map((slot) => rule(terrainTable_1.specialTypes[slot - 1][index], TerrainType, (terrain) => slotOf(terrain) === slot))),
        rule(TerrainFeatures_1.Shield, Terrains_1.Grassland, () => randomNumberGenerator() < exports.shieldChance),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=feature.js.map