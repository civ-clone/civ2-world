// Civilization II's own Earth (civ2-earth-generator), built as a game with the `earth` option builds it: the map's
//  terrain, with Glacier at the poles, its rivers, and the specials, shields and huts its seed places, and each tribe
//  starting where the map starts it.
import '../index';
import '@civ-clone/simple-world-generator';
import { Forest, Glacier, Grassland, Ocean, Plains } from '../Terrains';
import { River, Shield } from '../TerrainFeatures';
import {
  earthMaps,
  playedSquares,
  startTileOn,
  toDoubled,
} from '@civ-clone/civ2-earth-generator';
import { hutAt, shieldAt, specialAt } from '../lib/positional';
import { specialOf, terrainIndex } from '../lib/terrainTable';
import Built from '@civ-clone/core-world/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import { Greek } from '@civ-clone/base-civilization-greek/Greek';
import { Mongol } from '@civ-clone/base-civilization-mongol/Mongol';
import { Roman } from '@civ-clone/base-civilization-roman/Roman';
import Start from '@civ-clone/core-engine/Rules/Start';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { defaultGame } from '@civ-clone/core-game';
import { expect } from 'chai';
import fatCross from '@civ-clone/base-city-tiles-fat-cross/lib/fatCross';
import { instance as rngInstance } from '@civ-clone/core-random';

const game = defaultGame;

let resolveBuilt: ((world: World) => void) | null = null;

game.rules.register(
  new Built(
    new Effect((world: World): void => {
      resolveBuilt?.(world);
      resolveBuilt = null;
    })
  )
);

const build = (width: number, height: number): Promise<World> =>
    new Promise<World>((resolve): void => {
      resolveBuilt = resolve;
      rngInstance.restore(1, 0);
      game.rng.restore(1, 0);
      game.engine.setOption('earth', true);
      game.engine.setOption('topologyId', 'staggered-iso');
      game.engine.setOption('width', width);
      game.engine.setOption('height', height);

      game.rules.process(Start);
    }),
  playerOf = (CivilizationType: typeof Roman): Player => {
    const player = new Player(game.rules);

    player.setCivilization(new CivilizationType());

    return player;
  };

describe('Earth', (): void => {
  afterEach((): void => {
    game.engine.setOption('earth', false);
    game.engine.setOption('topologyId', 'staggered-iso');
    game.engine.setOption('width', 50);
    game.engine.setOption('height', 80);
  });

  earthMaps.forEach((map): void => {
    it(`builds the ${map.width} × ${map.height} map as the original sets it up`, async (): Promise<void> => {
      const world = await build(map.width, map.height),
        squares = playedSquares(map),
        features = (tile: Tile) =>
          game.terrainFeatures.getByTerrain(tile.terrain()),
        squareOf = (tile: Tile) => squares[tile.y() * map.width + tile.x()]!;

      expect([world.width(), world.height(), world.topologyId()]).eql([
        map.width,
        map.height,
        'staggered-iso',
      ]);

      world.tiles().forEach((tile: Tile): void => {
        const { x, y } = toDoubled({ x: tile.x(), y: tile.y() }),
          square = squareOf(tile),
          index = terrainIndex(tile.terrain()),
          special = specialOf(tile.terrain(), game.terrainFeatures),
          expected = specialAt(x, y, map.seed, index),
          where = `(${tile.x()}, ${tile.y()})`;

        expect('DPGFHMTISJO'[index], where).equal(square.letter);
        expect(
          features(tile).some((feature) => feature instanceof River),
          where
        ).equal(square.river);

        if (tile.terrain() instanceof Grassland) {
          expect(
            features(tile).some((feature) => feature instanceof Shield),
            where
          ).equal(shieldAt(x, y));
        }

        // A special where the seed says, but not on an ocean square out of every city's reach.
        const hidden =
          tile.terrain() instanceof Ocean &&
          !fatCross(tile).some((other) => other.isLand());

        expect(special?.[1] ?? 0, where).equal(hidden ? 0 : expected);

        expect(game.goodyHuts.getByTile(tile) !== null, where).equal(
          tile.isLand() && hutAt(x, y, map.seed)
        );
      });

      expect(
        world
          .tiles()
          .filter((tile) => tile.y() === 0 || tile.y() === map.height - 1)
          .every((tile) => tile.terrain() instanceof Glacier)
      ).true;
    });
  });

  it('starts each tribe where the map starts it, and one the map has no start for away from them all', async (): Promise<void> => {
    const map = earthMaps[0]!,
      world = await build(map.width, map.height),
      used: Tile[] = [],
      pick = (CivilizationType: typeof Roman): Tile => {
        const [tile] = game.rules.process(
          PickStartTile,
          world,
          playerOf(CivilizationType),
          used
        );

        used.push(tile);

        return tile;
      };

    // The Small map has no start for the Mongols: theirs is picked first, and leaves Rome's to the Romans.
    const mongol = pick(Mongol),
      rome = pick(Roman),
      start = startTileOn(map, Roman)!;

    expect([rome.x(), rome.y()]).eql([start.x, start.y]);
    expect(
      map.startTiles.some(
        ([, { x, y }]) => x === mongol.x() && y === mongol.y()
      )
    ).false;
    expect(used.length).equal(2);
  });

  it("takes the seed's hut off a square a tribe starts on, as nobody's square has one", async (): Promise<void> => {
    const map = earthMaps[0]!,
      world = await build(map.width, map.height),
      start = startTileOn(map, Greek)!,
      square = world.get(start.x, start.y),
      { x, y } = toDoubled(start);

    // The Small map's seed puts a hut on the Greeks' start.
    expect(hutAt(x, y, map.seed)).true;
    expect(game.goodyHuts.getByTile(square)).not.null;

    const [tile] = game.rules.process(
      PickStartTile,
      world,
      playerOf(Greek),
      []
    );

    expect(tile).equal(square);
    expect(game.goodyHuts.getByTile(square)).null;
  });

  it('gives a square whose terrain changes the special and shield the seed puts there, not the slot it had or a roll', async (): Promise<void> => {
    const map = earthMaps[1]!,
      world = await build(map.width, map.height),
      land = world
        .tiles()
        .filter(
          (tile: Tile) =>
            tile.isLand() && tile.y() > 0 && tile.y() < map.height - 1
        ),
      at = (tile: Tile) => toDoubled({ x: tile.x(), y: tile.y() }),
      forestSpecial = (tile: Tile) => {
        const { x, y } = at(tile);

        return specialAt(x, y, map.seed, 3);
      },
      // A square the seed gives a Forest special, and one it gives a Grassland shield and one it doesn't.
      special = land.find((tile) => forestSpecial(tile) !== 0)!,
      shielded = land.find(
        (tile) => tile !== special && shieldAt(at(tile).x, at(tile).y)
      )!,
      bare = land.find(
        (tile) =>
          tile !== special &&
          tile !== shielded &&
          !shieldAt(at(tile).x, at(tile).y)
      )!;

    // As after a load, which doesn't keep the option: the world says it's the Earth (civ-clone/web-renderer#175).
    game.engine.setOption('earth', false);

    special.setTerrain(new Grassland(game.rules));
    special.setTerrain(new Forest(game.rules));
    shielded.setTerrain(new Plains(game.rules));
    shielded.setTerrain(new Grassland(game.rules));
    bare.setTerrain(new Grassland(game.rules));

    expect(specialOf(special.terrain(), game.terrainFeatures)?.[1]).equal(
      forestSpecial(special)
    );
    expect(
      [shielded, bare].map((tile) =>
        game.terrainFeatures
          .getByTerrain(tile.terrain())
          .some((feature) => feature instanceof Shield)
      )
    ).eql([true, false]);
  });

  it('picks no other map when the option is off', async (): Promise<void> => {
    game.engine.setOption('earth', false);

    const world = await new Promise<World>((resolve): void => {
      resolveBuilt = resolve;
      rngInstance.restore(1, 0);
      game.rng.restore(1, 0);
      game.rules.process(Start);
    });

    expect([world.width(), world.height()]).eql([50, 80]);
    expect(world.tiles().filter((tile) => tile.isLand()).length).not.equal(
      playedSquares(earthMaps[1]!).filter(({ letter }) => letter !== 'O').length
    );
  });
});
