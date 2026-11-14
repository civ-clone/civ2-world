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
import DistributionGroups from '@civ-clone/core-world-generator/Rules/DistributionGroups';
import Effect from '@civ-clone/core-rule/Effect';

// The interim generator's order (civ1-world's, with Glacier for Arctic and no River terrain): each terrain is laid over
//  the land the ones before it left, so Glacier, late, holds the poles.
export const getRules = (): DistributionGroups[] => [
  new DistributionGroups(
    new Effect(() => [
      Ocean,
      Grassland,
      Swamp,
      Mountains,
      Jungle,
      Hills,
      Forest,
      Desert,
      Plains,
      Tundra,
      Glacier,
    ])
  ),
];

export default getRules;
