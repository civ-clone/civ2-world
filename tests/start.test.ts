// A headless world, built the way the plugin loader builds one: civ2-world and simple-world-generator imported for
//  their side effects, on core's own registries, then the game's `Start`.
import '../index';
import '@civ-clone/simple-world-generator';
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
import { River, Shield } from '../TerrainFeatures';
import { specialOf, terrainIndex } from '../lib/terrainTable';
import Built from '@civ-clone/core-world/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import Start from '@civ-clone/core-engine/Rules/Start';
import Tile from '@civ-clone/core-world/Tile';
import { UnsupportedTopologyError } from '@civ-clone/base-world-start/lib/startWorld';
import World from '@civ-clone/core-world/World';
import { defaultGame } from '@civ-clone/core-game';
import { expect } from 'chai';
import { steps } from '../Rules/Player/pick-start-tile';

const game = defaultGame;

let resolveBuilt: (world: World) => void = () => {};

game.rules.register(
  new Built(new Effect((world: World): void => resolveBuilt(world)))
);

const build = (): Promise<World> =>
  new Promise<World>((resolve): void => {
    resolveBuilt = resolve;

    game.rules.process(Start);
  });

describe('start', (): void => {
  it("refuses any grid but Civilization II's", (): void => {
    game.engine.setOption('topologyId', 'square');

    expect(() => game.rules.process(Start)).to.throw(
      UnsupportedTopologyError,
      "start: 'topologyId' is 'square', but this world can only be laid out on 'staggered-iso'."
    );

    game.engine.setOption('topologyId', 'staggered-iso');
  });

  it('builds a 50 by 80 staggered isometric world of the 11 terrains, with Glacier at the poles, specials, rivers and huts', async (): Promise<void> => {
    const world = await build(),
      tiles = world.tiles(),
      count = (test: (tile: Tile) => boolean) => tiles.filter(test).length,
      land = tiles.filter((tile) => tile.isLand()),
      byTerrain = Object.fromEntries(
        [
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
        ].map((TerrainType) => [
          TerrainType.name,
          count((tile) => tile.terrain() instanceof TerrainType),
        ])
      ),
      features = (tile: Tile) =>
        game.terrainFeatures.getByTerrain(tile.terrain()),
      withSpecial = land.filter(
        (tile) => specialOf(tile.terrain(), game.terrainFeatures) !== null
      ),
      notGrassland = tiles.filter(
        (tile) => !(tile.terrain() instanceof Grassland)
      ),
      rivers = count((tile) =>
        features(tile).some((feature) => feature instanceof River)
      ),
      huts = count((tile) => game.goodyHuts.getByTile(tile) !== null),
      poles = tiles.filter(
        (tile) => tile.isLand() && (tile.y() === 0 || tile.y() === 79)
      );

    console.log(
      `      ${JSON.stringify(byTerrain)}; land ${land.length}; specials ${
        tiles.filter((tile) => specialOf(tile.terrain(), game.terrainFeatures))
          .length
      }; shields ${count((tile) =>
        features(tile).some((feature) => feature instanceof Shield)
      )}; rivers ${rivers} squares; huts ${huts}; polar land ${poles.length}`
    );

    expect(world.topologyId()).to.equal('staggered-iso');
    expect([world.width(), world.height()]).to.deep.equal([50, 80]);
    expect(tiles.every((tile) => terrainIndex(tile.terrain()) >= 0)).to.true;
    Object.entries(byTerrain).forEach(([name, n]) =>
      expect(n, name).to.greaterThan(0)
    );
    expect(land.length / tiles.length).to.be.within(0.25, 0.4);

    // Land on the first and last rows is Glacier.
    expect(poles.every((tile) => tile.terrain() instanceof Glacier)).to.true;

    // At most one special a square, on about 1 in 16 of those that can have one.
    expect(
      tiles.every(
        (tile) =>
          features(tile).filter(
            (feature) =>
              !(feature instanceof River || feature instanceof Shield)
          ).length <= 1
      )
    ).to.true;
    expect(
      tiles.filter((tile) => specialOf(tile.terrain(), game.terrainFeatures))
        .length / notGrassland.length
    ).to.be.within(0.04, 0.09);
    expect(withSpecial.length).to.greaterThan(0);

    expect(rivers).to.greaterThan(0);
    expect(huts).to.be.within(land.length / 64, land.length / 16);
  });

  it('starts seven players on Grassland or Plains, apart', async (): Promise<void> => {
    const world = await build(),
      used: Tile[] = [];

    for (let i = 0; i < 7; i++) {
      const [tile] = game.rules.process(
        PickStartTile,
        world,
        new Player(),
        used
      );

      expect(tile).to.instanceOf(Tile);
      expect(
        tile.terrain() instanceof Grassland || tile.terrain() instanceof Plains
      ).to.true;
      used.push(tile);
    }

    used.forEach((tile, i) =>
      used
        .slice(i + 1)
        .forEach((other) => expect(steps(tile, other)).to.at.least(1))
    );
  });
});
