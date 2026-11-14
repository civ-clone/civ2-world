export declare const YES = -2;
export declare const NO = -1;
export type Result = number;
/** Irrigating or mining: the result, the extra food or shields it gives, the turns it takes Settlers, and the AI's government level. */
export type Change = [result: Result, bonus: number, turns: number, ai: number];
export type TerrainRow = [
  moveCost: number,
  defence: number,
  food: number,
  shields: number,
  trade: number,
  irrigation: Change,
  mining: Change,
  transform: Result
];
export type SpecialRow = [
  moveCost: number,
  defence: number,
  food: number,
  shields: number,
  trade: number
];
export declare const DESERT = 0,
  PLAINS = 1,
  GRASSLAND = 2,
  FOREST = 3,
  HILLS = 4,
  MOUNTAINS = 5,
  TUNDRA = 6,
  GLACIER = 7,
  SWAMP = 8,
  JUNGLE = 9,
  OCEAN = 10;
/** Rows 0 to 10, by terrain index. Defence is in half steps (2 is normal). */
export declare const terrains: TerrainRow[];
/**
 * Rows 11 to 32: `specials[slot - 1][terrain]`. Grassland's two (rows 13 and 24) are never placed: a Grassland square's
 *  shield comes from its own pattern instead (`map.cpp` `tile_resource`, `tile_grassland_has_shield`).
 */
export declare const specials: [SpecialRow[], SpecialRow[]];
/**
 * Rows the game uses differently from the file, which the `CIV2_PATH` test lists as exceptions. None: every number
 *  above is the file's.
 */
export declare const exceptions: string[];
