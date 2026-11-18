import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import { Food, Production, Trade } from '../../Yields';
import { Grassland, Plains } from '../../Terrains';
import { startTileOn, startTilesOn } from '@civ-clone/civ2-earth-generator';
import Effect from '@civ-clone/core-rule/Effect';
import { earthMapOf } from '../../lib/earth';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import StartTilePicker from '@civ-clone/base-world-start/lib/StartTilePicker';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { instance as rngInstance } from '@civ-clone/core-random';

// A simple start, after Civilization II's (`civ.cpp`, the start search in `civ_create`): on Grassland or Plains, scored
//  as its fertility is (food three times, shields twice, trade once, `map.cpp` `mapgen_calc_fertility`), on a landmass
//  with at least 32 such squares, as far as it can be from the others. Civilization II asks for 16 squares apart and
//  relaxes that as its attempts run out; this asks for each of `spacings` in turn.

export const minimumRoom = 32;

export const spacings = [16, 12, 8, 6, 4, 2, 1];

/** Map distance: steps on the grid (`map_distance`, `steps` on the staggered isometric grid). */
export const steps = (from: Tile, to: Tile): number =>
  from.map().topology().steps(from.x(), from.y(), to.x(), to.y());

let spacing = spacings[0];

// One picker for every world, so each is ranked once.
const picker = new StartTilePicker({
  TerrainTypes: [Grassland, Plains],
  weights: [
    [Food, 3],
    [Production, 2],
    [Trade, 1],
  ],
  minimumRoom,
  tooClose: (startSquare: Tile, tile: Tile): boolean =>
    steps(startSquare, tile) < spacing,
});

export const getRules = (
  engine: Engine = engineInstance,
  randomNumberGenerator: () => number = rngInstance
): PickStartTile[] => [
  new PickStartTile(
    new Effect(
      (world: World, player: Player, usedStartSquares: Tile[]): Tile => {
        // On Earth, where the map starts the player's tribe, as the original does with the map's start positions, when
        //  that square is still free; elsewhere, as on any map, away from them all.
        //  Those starts are kept clear of without being taken from the tribes still to choose theirs.
        const map = earthMapOf(world, engine);
        let used = usedStartSquares;

        if (map !== null) {
          const start = startTileOn(map, player.civilization().sourceClass());

          if (start !== null) {
            const tile = world.get(start.x, start.y);

            if (!usedStartSquares.includes(tile)) {
              return tile;
            }
          }

          used = [
            ...usedStartSquares,
            ...startTilesOn(map).map(({ x, y }) => world.get(x, y)),
          ];
        }

        const pick = (candidate: number): Tile => {
          spacing = candidate;

          return picker.pick(world, used, engine, randomNumberGenerator);
        };

        // The closest spacing's pick, if even that finds nothing, is `undefined`, as base-world-start's is.
        return (
          spacings
            .slice(0, -1)
            .reduce<Tile | undefined>(
              (found: Tile | undefined, candidate: number) =>
                found ?? pick(candidate),
              undefined
            ) ?? pick(spacings[spacings.length - 1])
        );
      }
    )
  ),
];

export default getRules;
