# @civ-clone/civ2-world

Civilization II's world, the twin of civ1-world:

- the 11 terrains (Glacier new) and their 22 special resources, whose food, shields and trade replace the terrain's;
- rivers, as a `River` feature on any land terrain: +1 trade, a source of water for irrigation, and kept when the
  terrain changes, as a special is (in its slot);
- the rest of what a river does to a city site: `lib/fertility`, the fertility Civilization II gives a square when the map
  is made (huts, starts and the computer players' settlers read it), with +1 for each river square and the centre
  six times rather than four on a river; and `lib/hydro`, whether a city founded there may build a Hydro Plant (a
  river or Mountains on its square or beside it);
- the tile improvements, Farmland, Fortress and Airbase among them, where each can be built, and what each takes off;
- the tile yield steps: irrigation and mine bonuses, roads, railroads (shields only), the government's penalty and
  trade bonus, pollution;
- the interim world generator's rules (simple-world-generator's bands, Glacier at the poles, a river walk afterwards),
  huts, the world's start (staggered isometric grids only), the generator choice and where players start.

The numbers are `RULES.TXT` `@TERRAIN`'s, held in `data/terrain.ts` as numbers only. Run
`CIV2_PATH=/path/to/civ2 npm test` to check them against your own copy of the game.
