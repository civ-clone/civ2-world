import { ConditionChecks } from '@civ-clone/base-tile-improvement/lib/available';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
/** How `Requirements`' conditions are decided for a square. */
export declare const conditions: (
  terrainFeatureRegistry: TerrainFeatureRegistry,
  tileImprovementRegistry: TileImprovementRegistry,
  cityRegistry?: CityRegistry
) => ConditionChecks;
/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
export declare const deriveAvailableRules: (
  playerResearchRegistry: PlayerResearchRegistry,
  tileImprovementRegistry: TileImprovementRegistry,
  terrainFeatureRegistry: TerrainFeatureRegistry,
  cityRegistry?: CityRegistry
) => Deriver;
/** Every rule about where tile improvements can go, one for each of `Requirements`' entries (for tests). */
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry,
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  cityRegistry?: CityRegistry
) => Available[];
export default getRules;
