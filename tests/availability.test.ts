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
    research = new PlayerResearch(player);

  playerResearchRegistry.register(research);

  ruleRegistry.register(
    ...built(tileImprovementRegistry),
    ...available(
      playerResearchRegistry,
      tileImprovementRegistry,
      terrainFeatureRegistry
    )
  );

  const can = (tile: Tile, Improvement: typeof TileImprovement): boolean =>
    ruleRegistry
      .get(Available)
      .some((rule: Available) => rule.validate(tile, Improvement, player));

  return { can, research, ruleRegistry, tileImprovementRegistry, world };
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
  it('has no way to build Farmland while Refrigeration is pending', (): void => {
    expect(
      availableRequirements.map((requirement) => requirement.id)
    ).to.deep.equal([
      'civ2-world:tile-improvement/available/Irrigation',
      'civ2-world:tile-improvement/available/Mine',
      'civ2-world:tile-improvement/available/Road',
      'civ2-world:tile-improvement/available/bridge/Road',
      'civ2-world:tile-improvement/available/Railroad',
      'civ2-world:tile-improvement/available/Fortress',
      'civ2-world:tile-improvement/available/Airbase',
    ]);
    expect(
      availableRequirements.some(
        (requirement) => requirement.subject === Farmland
      )
    ).to.false;
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
