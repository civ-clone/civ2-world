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
import {
  Farmland,
  Fortress,
  Irrigation,
  Mine,
  Road,
} from '../TileImprovements';
import { Square, fixedWorld } from './lib/world';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import TransformTerrain from '@civ-clone/base-unit-action-transform-terrain/TransformTerrain';
import built from '../Rules/TileImprovement/built';
import conversion from '../Rules/Terrain/conversion';
import { conversionOf } from '@civ-clone/base-unit-action-transform-terrain/lib/conversion';
import { expect } from 'chai';
import removed from '../Rules/TileImprovement/removed';
import terrainChangedImprovements from '../Rules/Tile/terrain-changed-improvements';

describe('terrain:conversion/transform', (): void => {
  it("transforms each land terrain as @TERRAIN's transform column says, and Ocean not at all", (): void => {
    const ruleRegistry = new RuleRegistry();

    ruleRegistry.register(...conversion());

    // RULES.TXT @TERRAIN rows 0-10, the transform column (OpenCiv2 `rules_terrain[]`).
    expect(
      [
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
        Ocean,
      ].map(
        (TerrainType) =>
          conversionOf(ruleRegistry, new TerrainType(), TransformTerrain.kind)
            ?.name ?? null
      )
    ).to.deep.equal([
      'Plains',
      'Grassland',
      'Hills',
      'Grassland',
      'Plains',
      'Hills',
      'Desert',
      'Tundra',
      'Plains',
      'Plains',
      null,
    ]);
    // Only the transform kind is answered.
    expect(conversionOf(ruleRegistry, new Desert(), 'irrigate')).to.undefined;
  });
});

describe('tile:terrain-changed/improvements', (): void => {
  const setUp = async (rows: Square[][]) => {
    const ruleRegistry = new RuleRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      world = await fixedWorld(
        rows,
        new TerrainFeatureRegistry(),
        ruleRegistry
      );

    ruleRegistry.register(
      ...built(tileImprovementRegistry),
      ...removed(tileImprovementRegistry),
      ...terrainChangedImprovements(tileImprovementRegistry, ruleRegistry)
    );

    return { ruleRegistry, tileImprovementRegistry, world };
  };

  it('drops irrigation and farmland where the new terrain is not irrigated in place, and keeps the road', async (): Promise<void> => {
    const { ruleRegistry, tileImprovementRegistry, world } = await setUp([
        [[Grassland]],
      ]),
      [tile] = world.tiles();

    new Road(tile, ruleRegistry);
    new Irrigation(tile, ruleRegistry);
    new Farmland(tile, ruleRegistry);

    // Grassland transforms to Hills, irrigated in place: kept.
    tile.setTerrain(new Hills(ruleRegistry));
    expect(
      tileImprovementRegistry.getByTile(tile).map((i) => i.constructor.name)
    ).to.deep.equal(['Road', 'Irrigation', 'Farmland']);

    // Hills become Plains... then Forest, which is irrigated into Plains, not in place: dropped.
    tile.setTerrain(new Forest(ruleRegistry));
    expect(
      tileImprovementRegistry.getByTile(tile).map((i) => i.constructor.name)
    ).to.deep.equal(['Road']);
  });

  it('drops a mine where the new terrain is not mined in place, and keeps a fortress', async (): Promise<void> => {
    const { ruleRegistry, tileImprovementRegistry, world } = await setUp([
        [[Hills]],
      ]),
      [tile] = world.tiles();

    new Mine(tile, ruleRegistry);
    new Fortress(tile, ruleRegistry);

    // Hills transform to Plains, whose mine order makes a Forest.
    tile.setTerrain(new Plains(ruleRegistry));
    expect(
      tileImprovementRegistry.getByTile(tile).map((i) => i.constructor.name)
    ).to.deep.equal(['Fortress']);
  });
});
