import { Engine } from '@civ-clone/core-engine/Engine';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Tile from '@civ-clone/core-world/Tile';
export declare const minimumRoom = 32;
export declare const spacings: number[];
/** Map distance: steps on the grid (`map_distance`, `steps` on the staggered isometric grid). */
export declare const steps: (from: Tile, to: Tile) => number;
export declare const getRules: (
  engine?: Engine,
  randomNumberGenerator?: () => number
) => PickStartTile[];
export default getRules;
