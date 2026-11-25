import { EarthMap } from '@civ-clone/civ2-earth-generator';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import World, { IWorld } from '@civ-clone/core-world/World';
/**
 * Whether `world` is the Earth: made by civ2-earth-generator's `Earth`, as the world records (`generatorId()`) and keeps
 *  in a save. The engine's `earth` option is what chooses that generator (`Rules/WorldGenerator/pick-generator`), before
 *  there is a world, and isn't saved, so a rule that read it after a load was told "no" (civ-clone/web-renderer#175).
 */
export declare const isEarth: (world: IWorld | null) => boolean;
/** The Earth map `world` was made from, when it's the Earth. */
export declare const earthMapOf: (world: World | null) => EarthMap | null;
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
