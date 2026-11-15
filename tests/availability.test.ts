import {
  Airbase,
  Farmland,
  Fortress,
  Irrigation,
  Mine,
  Railroad,
  Road,
} from '../TileImprovements';
import {
  BridgeBuilding,
  Construction,
  Radio,
  Railroad as RailroadAdvance,
  Refrigeration,
} from '../Advances';
import {
  Desert,
  Forest,
  Glacier,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  Swamp,
  Tundra,
} from '../Terrains';
import { Square, fixedWorld } from './lib/world';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { River } from '../TerrainFeatures';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import availableRequirements from '../Requirements';
import available from '../Rules/TileImprovement/available';
import built from '../Rules/TileImprovement/built';
import { expect } from 'chai';

const setUp = async (rows: Square[][]) => {
  const ruleRegistry = new RuleRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    world = await fixedWorld(rows, terrainFeatureRegistry, ruleRegistry),
    player = new Player(ruleRegistry),
    research = new PlayerResearch(player),
    // A stand-in: the rules only ask whether a square has a city.
    cityTiles: Tile[] = [],
    cityRegistry = {
      getByTile: (tile: Tile) => (cityTiles.includes(tile) ? {} : null),
    } as unknown as CityRegistry;

  playerResearchRegistry.register(research);

  ruleRegistry.register(
    ...built(tileImprovementRegistry),
    ...available(
      playerResearchRegistry,
      tileImprovementRegistry,
      terrainFeatureRegistry,
      cityRegistry
    )
  );

  const can = (tile: Tile, Improvement: typeof TileImprovement): boolean =>
    ruleRegistry
      .get(Available)
      .some((rule: Available) => rule.validate(tile, Improvement, player));

  return {
    can,
    cityTiles,
    research,
    ruleRegistry,
    tileImprovementRegistry,
    world,
  };
};

const land: (typeof Terrain)[] = [
  Desert,
  Plains,
  Grassland,
  Forest,
  Hills,
  Mountains,
  Tundra,
  Glacier,
  Swamp,
  Jungle,
];

describe('tile-improvement:availability', (): void => {
  it('has one way to build each tile improvement, and two for a road', (): void => {
    expect(
      availableRequirements.map((requirement) => requirement.id)
    ).to.deep.equal([
      'civ2-world:tile-improvement/available/Irrigation',
      'civ2-world:tile-improvement/available/Farmland',
      'civ2-world:tile-improvement/available/Mine',
      'civ2-world:tile-improvement/available/Road',
      'civ2-world:tile-improvement/available/bridge/Road',
      'civ2-world:tile-improvement/available/Railroad',
      'civ2-world:tile-improvement/available/Fortress',
      'civ2-world:tile-improvement/available/Airbase',
    ]);
  });

  it('builds Farmland on an irrigated square beside water, with Refrigeration (`unit_cmd_terraform`, order 6)', async (): Promise<void> => {
    const { can, research, ruleRegistry, world } = await setUp([
        [[Grassland], [Plains], [Mountains]],
        [[Ocean], [Ocean], [Ocean]],
      ]),
      [grassland, plains] = world.tiles();

    new Irrigation(grassland, ruleRegistry);

    // Not before Refrigeration.
    expect(can(grassland, Farmland)).to.false;

    research.addAdvance(Refrigeration);

    expect(can(grassland, Farmland)).to.true;
    // Not on a square that isn't irrigated: the order irrigates it first.
    expect(can(plains, Farmland)).to.false;
    expect(can(plains, Irrigation)).to.true;

    // Irrigation and Farmland are never both offered: the order does one or the other.
    expect(can(grassland, Irrigation)).to.false;

    new Farmland(grassland, ruleRegistry);

    // Not twice.
    expect(can(grassland, Farmland)).to.false;
  });

  it("doesn't build Farmland on a city's square, or where irrigation changes the terrain", async (): Promise<void> => {
    const { can, cityTiles, research, ruleRegistry, world } = await setUp([
        [[Grassland], [Mountains], [Forest]],
        [[Ocean], [Ocean], [Ocean]],
      ]),
      city = world.get(0, 0),
      forest = world.get(2, 0);

    research.addAdvance(Refrigeration);

    // A city's square is irrigated (civ2-city), but is never farmed (`unit_cmd_terraform` refuses a city's square).
    [city, forest].forEach((tile) => new Irrigation(tile, ruleRegistry));
    cityTiles.push(city);

    expect(can(city, Farmland)).to.false;
    // Beside the sea, but Forest's irrigation order makes Plains.
    expect(can(forest, Farmland)).to.false;

    cityTiles.splice(0);

    expect(can(city, Farmland)).to.true;
  });

  it('builds an airbase with Radio, but not on a fortress (`unit_cmd_terraform`)', async (): Promise<void> => {
    const { can, research, ruleRegistry, world } = await setUp([
        [[Hills], [Plains]],
      ]),
      [tile, fortified] = world.tiles();

    expect(can(tile, Airbase)).to.false;

    research.addAdvance(Radio);
    research.addAdvance(Construction);
    new Fortress(fortified, ruleRegistry);

    expect(can(tile, Airbase)).to.true;
    expect(can(fortified, Airbase)).to.false;
  });

  it('irrigates Desert, Plains, Grassland, Hills and Tundra beside water', async (): Promise<void> => {
    // Each terrain on the top row, above Ocean; the same again on the bottom row, with only land around it.
    const { can, world } = await setUp([
      land.map((TerrainType): Square => [TerrainType]),
      land.map((): Square => [Ocean]),
      land.map((TerrainType): Square => [TerrainType]),
      land.map((): Square => [Mountains]),
      land.map((TerrainType): Square => [TerrainType]),
    ]);

    expect(
      land.filter((TerrainType, x) => can(world.get(x, 0), Irrigation))
    ).to.deep.equal([Desert, Plains, Grassland, Hills, Tundra]);
    // Row 4 has Mountains above and wraps to row 0's land below: no water.
    expect(land.filter((TerrainType, x) => can(world.get(x, 4), Irrigation))).to
      .empty;
  });

  it('counts a river, on the square or beside it, and irrigation beside it, as water', async (): Promise<void> => {
    const { can, ruleRegistry, world } = await setUp([
      [
        [Mountains],
        [Mountains],
        [Mountains],
        [Mountains],
        [Mountains],
        [Mountains],
      ],
      [
        [Plains, River],
        [Mountains],
        [Plains],
        [Grassland],
        [Plains],
        [Mountains],
      ],
      [
        [Mountains],
        [Mountains],
        [Plains, River],
        [Mountains],
        [Mountains],
        [Mountains],
      ],
    ]);

    expect(can(world.get(0, 1), Irrigation)).to.true;
    expect(can(world.get(2, 1), Irrigation)).to.true;
    expect(can(world.get(3, 1), Irrigation)).to.false;

    new Irrigation(world.get(2, 1), ruleRegistry);

    expect(can(world.get(3, 1), Irrigation)).to.true;
    expect(can(world.get(4, 1), Irrigation)).to.false;
  });

  it('mines Desert, Hills, Mountains and Glacier', async (): Promise<void> => {
    const { can, world } = await setUp([
      land.map((TerrainType): Square => [TerrainType]),
    ]);

    expect(
      land.filter((TerrainType, x) => can(world.get(x, 0), Mine))
    ).to.deep.equal([Desert, Hills, Mountains, Glacier]);
  });

  it('builds a road on any land, and on a river with Bridge Building', async (): Promise<void> => {
    const { can, research, world } = await setUp([
      [[Glacier], [Forest, River], [Ocean]],
    ]);

    expect(can(world.get(0, 0), Road)).to.true;
    expect(can(world.get(1, 0), Road)).to.false;
    expect(can(world.get(2, 0), Road)).to.false;

    research.addAdvance(BridgeBuilding);

    expect(can(world.get(1, 0), Road)).to.true;
  });

  it('builds a railroad on a road with Railroad, and a fortress with Construction', async (): Promise<void> => {
    const { can, research, ruleRegistry, world } = await setUp([[[Hills]]]),
      tile = world.get(0, 0);

    expect(can(tile, Railroad)).to.false;
    expect(can(tile, Fortress)).to.false;

    new Road(tile, ruleRegistry);
    research.addAdvance(RailroadAdvance);
    research.addAdvance(Construction);

    expect(can(tile, Railroad)).to.true;
    expect(can(tile, Fortress)).to.true;
  });

  // Civ2 keeps a square's irrigation and mine as two bits, and farmland is both (`TILE_FARMLAND`, 0xc): a mine order on
  //  farmland clears the irrigation bit and leaves a mine, an irrigation order on a mine clears the mine bit, and
  //  farmland is built by setting both on an irrigated square (`unit.cpp` `unit_terrain_work_finish`, orders 6 and 7).
  it('takes the irrigation and farmland off for a mine, the mine for irrigation, an airbase for a fortress', async (): Promise<void> => {
    const { ruleRegistry, tileImprovementRegistry, world } = await setUp([
        [[Hills]],
      ]),
      tile = world.get(0, 0),
      names = (): string[] =>
        tileImprovementRegistry
          .getByTile(tile)
          .map((improvement) => improvement.constructor.name);

    new Irrigation(tile, ruleRegistry);
    new Farmland(tile, ruleRegistry);
    expect(names()).to.deep.equal(['Irrigation', 'Farmland']);

    new Mine(tile, ruleRegistry);
    expect(names()).to.deep.equal(['Mine']);

    new Irrigation(tile, ruleRegistry);
    expect(names()).to.deep.equal(['Irrigation']);

    new Airbase(tile, ruleRegistry);
    new Fortress(tile, ruleRegistry);
    expect(names()).to.deep.equal(['Irrigation', 'Fortress']);
  });
});
