# @civ-clone/civ2-world

Civilization II's world, the twin of civ1-world:

- the 11 terrains (Glacier new) and their 22 special resources, whose food, shields and trade replace the terrain's;
- rivers, as a `River` feature on any land terrain: +1 trade, a source of water for irrigation, and kept when the
  terrain changes, as a special is (in its slot);
- the rest of what a river does to a city site: `lib/fertility`, the fertility Civilization II gives a square when the map
  is made (huts, starts and the computer players' settlers read it), with +1 for each river square and the centre
  six times rather than four on a river; and `lib/hydro`, whether a city founded there may build a Hydro Plant (a
  river or Mountains on its square or beside it);
- the tile improvements, Farmland, Fortress and Airbase among them, where each can be built (an Airbase with Radio;
  Farmland with Refrigeration on an irrigated square that isn't a city's), and what each takes off. Farmland keeps its
  square's Irrigation and the irrigation bonus, and gets no mine bonus. The orders that build them, `BuildFarmland`
  among them (base-unit-action-build-farmland), and the turns each takes, are civ2-unit's;
- what an Engineers' transform makes of each terrain (`Rules/Terrain/conversion`, `TerrainConversion` rules from the
  transform column), and the irrigation, farmland or mine a square loses when its new terrain isn't improved in place;
- the tile yield steps: irrigation and mine bonuses, roads, railroads (shields only), the government's penalty and
  trade bonus, pollution;
- the interim world generator's rules (simple-world-generator's bands, Glacier at the poles, a river walk afterwards),
  huts, the world's start (on Civilization II's staggered isometric grid by default, or the square or hexagonal grid), the generator choice and where players start;
- Civilization II's own Earth (civ2-earth-generator), with the `earth` option: its terrain with Glacier at the poles,
  its rivers, each tribe starting where the map starts it, and the specials, Grassland shields and huts placed from the
  map's seed and each square's position, as the original places them (`lib/positional`, from `map.cpp`'s
  `tile_resource`, `tile_grassland_has_shield` and `tile_has_hut`), with an ocean special out of every city's reach
  hidden (`lib/earth`);
- the world sizes a new game is offered (`WorldSizes`, registered with core-world-generator's `WorldSizeRegistry`):
  Small 40 × 50, Normal 50 × 80 and Large 75 × 120, each with 3 to 7 civilizations (7 unless another number is chosen)
  and an Earth map,
  and a size typed in from 20 to 250 squares each way and 1,000 to 10,000 in all.

The numbers are `RULES.TXT` `@TERRAIN`'s, held in `data/terrain.ts` as numbers only. Run
`CIV2_PATH=/path/to/civ2 npm test` to check them against your own copy of the game.
