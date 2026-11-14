import { Grassland, Hills, Mountains, Ocean, Plains } from '../Terrains';
import placeRivers, {
  distanceToSea,
  landSquaresPerRiver,
  minimumLength,
} from '../lib/placeRivers';
import { River } from '../TerrainFeatures';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Square } from './lib/world';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import { createRng } from '@civ-clone/core-random';
import { expect } from 'chai';
import { fixedWorld } from './lib/world';
import { hasRiver } from '../lib/river';

// A 40 by 40 island in a 48 by 48 sea, mostly Plains and Grassland, with a ridge of Hills and some Mountains.
const island = (): Square[][] =>
  Array.from({ length: 48 }, (row, y) =>
    Array.from({ length: 48 }, (column, x): Square => {
      if (x < 4 || x >= 44 || y < 4 || y >= 44) {
        return [Ocean];
      }

      if (x === 24) {
        return [Hills];
      }

      if ((x * 7 + y * 3) % 11 === 0) {
        return [Mountains];
      }

      return [(x + y) % 2 ? Plains : Grassland];
    })
  );

describe('rivers', (): void => {
  it('never run uphill, along edges, from a source to the sea or another river', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      terrainFeatureRegistry = new TerrainFeatureRegistry(),
      world = await fixedWorld(island(), terrainFeatureRegistry, ruleRegistry),
      distances = distanceToSea(world),
      rivers = placeRivers(world, terrainFeatureRegistry, createRng(7)),
      riverSquares = rivers.flat(),
      land = world.filter((tile: Tile) => tile.isLand()).length;

    expect(rivers.length).to.equal(Math.round(land / landSquaresPerRiver));

    rivers.forEach((river: Tile[]): void => {
      expect(river.length).to.at.least(minimumLength);

      river.forEach((tile: Tile, index: number): void => {
        expect(tile.terrain()).not.to.instanceOf(Hills);
        expect(tile.terrain()).not.to.instanceOf(Mountains);
        expect(hasRiver(tile, terrainFeatureRegistry)).to.true;

        if (index > 0) {
          expect(river[index - 1].getAdjacent()).to.include(tile);
          expect(distances.get(tile)).to.at.most(
            distances.get(river[index - 1])!
          );
        }
      });

      const mouth = river[river.length - 1];

      expect(
        mouth
          .getAdjacent()
          .some(
            (tile: Tile) =>
              tile.isWater() ||
              (!river.includes(tile) && riverSquares.includes(tile))
          )
      ).to.true;
    });

    // Nothing but the rivers' squares has one, each once.
    expect(
      terrainFeatureRegistry
        .entries()
        .filter((feature) => feature instanceof River).length
    ).to.equal(riverSquares.length);
  });
});
