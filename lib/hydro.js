"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydroPossible = void 0;
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Terrains_1 = require("../Terrains");
const river_1 = require("./river");
/**
 * Whether a city founded on `tile` may build a Hydro Plant: the square, or one of the 8 beside it, has a river or is
 *  Mountains (OpenCiv2 `src/auto/city.cpp` `city_create` sets the city's flag, `city_can_build_improvement` reads it,
 *  richardpenman/civ2@49f26ec). The game decides it when the city is founded and never again, so a city should keep the
 *  answer it had then.
 */
const hydroPossible = (tile, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => [tile, ...tile.getNeighbours()].some((square) => square.terrain() instanceof Terrains_1.Mountains ||
    (0, river_1.hasRiver)(square, terrainFeatureRegistry));
exports.hydroPossible = hydroPossible;
exports.default = exports.hydroPossible;
//# sourceMappingURL=hydro.js.map