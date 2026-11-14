import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import World from '@civ-clone/core-world/World';
export type Square = [typeof Terrain, ...(typeof TerrainFeature)[]];
/**
 * A square-grid world from `rows`, one entry per square, with the features given on each. Terrains are made with
 *  `ruleRegistry`, so no rule registered elsewhere gives them features.
 */
export declare const fixedWorld: (
  rows: Square[][],
  terrainFeatureRegistry: TerrainFeatureRegistry,
  ruleRegistry: RuleRegistry
) => Promise<World>;
