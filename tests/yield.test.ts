import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '../Governments';
import {
  Desert,
  Forest,
  Glacier,
  Grassland,
  Hills,
  Mountains,
  Ocean,
  Plains,
  Swamp,
} from '../Terrains';
import { Food, Production, Trade } from '../Yields';
import {
  Farmland,
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road,
} from '../TileImprovements';
import { Oil, River, Shield, Wine } from '../TerrainFeatures';
import { Square, fixedWorld } from './lib/world';
import { specialTypes, terrainTypes } from '../lib/terrainTable';
import { specials, terrains } from '../data/terrain';
import AvailableGovernmentRegistry from '@civ-clone/core-government/AvailableGovernmentRegistry';
import Government from '@civ-clone/core-government/Government';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import built from '../Rules/TileImprovement/built';
import { expect } from 'chai';
import tileYield from '../Rules/Tile/yield';
import tileYieldModifier from '../Rules/Tile/yield-modifier';

const setUp = async (rows: Square[][]) => {
  const ruleRegistry = new RuleRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    availableGovernmentRegistry = new AvailableGovernmentRegistry(),
    world = await fixedWorld(rows, terrainFeatureRegistry, ruleRegistry);

  availableGovernmentRegistry.register(
    Anarchy,
    Communism,
    Democracy,
    Despotism,
    Monarchy,
    Republic
  );

  ruleRegistry.register(
    ...built(tileImprovementRegistry),
    ...tileYield(tileImprovementRegistry, terrainFeatureRegistry),
    ...tileYieldModifier(tileImprovementRegistry, playerGovernmentRegistry)
  );

  const fst = (tile: Tile, player: Player | null = null): number[] =>
      [Food, Production, Trade].map((YieldType) =>
        tile
          .yields(player)
          .filter((tileYield: Yield) => tileYield instanceof YieldType)
          .reduce((total, tileYield) => total + tileYield.value(), 0)
      ),
    build = (tile: Tile, ...Improvements: (typeof TileImprovement)[]): void => {
      Improvements.forEach(
        (Improvement) => new Improvement(tile, ruleRegistry)
      );
      tile.clearYieldCache(null);
    },
    playerWith = (GovernmentType: typeof Government): Player => {
      const player = new Player(ruleRegistry),
        government = new PlayerGovernment(
          player,
          availableGovernmentRegistry,
          ruleRegistry
        );

      government.set(new GovernmentType());
      playerGovernmentRegistry.register(government);

      return player;
    };

  return { build, fst, playerWith, ruleRegistry, world };
};

describe('tile:yield', (): void => {
  it('is the terrain row, or the special row that replaces it (RULES.TXT @TERRAIN)', async (): Promise<void> => {
    const squares: Square[] = terrainTypes.flatMap((TerrainType, index) => [
        [TerrainType, ...(index === 2 ? [Shield] : [])] as Square,
        ...([0, 1] as const)
          .filter((slot) => specialTypes[slot][index] !== null)
          .map((slot) => [TerrainType, specialTypes[slot][index]!] as Square),
      ]),
      expected = terrainTypes.flatMap((TerrainType, index) => [
        terrains[index].slice(2, 5),
        ...([0, 1] as const)
          .filter((slot) => specialTypes[slot][index] !== null)
          .map((slot) => specials[slot][index].slice(2, 5)),
      ]),
      { fst, world } = await setUp([squares]);

    expect(squares.length).to.equal(31);
    expect(world.tiles().map((tile) => fst(tile))).to.deep.equal(expected);
  });

  it('gives Grassland no shield without its Shield', async (): Promise<void> => {
    const { fst, world } = await setUp([[[Grassland], [Grassland, Shield]]]);

    expect(fst(world.get(0, 0))).to.deep.equal([2, 0, 0]);
    expect(fst(world.get(1, 0))).to.deep.equal([2, 1, 0]);
  });

  it('adds the terrain row’s irrigation and mine bonuses, also to a special', async (): Promise<void> => {
    const { build, fst, world } = await setUp([
      [[Desert], [Hills], [Hills, Wine], [Glacier, Oil], [Mountains]],
    ]);

    build(world.get(0, 0), Irrigation);
    build(world.get(1, 0), Mine);
    build(world.get(2, 0), Irrigation);
    build(world.get(3, 0), Mine);
    build(world.get(4, 0), Mine);

    expect(fst(world.get(0, 0))).to.deep.equal([1, 1, 0]);
    expect(fst(world.get(1, 0))).to.deep.equal([1, 3, 0]);
    expect(fst(world.get(2, 0))).to.deep.equal([2, 0, 4]);
    expect(fst(world.get(3, 0))).to.deep.equal([0, 5, 0]);
    expect(fst(world.get(4, 0))).to.deep.equal([0, 2, 0]);
  });

  // Farmland is the irrigation and mine bits together (0xc): the food bonus is for the irrigation bit, and the mine bonus
  //  only for a mine without irrigation (`city.cpp` `city_tile_yield`: `(improv_bits & 0xc) == 8`). What Farmland adds
  //  itself, +50% food with a Supermarket, is the city's.
  it('keeps the irrigation bonus on Farmland, and gives it no mine bonus', async (): Promise<void> => {
    const { build, fst, world } = await setUp([[[Hills], [Grassland]]]);

    build(world.get(0, 0), Irrigation, Farmland);
    build(world.get(1, 0), Irrigation, Farmland);

    expect(fst(world.get(0, 0))).to.deep.equal([2, 0, 0]);
    expect(fst(world.get(1, 0))).to.deep.equal([3, 0, 0]);
  });

  it('gives +1 trade for a river, on any terrain', async (): Promise<void> => {
    const { fst, world } = await setUp([
      [
        [Forest, River],
        [Hills, River],
      ],
    ]);

    expect(fst(world.get(0, 0))).to.deep.equal([1, 2, 1]);
    expect(fst(world.get(1, 0))).to.deep.equal([1, 0, 1]);
  });

  it('gives +1 trade for a road on Desert, Plains and Grassland, or where there is trade already', async (): Promise<void> => {
    const { build, fst, world } = await setUp([
      [[Desert], [Plains], [Grassland], [Forest], [Forest, River], [Swamp]],
    ]);

    world.tiles().forEach((tile) => build(tile, Road));

    expect(world.tiles().map((tile) => fst(tile)[2])).to.deep.equal([
      1, 1, 1, 0, 2, 0,
    ]);
  });

  it('gives a railroad half again of the shields only, rounded down', async (): Promise<void> => {
    const { build, fst, world } = await setUp([
      [[Hills], [Forest, River], [Plains]],
    ]);

    build(world.get(0, 0), Mine, Road, Railroad);
    build(world.get(1, 0), Road, Railroad);
    build(world.get(2, 0), Road, Railroad);

    // Hills: 0 + 3 = 3, × 1.5 = 4. Forest: 2 → 3, and its trade (1 river + 1 road) isn't touched.
    expect(fst(world.get(0, 0))).to.deep.equal([1, 4, 0]);
    expect(fst(world.get(1, 0))).to.deep.equal([1, 3, 2]);
    expect(fst(world.get(2, 0))).to.deep.equal([1, 1, 1]);
  });

  it('takes 1 off a yield of more than 2 below Monarchy, and adds 1 to trade under The Republic and Democracy', async (): Promise<void> => {
    const { build, fst, playerWith, world } = await setUp([
      [[Hills], [Ocean], [Plains]],
    ]);

    build(world.get(0, 0), Mine);

    const hills = world.get(0, 0),
      ocean = world.get(1, 0),
      plains = world.get(2, 0);

    (
      [
        [Anarchy, [1, 2, 0], [1, 0, 2], [1, 1, 0]],
        [Despotism, [1, 2, 0], [1, 0, 2], [1, 1, 0]],
        [Monarchy, [1, 3, 0], [1, 0, 2], [1, 1, 0]],
        [Communism, [1, 3, 0], [1, 0, 2], [1, 1, 0]],
        [Republic, [1, 3, 0], [1, 0, 3], [1, 1, 0]],
        [Democracy, [1, 3, 0], [1, 0, 3], [1, 1, 0]],
      ] as [typeof Government, number[], number[], number[]][]
    ).forEach(([GovernmentType, onHills, onOcean, onPlains]) => {
      const player = playerWith(GovernmentType);

      expect(fst(hills, player), GovernmentType.name).to.deep.equal(onHills);
      expect(fst(ocean, player), GovernmentType.name).to.deep.equal(onOcean);
      expect(fst(plains, player), GovernmentType.name).to.deep.equal(onPlains);
    });

    // No player, or one with no government yet: no step.
    expect(fst(hills)).to.deep.equal([1, 3, 0]);
    expect(fst(hills, new Player())).to.deep.equal([1, 3, 0]);
  });

  it('halves everything, rounded up, under pollution, last', async (): Promise<void> => {
    const { build, fst, world } = await setUp([[[Hills, Wine], [Ocean]]]);

    build(world.get(0, 0), Mine, Pollution);
    build(world.get(1, 0), Pollution);

    expect(fst(world.get(0, 0))).to.deep.equal([1, 2, 2]);
    expect(fst(world.get(1, 0))).to.deep.equal([1, 0, 1]);
  });
});
