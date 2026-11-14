import { Grassland, Ocean, Plains } from '../Terrains';
import pickStartTile, {
  minimumRoom,
  steps,
} from '../Rules/Player/pick-start-tile';
import Engine from '@civ-clone/core-engine/Engine';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Square } from './lib/world';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import { createRng } from '@civ-clone/core-random';
import { expect } from 'chai';
import { fixedWorld } from './lib/world';

// A 40 by 40 continent of Grassland and Plains in a 44 by 44 sea.
const continent = (): Square[][] =>
  Array.from({ length: 44 }, (row, y) =>
    Array.from(
      { length: 44 },
      (column, x): Square =>
        x < 2 || x >= 42 || y < 2 || y >= 42
          ? [Ocean]
          : [(x + y) % 2 ? Plains : Grassland]
    )
  );

describe('player:pick-start-tile', (): void => {
  it('starts players 16 apart while it can, then closer', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      world = await fixedWorld(
        continent(),
        new TerrainFeatureRegistry(),
        ruleRegistry
      ),
      used: Tile[] = [];

    ruleRegistry.register(...pickStartTile(new Engine(), createRng(3)));

    for (let i = 0; i < 12; i++) {
      const [tile] = ruleRegistry.process(
        PickStartTile,
        world,
        new Player(ruleRegistry),
        used
      );

      expect(tile, `player ${i}`).to.instanceOf(Tile);
      used.push(tile);
    }

    const nearest = (index: number): number =>
      Math.min(
        ...used
          .slice(0, index)
          .map((other: Tile): number => steps(used[index], other))
      );

    // A 40 by 40 continent holds a few starts 16 apart; the others relax.
    expect(nearest(1)).to.at.least(16);
    expect(used.slice(1).every((tile, index) => nearest(index + 1) >= 1)).to
      .true;
    expect(used.slice(1).some((tile, index) => nearest(index + 1) < 16)).to
      .true;
    expect(minimumRoom).to.equal(32);
  });

  it('starts no one on a landmass with fewer than 32 Grassland or Plains while a bigger one has room', async (): Promise<void> => {
    // The continent, and a 4 by 4 island of 16 squares to its east.
    const rows = continent().map((row: Square[], y: number): Square[] => [
        ...row,
        ...Array.from(
          { length: 12 },
          (column, x): Square =>
            x >= 4 && x < 8 && y >= 10 && y < 14 ? [Grassland] : [Ocean]
        ),
      ]),
      onIsland = (tile: Tile): boolean => tile.x() >= 44;

    for (let seed = 1; seed <= 20; seed++) {
      const ruleRegistry = new RuleRegistry(),
        world = await fixedWorld(
          rows,
          new TerrainFeatureRegistry(),
          ruleRegistry
        );

      ruleRegistry.register(...pickStartTile(new Engine(), createRng(seed)));

      const [tile] = ruleRegistry.process(
        PickStartTile,
        world,
        new Player(ruleRegistry),
        []
      );

      expect(onIsland(tile), `seed ${seed}`).to.false;
      expect(
        tile.terrain() instanceof Grassland || tile.terrain() instanceof Plains
      ).to.true;
    }
  });
});
