'use strict';
// Civilization II's Earth (civ2-earth-generator), as the original sets a map it loads up for a game (`map_generate`
//  with the map kept): the map's own rivers; specials and Grassland shields where the map's seed puts them, in place of
//  the interim random ones, but none on an ocean square with no land within a city's reach
//  (`mapgen_hide_far_ocean_resources`); and huts where the seed puts them (`Rules/GoodyHut/distribution`).
Object.defineProperty(exports, '__esModule', { value: true });
exports.placeEarth =
  exports.seededShield =
  exports.seededSpecial =
  exports.earthMapOf =
  exports.isEarth =
    void 0;
const civ2_earth_generator_1 = require('@civ-clone/civ2-earth-generator');
const terrain_1 = require('../data/terrain');
const TerrainFeatures_1 = require('../TerrainFeatures');
const TerrainFeatureRegistry_1 = require('@civ-clone/core-terrain-feature/TerrainFeatureRegistry');
const positional_1 = require('./positional');
const terrainTable_1 = require('./terrainTable');
const fatCross_1 = require('@civ-clone/base-city-tiles-fat-cross/lib/fatCross');
/**
 * Whether `world` is the Earth: made by civ2-earth-generator's `Earth`, as the world records (`generatorId()`) and keeps
 *  in a save. The engine's `earth` option is what chooses that generator (`Rules/WorldGenerator/pick-generator`), before
 *  there is a world, and isn't saved, so a rule that read it after a load was told "no" (civ-clone/web-renderer#175).
 */
const isEarth = (world) =>
  // A square of no world (as a rule's own test makes) isn't the Earth's.
  world !== null &&
  world.generatorId() === civ2_earth_generator_1.earthGeneratorId;
exports.isEarth = isEarth;
/** The Earth map `world` was made from, when it's the Earth. */
const earthMapOf = (world) =>
  world !== null && (0, exports.isEarth)(world)
    ? (0, civ2_earth_generator_1.findEarthMap)(world.width(), world.height())
    : null;
exports.earthMapOf = earthMapOf;
/** The special the seed puts on `tile`, as which of its terrain's two, or 0. */
const seededSpecial = (tile, seed) => {
  const index = (0, terrainTable_1.terrainIndex)(tile.terrain()),
    { x, y } = (0, civ2_earth_generator_1.toDoubled)({
      x: tile.x(),
      y: tile.y(),
    });
  if (index < 0) {
    return 0;
  }
  const slot = (0, positional_1.specialAt)(x, y, seed, index);
  // An ocean special out of every city's reach is hidden.
  if (
    slot !== 0 &&
    index === terrain_1.OCEAN &&
    !(0, fatCross_1.default)(tile).some((square) => square.isLand())
  ) {
    return 0;
  }
  return slot;
};
exports.seededSpecial = seededSpecial;
/** Whether the seed's pattern gives Grassland `tile` a shield. */
const seededShield = (tile) => {
  const { x, y } = (0, civ2_earth_generator_1.toDoubled)({
    x: tile.x(),
    y: tile.y(),
  });
  return (0, positional_1.shieldAt)(x, y);
};
exports.seededShield = seededShield;
/**
 * Sets `world`, made from `map`, up as the original does: each square's specials and shield are the seed's, in place of
 *  any rolled as its terrain was made, and the map's rivers run where they do.
 */
const placeEarth = (
  world,
  map,
  terrainFeatureRegistry = TerrainFeatureRegistry_1.instance
) => {
  const squares = (0, civ2_earth_generator_1.playedSquares)(map);
  world.forEach((tile) => {
    const terrain = tile.terrain(),
      index = (0, terrainTable_1.terrainIndex)(terrain);
    terrainFeatureRegistry
      .getByTerrain(terrain)
      .filter(
        (feature) =>
          feature instanceof TerrainFeatures_1.Shield ||
          (0, terrainTable_1.specialSlot)(index, feature) !== 0
      )
      .forEach((feature) => terrainFeatureRegistry.unregister(feature));
    if (index === terrain_1.GRASSLAND) {
      if ((0, exports.seededShield)(tile)) {
        terrainFeatureRegistry.register(new TerrainFeatures_1.Shield(terrain));
      }
    } else {
      const slot = (0, exports.seededSpecial)(tile, map.seed),
        SpecialType =
          slot === 0 ? null : terrainTable_1.specialTypes[slot - 1][index];
      if (SpecialType) {
        terrainFeatureRegistry.register(new SpecialType(terrain));
      }
    }
    if (squares[tile.y() * map.width + tile.x()].river) {
      terrainFeatureRegistry.register(new TerrainFeatures_1.River(terrain));
    }
  });
};
exports.placeEarth = placeEarth;
exports.default = exports.placeEarth;
//# sourceMappingURL=earth.js.map
