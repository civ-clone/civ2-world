import {
  Airbase,
  Farmland,
  Fortress,
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road,
} from './TileImprovements';
import { instance as availableTileImprovementRegistryInstance } from '@civ-clone/core-tile-improvement/AvailableTileImprovementRegistry';

availableTileImprovementRegistryInstance.register(
  Airbase,
  Farmland,
  Fortress,
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road
);
