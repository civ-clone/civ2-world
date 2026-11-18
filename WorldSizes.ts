import WorldSize, {
  PlayerRange,
} from '@civ-clone/core-world-generator/WorldSize';
import { CustomWorldSizeLimits } from '@civ-clone/core-world-generator/WorldSizeRegistry';

// Civilization II's world sizes (`setup_choose_map_size`): Small, Normal and Large, each counted in squares across (half
//  its doubled x) and rows down, on the staggered isometric grid. A game has from 3 to 7 civilizations whatever its size
//  (`num_enemies` is 6 less the choice, 2 to 6 rivals), 7 unless another number is chosen.

export const players: Readonly<PlayerRange> = Object.freeze({
  minPlayers: 3,
  maxPlayers: 7,
  players: 7,
});

const dimensions = Object.freeze({
  small: Object.freeze({ width: 40, height: 50 }),
  normal: Object.freeze({ width: 50, height: 80 }),
  large: Object.freeze({ width: 75, height: 120 }),
});

/** The size a world is unless the game says otherwise. */
export const normal = dimensions.normal;

export const worldSizes = (): WorldSize[] =>
  Object.entries(dimensions).map(
    ([key, { width, height }]) =>
      new WorldSize(key, width, height, {
        topologyId: 'staggered-iso',
        ...players,
      })
  );

/**
 * A size typed in instead: from 20 to 250 squares each way, and from 1,000 to 10,000 squares in all, as Civilization II
 *  allows. Its rows wrap north to south here, so the height must be even.
 */
export const customLimits: Readonly<CustomWorldSizeLimits> = Object.freeze({
  topologyId: 'staggered-iso',
  minWidth: 20,
  maxWidth: 250,
  minHeight: 20,
  maxHeight: 250,
  minArea: 1000,
  maxArea: 10000,
  ...players,
});
