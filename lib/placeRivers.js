"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeRivers = exports.distanceToSea = exports.unriverable = exports.maximumAttempts = exports.minimumLength = exports.landSquaresPerRiver = void 0;
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Terrains_1 = require("../Terrains");
const TerrainFeatures_1 = require("../TerrainFeatures");
const river_1 = require("./river");
// Interim, until Civilization II's own river walk is ported with its generator (`map.cpp` `mapgen_place_rivers`).
//  The same shape: a river starts on a random square, runs along edges (`Tile.getAdjacent`) and ends at the sea or at
//  another river, and one that's too short isn't kept. Here it never runs uphill, which with no heights on the map
//  means never away from the nearest sea: it may wander along a level, but never back over itself, so it ends. Civilization II's rivers also change the terrain they cross
//  (Hills and Mountains to Grassland, and so on); these don't, and keep off the terrains that would change.
/** About 14 rivers on a normal map of about 1,300 land squares (`12 + 2 × land mass + 2 × climate`): one per 90. */
exports.landSquaresPerRiver = 90;
/** A river must cross at least this many squares (`5 − attempts / 800` in Civilization II). */
exports.minimumLength = 4;
/** Civilization II gives up after this many tries. */
exports.maximumAttempts = 1024;
/** Where these rivers don't run: the terrains Civilization II's would change as they crossed them. */
exports.unriverable = [Terrains_1.Glacier, Terrains_1.Hills, Terrains_1.Mountains];
const canCarry = (tile) => tile.isLand() &&
    !exports.unriverable.some((TerrainType) => tile.terrain() instanceof TerrainType);
/** How many edge steps each land square is from the sea. */
const distanceToSea = (world) => {
    const distances = new Map(), queue = world.filter((tile) => tile.isWater());
    queue.forEach((tile) => distances.set(tile, 0));
    for (let index = 0; index < queue.length; index++) {
        const tile = queue[index], distance = distances.get(tile);
        tile.getAdjacent().forEach((neighbour) => {
            if (neighbour.isLand() && !distances.has(neighbour)) {
                distances.set(neighbour, distance + 1);
                queue.push(neighbour);
            }
        });
    }
    return distances;
};
exports.distanceToSea = distanceToSea;
/** Gives `world` its rivers, as `River` features on each square's terrain. Returns each river's squares, source first. */
const placeRivers = (world, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, randomNumberGenerator) => {
    const distances = (0, exports.distanceToSea)(world), starts = world.filter((tile) => { var _a; return canCarry(tile) && ((_a = distances.get(tile)) !== null && _a !== void 0 ? _a : 0) >= 2; }), landSquares = world.filter((tile) => tile.isLand()).length, target = Math.round(landSquares / exports.landSquaresPerRiver), rivers = [];
    for (let attempt = 0; attempt < exports.maximumAttempts && rivers.length < target && starts.length > 0; attempt++) {
        const start = starts[Math.floor(randomNumberGenerator() * starts.length)];
        if ((0, river_1.hasRiver)(start, terrainFeatureRegistry)) {
            continue;
        }
        const river = [start];
        let current = start, ended = false;
        while (!ended) {
            const neighbours = current.getAdjacent();
            // At the sea, or joining another river.
            if (neighbours.some((tile) => tile.isWater() || (0, river_1.hasRiver)(tile, terrainFeatureRegistry))) {
                ended = true;
                break;
            }
            const downhill = neighbours.filter((tile) => {
                var _a;
                return canCarry(tile) &&
                    !river.includes(tile) &&
                    ((_a = distances.get(tile)) !== null && _a !== void 0 ? _a : Infinity) <= distances.get(current);
            });
            if (downhill.length === 0) {
                break;
            }
            current = downhill[Math.floor(randomNumberGenerator() * downhill.length)];
            river.push(current);
        }
        if (!ended || river.length < exports.minimumLength) {
            continue;
        }
        terrainFeatureRegistry.register(...river.map((tile) => new TerrainFeatures_1.River(tile.terrain())));
        rivers.push(river);
    }
    return rivers;
};
exports.placeRivers = placeRivers;
exports.default = exports.placeRivers;
//# sourceMappingURL=placeRivers.js.map