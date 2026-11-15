import {
  ConditionChecks,
  availableRules,
  deriveAvailableRules as baseDeriveAvailableRules,
} from '@civ-clone/base-tile-improvement/lib/available';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  IRRIGATION_SOURCE,
  NO_CITY,
  NO_FORTRESS,
  NO_RIVER,
  RIVER,
  availableRequirements,
} from '../../Requirements';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { hasRiver, isIrrigationSource } from '../../lib/river';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
import { Fortress } from '../../TileImprovements';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

/** How `Requirements`' conditions are decided for a square. */
export const conditions = (
  terrainFeatureRegistry: TerrainFeatureRegistry,
  tileImprovementRegistry: TileImprovementRegistry,
  cityRegistry: CityRegistry = cityRegistryInstance
): ConditionChecks => ({
  [IRRIGATION_SOURCE.id]: (tile: Tile): boolean =>
    isIrrigationSource(tile, terrainFeatureRegistry, tileImprovementRegistry),
  [RIVER.id]: (tile: Tile): boolean => hasRiver(tile, terrainFeatureRegistry),
  [NO_RIVER.id]: (tile: Tile): boolean =>
    !hasRiver(tile, terrainFeatureRegistry),
  [NO_FORTRESS.id]: (tile: Tile): boolean =>
    !tileImprovementRegistry
      .getByTile(tile)
      .some(
        (improvement: TileImprovement): boolean =>
          improvement instanceof Fortress
      ),
  [NO_CITY.id]: (tile: Tile): boolean => cityRegistry.getByTile(tile) === null,
});

/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
export const deriveAvailableRules = (
  playerResearchRegistry: PlayerResearchRegistry,
  tileImprovementRegistry: TileImprovementRegistry,
  terrainFeatureRegistry: TerrainFeatureRegistry,
  cityRegistry: CityRegistry = cityRegistryInstance
): Deriver =>
  baseDeriveAvailableRules(
    playerResearchRegistry,
    tileImprovementRegistry,
    conditions(terrainFeatureRegistry, tileImprovementRegistry, cityRegistry)
  );

/** Every rule about where tile improvements can go, one for each of `Requirements`' entries (for tests). */
export const getRules = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance
): Available[] =>
  availableRules(
    availableRequirements,
    playerResearchRegistry,
    tileImprovementRegistry,
    conditions(terrainFeatureRegistry, tileImprovementRegistry, cityRegistry)
  );

export default getRules;
