import { TerrainTable } from '@civ-clone/base-terrain-properties/lib/terrainTable';
import { terrainTypes } from './terrainTable';
/** Movement points to enter a square. */
export declare const movementCost: TerrainTable;
/** The defence multiplier: `@TERRAIN`'s defence is in half steps, 2 being normal. */
export declare const defence: TerrainTable;
/** What irrigating, mining and transforming do: `'yes'` (in place), `null` (can't), or the terrain it becomes. */
export type Outcome = 'yes' | null | (typeof terrainTypes)[number];
export declare const irrigation: TerrainTable<Outcome>;
export declare const mining: TerrainTable<Outcome>;
export declare const transform: TerrainTable<Outcome>;
/** Settlers' turns for each order, where it can be done (`null` where not). */
export declare const irrigationTurns: TerrainTable<number | null>;
export declare const miningTurns: TerrainTable<number | null>;
