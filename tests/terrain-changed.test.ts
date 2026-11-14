import {
  Buffalo,
  Pheasant,
  River,
  Shield,
  Silk,
  Wheat,
} from '../TerrainFeatures';
import { Forest, Grassland, Plains, Swamp } from '../Terrains';
import {
  specialOf,
  specialResourceTypes,
  specialSlot,
} from '../lib/terrainTable';
import AvailableTerrainFeatureRegistry from '@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry';
import { Food } from '../Yields';
import { PLAINS } from '../data/terrain';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import tileYield from '../Rules/Tile/yield';
import created from '../Rules/Terrain/created';
import { createRng } from '@civ-clone/core-random';
import feature from '../Rules/Terrain/feature';
import { Square, fixedWorld } from './lib/world';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import { expect } from 'chai';
import terrainChanged from '../Rules/Tile/terrain-changed';

const setUp = async (rows: Square[][]) => {
  const ruleRegistry = new RuleRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    world = await fixedWorld(rows, terrainFeatureRegistry, ruleRegistry);

  ruleRegistry.register(...terrainChanged(terrainFeatureRegistry));

  const names = (terrain: Terrain): string[] =>
    terrainFeatureRegistry
      .getByTerrain(terrain)
      .map((feature) => feature.constructor.name);

  return { names, ruleRegistry, terrainFeatureRegistry, world };
};

describe('tile:terrain-changed', (): void => {
  it('keeps the special in its slot and the river with the square', async (): Promise<void> => {
    const { names, ruleRegistry, terrainFeatureRegistry, world } = await setUp([
        [
          [Forest, Pheasant, River],
          [Forest, Silk],
          [Forest, Pheasant],
          [Forest, River],
        ],
      ]),
      [pheasant, silk, toGrassland, river] = world.tiles(),
      before = pheasant.terrain();

    pheasant.setTerrain(new Plains(ruleRegistry));
    silk.setTerrain(new Plains(ruleRegistry));
    toGrassland.setTerrain(new Grassland(ruleRegistry));
    river.setTerrain(new Swamp(ruleRegistry));

    expect(names(pheasant.terrain())).to.deep.equal(['River', 'Buffalo']);
    expect(names(silk.terrain())).to.deep.equal(['Wheat']);
    expect(names(toGrassland.terrain())).to.deep.equal([]);
    expect(names(river.terrain())).to.deep.equal(['River']);
    // Nothing is left on the old terrain.
    expect(terrainFeatureRegistry.getByTerrain(before)).to.deep.equal([]);
  });

  it('takes off a special the new terrain was given when made, but keeps a Grassland shield', async (): Promise<void> => {
    const { names, ruleRegistry, terrainFeatureRegistry, world } = await setUp([
        [[Forest], [Swamp]],
      ]),
      [forest, swamp] = world.tiles(),
      plains = new Plains(ruleRegistry),
      grassland = new Grassland(ruleRegistry);

    terrainFeatureRegistry.register(new Wheat(plains), new Shield(grassland));

    forest.setTerrain(plains);
    swamp.setTerrain(grassland);

    expect(names(forest.terrain())).to.deep.equal([]);
    expect(names(swamp.terrain())).to.deep.equal(['Shield']);
  });

  it('carries a special from a terrain with one to the same slot of another', async (): Promise<void> => {
    const { names, ruleRegistry, world } = await setUp([[[Plains, Buffalo]]]),
      [tile]: Tile[] = world.tiles();

    tile.setTerrain(new Forest(ruleRegistry));

    expect(names(tile.terrain())).to.deep.equal(['Pheasant']);
  });
});

describe('tile:terrain-changed, with the real Created and Feature rules', (): void => {
  it('leaves a square with its own special, in its slot, or none: never one the new terrain rolled as well', async (): Promise<void> => {
    let squares = 0,
      rolledOnPlains = 0;

    for (let seed = 1; seed <= 60; seed++) {
      const ruleRegistry = new RuleRegistry(),
        available = new AvailableTerrainFeatureRegistry(),
        terrainFeatureRegistry = new TerrainFeatureRegistry();

      available.register(...specialResourceTypes, Shield, River);

      ruleRegistry.register(
        ...created(ruleRegistry, available),
        ...feature(terrainFeatureRegistry, createRng(seed))
      );

      const world = await fixedWorld(
        [
          Array.from(
            { length: 20 },
            (column, x): Square =>
              x % 3 === 0
                ? [Forest, Pheasant]
                : x % 3 === 1
                ? [Forest, Silk]
                : [Forest]
          ),
        ],
        terrainFeatureRegistry,
        ruleRegistry
      );

      // The world's own Forests may have rolled a special too: what each square starts with is what it holds now.
      const before = world
        .tiles()
        .map((tile) => specialOf(tile.terrain(), terrainFeatureRegistry));

      ruleRegistry.register(...terrainChanged(terrainFeatureRegistry));

      world.tiles().forEach((tile, x) => {
        const plains = new Plains(ruleRegistry);

        rolledOnPlains += specialOf(plains, terrainFeatureRegistry) ? 1 : 0;

        tile.setTerrain(plains);

        const specials = terrainFeatureRegistry
            .getByTerrain(tile.terrain())
            .filter((feature) => specialSlot(PLAINS, feature) !== 0),
          expected = before[x] ? [[Buffalo, Wheat][before[x]![1] - 1]] : [];

        expect(
          specials.map((feature) => feature.constructor),
          `seed ${seed}, square ${x}`
        ).to.deep.equal(expected);

        squares++;
      });
    }

    expect(squares).to.equal(1200);
    // The hazard is real: some new Plains rolled a special of their own, which the rule took off again.
    expect(rolledOnPlains).to.above(20);
  });
});

describe('tile:terrain-changed, yields', (): void => {
  it('works the square’s yields out again, for nobody and for each player', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      terrainFeatureRegistry = new TerrainFeatureRegistry(),
      playerRegistry = new PlayerRegistry(),
      player = new Player(ruleRegistry),
      world = await fixedWorld(
        [[[Forest]]],
        terrainFeatureRegistry,
        ruleRegistry
      ),
      [tile] = world.tiles(),
      food = (who: Player | null): number =>
        tile
          .yields(who)
          .filter((tileYield) => tileYield instanceof Food)
          .reduce((total, tileYield) => total + tileYield.value(), 0);

    playerRegistry.register(player);
    ruleRegistry.register(
      ...tileYield(new TileImprovementRegistry(), terrainFeatureRegistry),
      ...terrainChanged(terrainFeatureRegistry, playerRegistry)
    );

    expect([food(null), food(player)]).to.deep.equal([1, 1]);

    tile.setTerrain(new Grassland(ruleRegistry));

    expect([food(null), food(player)]).to.deep.equal([2, 2]);
  });
});
