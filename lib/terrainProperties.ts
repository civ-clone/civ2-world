import { NO, YES, terrains } from '../data/terrain';
import { TerrainTable } from '@civ-clone/base-terrain-properties/lib/terrainTable';
import { terrainTypes } from './terrainTable';

// `data/terrain`'s other columns as base-terrain-properties tables, for the units package's rules (moving, defending,
//  terraforming), so the numbers live in one place.

const table = <Value>(
  value: (row: (typeof terrains)[number]) => Value
): TerrainTable<Value> =>
  terrainTypes.map((TerrainType, index) => [
    TerrainType,
    value(terrains[index]),
  ]);

/** Movement points to enter a square. */
export const movementCost: TerrainTable = table(([moveCost]) => moveCost);

/** The defence multiplier: `@TERRAIN`'s defence is in half steps, 2 being normal. */
export const defence: TerrainTable = table(([, halfSteps]) => halfSteps / 2);

/** What irrigating, mining and transforming do: `'yes'` (in place), `null` (can't), or the terrain it becomes. */
export type Outcome = 'yes' | null | (typeof terrainTypes)[number];

const outcome = (result: number): Outcome =>
  result === YES ? 'yes' : result === NO ? null : terrainTypes[result];

export const irrigation: TerrainTable<Outcome> = table(([, , , , , [result]]) =>
  outcome(result)
);

export const mining: TerrainTable<Outcome> = table(([, , , , , , [result]]) =>
  outcome(result)
);

export const transform: TerrainTable<Outcome> = table(
  ([, , , , , , , result]) => outcome(result)
);

/** Settlers' turns for each order, where it can be done (`null` where not). */
export const irrigationTurns: TerrainTable<number | null> = table(
  ([, , , , , [result, , turns]]) => (result === NO ? null : turns)
);

export const miningTurns: TerrainTable<number | null> = table(
  ([, , , , , , [result, , turns]]) => (result === NO ? null : turns)
);
