import { Desert, Glacier, Grassland, Ocean } from '../Terrains';
import AvailableTerrainFeatureRegistry from '@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Shield } from '../TerrainFeatures';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import created from '../Rules/Terrain/created';
import { createRng } from '@civ-clone/core-random';
import { expect } from 'chai';
import feature from '../Rules/Terrain/feature';
import { specialResourceTypes } from '../lib/terrainTable';

const setUp = () => {
  const ruleRegistry = new RuleRegistry(),
    available = new AvailableTerrainFeatureRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry();

  available.register(...specialResourceTypes, Shield);

  ruleRegistry.register(
    ...created(ruleRegistry, available),
    ...feature(terrainFeatureRegistry, createRng(1))
  );

  return { ruleRegistry, terrainFeatureRegistry };
};

describe('terrain:feature', (): void => {
  it('gives about 1 terrain in 16 one special, of its own two, and never two', (): void => {
    const { ruleRegistry, terrainFeatureRegistry } = setUp(),
      count = 8000;

    ([Desert, Glacier, Ocean] as const).forEach((TerrainType) => {
      const found = new Map<string, number>();
      let withSpecial = 0;

      for (let i = 0; i < count; i++) {
        const features = terrainFeatureRegistry.getByTerrain(
          new TerrainType(ruleRegistry)
        );

        expect(features.length).to.most(1);

        features.forEach((feature) => {
          withSpecial++;
          found.set(
            feature.constructor.name,
            (found.get(feature.constructor.name) ?? 0) + 1
          );
        });
      }

      expect(withSpecial / count, TerrainType.name).to.be.within(0.05, 0.075);
      expect([...found.keys()].sort(), TerrainType.name).to.deep.equal(
        {
          Desert: ['Oasis', 'Oil'],
          Glacier: ['Ivory', 'Oil'],
          Ocean: ['Fish', 'Whales'],
        }[TerrainType.name]
      );
    });
  });

  it('gives Grassland a Shield half the time, and no special', (): void => {
    const { ruleRegistry, terrainFeatureRegistry } = setUp(),
      count = 4000,
      shields = Array.from({ length: count }, () =>
        terrainFeatureRegistry.getByTerrain(new Grassland(ruleRegistry))
      ).filter((features) => {
        expect(features.every((feature) => feature instanceof Shield)).to.true;

        return features.length === 1;
      }).length;

    expect(shields / count).to.be.within(0.45, 0.55);
  });
});
