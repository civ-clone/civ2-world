import {
  Desert,
  Forest,
  Glacier,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  Swamp,
  Tundra,
} from '../../Terrains';
import {
  Distribution,
  IDistribution,
} from '@civ-clone/core-world-generator/Rules/Distribution';
import { Land, Water } from '@civ-clone/core-terrain/Types';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Terrain from '@civ-clone/core-terrain/Terrain';

// The interim generator (simple-world-generator's bands; `from` and `to` are fractions of the map from its first row
//  to its last). These are civ1-world's bands, with Civilization II's Glacier for the poles and no River terrain: rivers
//  are a feature, walked in after the terrain (`Rules/World/built`). Civilization II's own generator
//  (`map.cpp` `map_generate`) is a later port.

/** The first and last rows of the default 80-row map. Glacier fills the land there. */
export const polarRow = 1 / 80;

const distribution = (
  TerrainType: typeof Terrain,
  Base: typeof Terrain,
  bands: IDistribution[]
): Distribution =>
  new Distribution(
    new Criterion((Type: typeof Terrain): boolean => Type === TerrainType),
    new Criterion((Type: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Base)
    ),
    new Effect((): IDistribution[] => bands)
  );

export const getRules = (): Distribution[] => [
  distribution(Glacier, Land, [
    { from: 0, to: polarRow, fill: true },
    { from: polarRow, to: polarRow * 2 },
    { from: 1 - polarRow * 2, to: 1 - polarRow },
    { from: 1 - polarRow, to: 1, fill: true },
  ]),
  distribution(Desert, Land, [
    { from: 0.4, to: 0.45 },
    {
      from: 0.45,
      to: 0.55,
      coverage: 0.025,
      cluster: true,
      clusterChance: 0.1,
    },
    { from: 0.55, to: 0.6 },
  ]),
  distribution(Forest, Land, [
    { from: 0.05, to: 0.2 },
    { from: 0.2, to: 0.4, cluster: true, clusterChance: 0.1, coverage: 0.1 },
    { from: 0.4, to: 0.6 },
    { from: 0.6, to: 0.8, cluster: true, clusterChance: 0.1, coverage: 0.1 },
    { from: 0.8, to: 0.95 },
  ]),
  distribution(Grassland, Land, [{ fill: true }]),
  distribution(Hills, Land, [
    { from: 0.1, to: 0.9, path: true, pathChance: 0.1, coverage: 0.06 },
  ]),
  distribution(Jungle, Land, [
    { from: 0.3, to: 0.45, cluster: true, clusterChance: 0.2, coverage: 0.08 },
    { from: 0.55, to: 0.7, cluster: true, clusterChance: 0.2, coverage: 0.08 },
  ]),
  distribution(Mountains, Land, [
    { from: 0.01, to: 0.1, coverage: 0.3, path: true },
    { from: 0.1, to: 0.9, path: true },
    { from: 0.9, to: 0.99, coverage: 0.3, path: true },
  ]),
  distribution(Ocean, Water, [{ fill: true }]),
  distribution(Plains, Land, [
    { from: 0.01, to: 0.2, coverage: 0.3 },
    { from: 0.2, to: 0.4 },
    { from: 0.1, to: 0.4, cluster: true },
    { from: 0.4, to: 0.6 },
    { from: 0.6, to: 0.8 },
    { from: 0.6, to: 0.9, cluster: true },
    { from: 0.8, to: 0.99, coverage: 0.3 },
  ]),
  distribution(Swamp, Land, [
    { from: 0.2, to: 0.4, cluster: true },
    { from: 0.6, to: 0.8, cluster: true },
  ]),
  distribution(Tundra, Land, [
    { from: 0.01, to: 0.15, cluster: true, coverage: 0.15 },
    { from: 0.85, to: 0.99, cluster: true, coverage: 0.15 },
  ]),
];

export default getRules;
