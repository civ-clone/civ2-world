import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
/** About 14 rivers on a normal map of about 1,300 land squares (`12 + 2 × land mass + 2 × climate`): one per 90. */
export declare const landSquaresPerRiver = 90;
/** A river must cross at least this many squares (`5 − attempts / 800` in Civilization II). */
export declare const minimumLength = 4;
/** Civilization II gives up after this many tries. */
export declare const maximumAttempts = 1024;
/** Where these rivers don't run: the terrains Civilization II's would change as they crossed them. */
export declare const unriverable: (typeof Terrain)[];
/** How many edge steps each land square is from the sea. */
export declare const distanceToSea: (world: World) => Map<Tile, number>;
/** Gives `world` its rivers, as `River` features on each square's terrain. Returns each river's squares, source first. */
export declare const placeRivers: (
  world: World,
  terrainFeatureRegistry: TerrainFeatureRegistry | undefined,
  randomNumberGenerator: () => number
) => Tile[][];
export default placeRivers;
