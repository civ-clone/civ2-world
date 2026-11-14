import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Feature from '@civ-clone/core-terrain-feature/Rules/Feature';
/** One square in 16 has a special (one cell of each 4 by 4 block), either of its terrain's two, equally. */
export declare const specialChance: number;
/** Half of Grassland squares have a shield (`tile_grassland_has_shield`'s diagonal pattern). */
export declare const shieldChance = 0.5;
/**
 * The `Feature` rules that give a new terrain its special: at most one, unlike independent rolls, which could give a
 *  Desert both an Oasis and Oil. Which special (none, the first or the second) is drawn once per terrain, the first
 *  time a rule asks.
 */
export declare const getRules: (
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  randomNumberGenerator?: () => number
) => Feature[];
export default getRules;
