import { EarthMap } from '@civ-clone/civ2-earth-generator';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Engine from '@civ-clone/core-engine/Engine';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
/** Whether the game is on Earth: the `earth` option, as civ1-world reads it. */
export declare const isEarth: (engine: Engine) => boolean;
/** The Earth map `world` was made from, when the game is on Earth. */
export declare const earthMapOf: (
  world: World,
  engine: Engine
) => EarthMap | null;
/** The special the seed puts on `tile`, as which of its terrain's two, or 0. */
export declare const seededSpecial: (tile: Tile, seed: number) => 0 | 1 | 2;
/** Whether the seed's pattern gives Grassland `tile` a shield. */
export declare const seededShield: (tile: Tile) => boolean;
/**
 * Sets `world`, made from `map`, up as the original does: each square's specials and shield are the seed's, in place of
 *  any rolled as its terrain was made, and the map's rivers run where they do.
 */
export declare const placeEarth: (
  world: World,
  map: EarthMap,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => void;
export default placeEarth;
