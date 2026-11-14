import Loader from '@civ-clone/simple-world-generator/tests/lib/Loader';
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
export const fixedWorld = (
  rows: Square[][],
  terrainFeatureRegistry: TerrainFeatureRegistry,
  ruleRegistry: RuleRegistry
): Promise<World> =>
  new World(
    new Loader(
      rows.length,
      rows[0].length,
      rows.flat().map(([TerrainType, ...features]: Square) => {
        const terrain = new TerrainType(ruleRegistry);

        return [
          terrain,
          ...features.map(
            (Feature: typeof TerrainFeature) => new Feature(terrain)
          ),
        ] as [Terrain, ...TerrainFeature[]];
      }),
      terrainFeatureRegistry
    ),
    ruleRegistry
  ).build();
