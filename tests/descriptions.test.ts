import { Food, Production, Trade } from '../Yields';
import { Glacier, Ocean } from '../Terrains';
import { Irrigation, Mine, Railroad, Road } from '../TileImprovements';
import {
  RAILROAD_PRODUCTION,
  ROAD_TRADE,
  roadTradeTerrains,
} from '../Rules/Tile/yield-modifier';
import { Square, fixedWorld } from './lib/world';
import { YES, terrains } from '../data/terrain';
import { EffectDescription } from '@civ-clone/core-rule/Description';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import Rule from '@civ-clone/core-rule/Rule';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import built from '../Rules/TileImprovement/built';
import conversion from '../Rules/Terrain/conversion';
import { expect } from 'chai';
import { landTerrains } from '../Requirements';
import { terrainTypes } from '../lib/terrainTable';
import tileYield from '../Rules/Tile/yield';
import tileYieldModifier from '../Rules/Tile/yield-modifier';

// What each terrain says it gives, and what a transform makes of it, for the Civilopedia (civ-clone/web-renderer#620),
//  checked against what the rules give a square of it.

const descriptionsOf = (rules: Rule<any, any>[]): EffectDescription[] =>
  rules.flatMap((rule) => rule.descriptions());

const ofType = (type: string): EffectDescription[] =>
  descriptionsOf([...tileYield(), ...tileYieldModifier()]).filter(
    (description) => description.type === type
  );

const setUp = async (rows: Square[][]) => {
  const ruleRegistry = new RuleRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    world = await fixedWorld(rows, terrainFeatureRegistry, ruleRegistry);

  ruleRegistry.register(
    ...built(tileImprovementRegistry),
    ...tileYield(tileImprovementRegistry, terrainFeatureRegistry),
    ...tileYieldModifier(
      tileImprovementRegistry,
      new PlayerGovernmentRegistry()
    )
  );

  const yieldOf = (tile: Tile, YieldType: typeof Yield): number =>
      tile
        .yields(null)
        .filter((tileYield: Yield) => tileYield instanceof YieldType)
        .reduce((total, tileYield) => total + tileYield.value(), 0),
    build = (tile: Tile, ...Improvements: (typeof TileImprovement)[]): void => {
      Improvements.forEach(
        (Improvement) => new Improvement(tile, ruleRegistry)
      );
      tile.clearYieldCache(null);
    };

  return { build, world, yieldOf };
};

// One bare square of each of `TerrainTypes`, in a row.
const squares = (TerrainTypes: (typeof Terrain)[]) =>
  setUp([TerrainTypes.map((TerrainType): Square => [TerrainType])]);

describe('terrain descriptions', (): void => {
  it('says each yield a bare square of every terrain gives, and nothing for a 0', async (): Promise<void> => {
    const described = ofType('terrain_yield'),
      { world, yieldOf } = await squares(terrainTypes);

    terrainTypes.forEach((TerrainType, index) => {
      const tile = world.get(index, 0);

      [Food, Production, Trade].forEach((YieldType) => {
        const lines = described.filter(
            (description) =>
              description.subject === TerrainType &&
              description.yield === YieldType
          ),
          value = yieldOf(tile, YieldType);

        expect(
          lines.map(({ value }) => value),
          `${TerrainType.name} ${YieldType.name}`
        ).to.eql(value === 0 ? [] : [value]);
      });
    });

    // Every terrain but Glacier gives something.
    expect(
      terrainTypes.filter(
        (TerrainType) =>
          !described.some(({ subject }) => subject === TerrainType)
      )
    ).to.eql([Glacier]);
    expect(Object.keys(described[0])).to.eql([
      'type',
      'subject',
      'yield',
      'value',
    ]);
  });

  it('says what irrigation and a mine add where they are built in place, as the rules add it', async (): Promise<void> => {
    const described = ofType('improvement_yield').filter(
        ({ improvement }) => improvement === Irrigation || improvement === Mine
      ),
      { build, world, yieldOf } = await squares(terrainTypes);

    (
      [
        [Irrigation, Food, 5],
        [Mine, Production, 6],
      ] as [typeof TileImprovement, typeof Yield, 5 | 6][]
    ).forEach(([Improvement, YieldType, change]) => {
      const lines = described.filter(
        ({ improvement }) => improvement === Improvement
      );

      expect(
        lines.map(({ subject }) => subject),
        Improvement.name
      ).to.eql(
        terrainTypes.filter(
          (TerrainType, index) =>
            terrains[index][change][0] === YES && terrains[index][change][1] > 0
        )
      );

      lines.forEach(({ subject, yield: described, value }) => {
        const tile = world.get(terrainTypes.indexOf(subject as never), 0),
          before = yieldOf(tile, YieldType);

        build(tile, Improvement);

        expect(described).to.equal(YieldType);
        expect(yieldOf(tile, YieldType) - before, Improvement.name).to.equal(
          value
        );
      });
    });
  });

  it('says a road adds trade on the terrains it always does, as the rule adds it', async (): Promise<void> => {
    const described = ofType('improvement_yield').filter(
        ({ improvement }) => improvement === Road
      ),
      { build, world, yieldOf } = await squares(landTerrains);

    expect(described.map(({ subject }) => subject)).to.eql(roadTradeTerrains);

    landTerrains.forEach((TerrainType, index) => {
      const tile = world.get(index, 0),
        before = yieldOf(tile, Trade),
        line = described.find(({ subject }) => subject === TerrainType);

      build(tile, Road);

      expect(yieldOf(tile, Trade) - before, TerrainType.name).to.equal(
        line === undefined ? 0 : line.value
      );
    });

    described.forEach((line) => {
      expect(line.yield).to.equal(Trade);
      expect(line.value).to.equal(ROAD_TRADE);
    });
  });

  it('says a railroad adds half again of the shields on every land terrain, as the rule adds it', async (): Promise<void> => {
    const described = ofType('improvement_yield_percent'),
      { build, world, yieldOf } = await squares(landTerrains);

    expect(described.map(({ subject }) => subject)).to.eql(landTerrains);
    expect(landTerrains).not.to.include(Ocean);

    landTerrains.forEach((TerrainType, index) => {
      const tile = world.get(index, 0),
        line = described[index];

      build(tile, Mine);

      const before = yieldOf(tile, Production);

      build(tile, Road, Railroad);

      expect(line.yield).to.equal(Production);
      expect(line.improvement).to.equal(Railroad);
      expect(line.value).to.equal(RAILROAD_PRODUCTION);
      expect(yieldOf(tile, Production), TerrainType.name).to.equal(
        Math.floor(before * (1 + (line.value as number)))
      );
    });
  });

  it('says what a transform makes of each terrain, as its rule answers', (): void => {
    conversion().forEach((rule) => {
      const [line] = rule.descriptions(),
        From = line.subject as typeof Terrain,
        terrain = new From(new RuleRegistry());

      expect(Object.keys(line)).to.eql([
        'type',
        'subject',
        'terrain',
        'improvement',
      ]);
      expect(line.type).to.equal('converts_to');
      expect(rule.validate(terrain, 'transform')).to.true;
      expect(rule.process(terrain, 'transform')).to.equal(line.terrain);
    });

    expect(conversion().map((rule) => rule.descriptions()[0].subject)).to.eql(
      terrainTypes.filter((TerrainType) => TerrainType !== Ocean)
    );
  });
});
