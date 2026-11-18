// Where Civilization II puts specials, Grassland shields and huts on a map it loads, by each square's position and the
//  map's seed (`map.cpp` in OpenCiv2, richardpenman/civ2: `tile_resource`, `tile_grassland_has_shield`, `tile_has_hut`).
//  Each takes the square in Civilization II's own coordinates, whose x is doubled (civ2-earth-generator's `toDoubled`):
//  two per square across, odd on an odd row.

/** The terrain number of Grassland (`data/terrain`'s order), which never has a special: its shield is apart. */
const GRASSLAND = 2;

/**
 * Which of its terrain's two specials the square at doubled (`x`, `y`) has, 1 or 2, or 0 for none (`tile_resource`):
 *  one square in each 4 by 4 block of the map's diagonals, where the seed says, and which of the two by the seed too.
 *  Grassland has none.
 */
export const specialAt = (
  x: number,
  y: number,
  seed: number,
  terrain: number
): 0 | 1 | 2 => {
  if (terrain === GRASSLAND) {
    return 0;
  }

  const u = (x + y) >> 1,
    v = x - u;

  if (
    (u & 3) + (v & 3) * 4 !==
    ((((x + y) >> 3) * 11 + (v >> 2) * 13 + seed) & 0xf)
  ) {
    return 0;
  }

  const mask = 1 << ((seed >> 4) & 3);

  return (mask & u) === (mask & v) ? 2 : 1;
};

/** Whether a Grassland square at doubled (`x`, `y`) has a shield (`tile_grassland_has_shield`): half of them. */
export const shieldAt = (x: number, y: number): boolean =>
  ((-((x + y) >> 1) - x) & 2) === 0;

/**
 * Whether a land square at doubled (`x`, `y`) that nobody owns yet has a hut (`tile_has_hut`): one square in
 *  each 4 by 4 block of the map's diagonals, in every other block, where the seed says.
 */
export const hutAt = (x: number, y: number, seed: number): boolean => {
  const u = (x + y) >> 1,
    v = x - u;

  return (
    (u & 3) + (v & 3) * 4 ===
    ((((x + y) >> 3) * 11 + (v >> 2) * 13 + seed + 8) & 0x1f)
  );
};
