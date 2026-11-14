// civ2-world as the plugin loader loads it: its rules on the singletons, where the shared conversions make their new
//  terrain (`new ClearJungle.result()`), so the Created and Feature rules roll on it as in a game.
import '../index';
import { Grassland, Jungle, Swamp } from '../Terrains';
import { River, Shield } from '../TerrainFeatures';
import ClearJungle from '@civ-clone/base-unit-action-clear-jungle/ClearJungle';
import ClearSwamp from '@civ-clone/base-unit-action-clear-swamp/ClearSwamp';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { defaultGame } from '@civ-clone/core-game';
import { expect } from 'chai';
import { instance as rng } from '@civ-clone/core-random';

describe('clearing a Jungle or a Swamp, with the real conversions and civ2-world as loaded', (): void => {
  (
    [
      [ClearJungle, Jungle],
      [ClearSwamp, Swamp],
    ] as [typeof ClearJungle | typeof ClearSwamp, typeof Terrain][]
  ).forEach(([Action, TerrainType]): void => {
    it(`${Action.name}: a shield half the time, never two, and the river kept`, (): void => {
      const squares = 2000,
        terrainFeatures = defaultGame.terrainFeatures;
      let shields = 0;

      for (let seed = 1; seed <= squares; seed++) {
        rng.restore(seed, 0);

        const tile = new Tile(
          0,
          0,
          new TerrainType(),
          null as unknown as World,
          defaultGame.rules
        );

        terrainFeatures.register(new River(tile.terrain()));

        Action.complete(
          new Action(
            tile,
            tile,
            null as never,
            defaultGame.rules,
            terrainFeatures
          ) as never
        );

        const features = terrainFeatures.getByTerrain(tile.terrain()),
          count = features.filter(
            (feature) => feature instanceof Shield
          ).length;

        expect(tile.terrain(), `seed ${seed}`).to.be.instanceOf(Grassland);
        expect(count, `seed ${seed}`).to.be.at.most(1);
        expect(
          features.filter((feature) => feature instanceof River).length,
          `seed ${seed}`
        ).to.equal(1);

        shields += count;

        if (features.length > 0) {
          terrainFeatures.unregister(...features);
        }
      }

      // Half, give or take: with the conversion's roll and the new terrain's own both kept, it was about three in four.
      expect(shields / squares).to.be.within(0.46, 0.54);
    });
  });
});
