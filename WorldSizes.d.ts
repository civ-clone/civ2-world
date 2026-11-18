import WorldSize, {
  PlayerRange,
} from '@civ-clone/core-world-generator/WorldSize';
import { CustomWorldSizeLimits } from '@civ-clone/core-world-generator/WorldSizeRegistry';
export declare const players: Readonly<PlayerRange>;
/** The size a world is unless the game says otherwise. */
export declare const normal: Readonly<{
  width: 50;
  height: 80;
}>;
export declare const worldSizes: () => WorldSize[];
/**
 * A size typed in instead: from 20 to 250 squares each way, and from 1,000 to 10,000 squares in all, as Civilization II
 *  allows. Its rows wrap north to south here, so the height must be even.
 */
export declare const customLimits: Readonly<CustomWorldSizeLimits>;
