import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Priority from '@civ-clone/core-rule/Priority';
import YieldModifier from '@civ-clone/core-world/Rules/YieldModifier';
/** The road's trade comes before the railroad (`High`), once the river's trade is in. */
export declare const roadPriority: Priority;
/**
 * The rest of `city.cpp` `city_tile_yield`, in its order, for a square worked by no particular city (the city's own
 *  steps, Supermarket and the like, aren't here):
 *  - a road gives +1 trade on Desert, Plains and Grassland, or on any square already making trade (step 5);
 *  - a railroad gives half again of the shields, rounded down: shields only, unlike Civilization (step 7);
 *  - below Monarchy a yield of more than 2 loses 1, then The Republic and Democracy add 1 to any trade (steps 8, 9);
 *  - pollution halves food, shields and trade, rounded up (step 11).
 */
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => YieldModifier[];
export default getRules;
