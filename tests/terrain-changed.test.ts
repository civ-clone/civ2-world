import {
  Buffalo,
  Pheasant,
  River,
  Shield,
  Silk,
  Wheat,
} from '../TerrainFeatures';
import { Forest, Grassland, Plains, Swamp } from '../Terrains';
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
