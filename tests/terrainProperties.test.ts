import {
  Desert,
  Forest,
  Glacier,
  Grassland,
  Hills,
  Mountains,
  Ocean,
  Plains,
  Swamp,
  Tundra,
} from '../Terrains';
import {
  defence,
  irrigation,
  irrigationTurns,
  mining,
  movementCost,
  transform,
} from '../lib/terrainProperties';
import { expect } from 'chai';
import { terrainValue } from '@civ-clone/base-terrain-properties/lib/terrainTable';

describe('terrainProperties', (): void => {
  it('gives the units package @TERRAIN’s other columns as terrain tables', (): void => {
    expect(terrainValue(movementCost, new Mountains())).to.equal(3);
    expect(terrainValue(movementCost, new Glacier())).to.equal(2);
    expect(terrainValue(defence, new Hills())).to.equal(2);
    expect(terrainValue(defence, new Forest())).to.equal(1.5);
    expect(terrainValue(defence, new Ocean())).to.equal(1);
    expect(terrainValue(irrigation, new Desert())).to.equal('yes');
    expect(terrainValue(irrigation, new Forest())).to.equal(Plains);
    expect(terrainValue(irrigation, new Swamp())).to.equal(Grassland);
    expect(terrainValue(irrigation, new Glacier())).to.null;
    expect(terrainValue(mining, new Plains())).to.equal(Forest);
    expect(terrainValue(transform, new Tundra())).to.equal(Desert);
    expect(terrainValue(transform, new Ocean())).to.null;
    expect(terrainValue(irrigationTurns, new Hills())).to.equal(10);
    expect(terrainValue(irrigationTurns, new Mountains())).to.null;
  });
});
