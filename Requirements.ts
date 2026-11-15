import {
  Airbase,
  Farmland,
  Fortress,
  Irrigation,
  Mine,
  Railroad,
  Road,
} from './TileImprovements';
import {
  BridgeBuilding,
  Construction,
  Radio,
  Railroad as RailroadAdvance,
  Refrigeration,
} from './Advances';
import {
  Condition,
  Requirement,
  Target,
} from '@civ-clone/core-requirement/Requirement';
import { YES, terrains } from './data/terrain';
import { Land } from '@civ-clone/core-terrain/Types';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import { terrainTypes } from './lib/terrainTable';

// Where Civilization II's tile improvements can be built and what else they need (`unit.cpp` `unit_cmd_terraform`), as
//  the entries `Rules/TileImprovement/available` makes its rules from. A tile improvement can be built by any one of its
//  entries. Converting a terrain (irrigating a Forest, mining Plains) is an action, not a tile improvement, so it isn't
//  here.

// What the graph can name but a rule decides (`Rules/TileImprovement/available` checks them).
export const IRRIGATION_SOURCE = new Condition('civ2-world:irrigation-source');
export const RIVER = new Condition('civ2-world:river');
export const NO_RIVER = new Condition('civ2-world:no-river');
export const NO_FORTRESS = new Condition('civ2-world:no-fortress');
export const NO_CITY = new Condition('civ2-world:no-city');

// Every land terrain: nothing here is built on Ocean.
export const landTerrains: (typeof Terrain)[] = terrainTypes.filter(
    (TerrainType: typeof Terrain): boolean =>
      Object.prototype.isPrototypeOf.call(Land, TerrainType)
  ),
  // The terrains an order improves in place (`yes`).
  improvedBy = (change: 5 | 6): (typeof Terrain)[] =>
    terrainTypes.filter(
      (TerrainType: typeof Terrain, index: number): boolean =>
        terrains[index][change][0] === YES
    );

/** One way to build `subject`: on one of the terrains `where`, with every one of `targets`. */
const tileImprovement = (
  id: string,
  subject: typeof TileImprovement,
  targets: Target[],
  where: (typeof Terrain)[]
): Requirement =>
  new Requirement({
    id: `civ2-world:tile-improvement/available/${id}`,
    subject,
    relation: 'requires',
    targets,
    range: 'tile',
    where,
  });

export const availableRequirements: Requirement[] = [
  // Desert, Plains, Grassland, Hills and Tundra, with water next to it.
  tileImprovement('Irrigation', Irrigation, [IRRIGATION_SOURCE], improvedBy(5)),
  // Irrigating an irrigated square makes it Farmland, with Refrigeration: on the terrains irrigated in place, with water
  //  next to it as for irrigation, and not on a city's square (`unit_cmd_terraform`, order 6, refuses a city's square,
  //  one without water and one that is farmland already, and asks for Refrigeration on one that is irrigated). A city's
  //  square is irrigated (civ2-city), so this is the one entry that needs `NO_CITY`.
  tileImprovement(
    'Farmland',
    Farmland,
    [Irrigation, Refrigeration, IRRIGATION_SOURCE, NO_CITY],
    improvedBy(5)
  ),
  // Desert, Hills, Mountains and Glacier.
  tileImprovement('Mine', Mine, [], improvedBy(6)),
  tileImprovement('Road', Road, [NO_RIVER], landTerrains),
  // A road on a river needs Bridge Building.
  tileImprovement('bridge/Road', Road, [BridgeBuilding, RIVER], landTerrains),
  tileImprovement('Railroad', Railroad, [RailroadAdvance, Road], landTerrains),
  tileImprovement('Fortress', Fortress, [Construction], landTerrains),
  // Not on a fortress (a fortress can be built on an airbase, and replaces it).
  tileImprovement('Airbase', Airbase, [Radio, NO_FORTRESS], landTerrains),
];

export default availableRequirements;
