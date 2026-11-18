/**
 * Which of its terrain's two specials the square at doubled (`x`, `y`) has, 1 or 2, or 0 for none (`tile_resource`):
 *  one square in each 4 by 4 block of the map's diagonals, where the seed says, and which of the two by the seed too.
 *  Grassland has none.
 */
export declare const specialAt: (
  x: number,
  y: number,
  seed: number,
  terrain: number
) => 0 | 1 | 2;
/** Whether a Grassland square at doubled (`x`, `y`) has a shield (`tile_grassland_has_shield`): half of them. */
export declare const shieldAt: (x: number, y: number) => boolean;
/**
 * Whether a land square at doubled (`x`, `y`), with no unit or city on it, has a hut (`tile_has_hut`): one square in
 *  each 4 by 4 block of the map's diagonals, in every other block, where the seed says.
 */
export declare const hutAt: (x: number, y: number, seed: number) => boolean;
