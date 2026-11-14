import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from '../Governments';
import {
  celebratingTradeBonusGovernments,
  penalisedGovernments,
  tradeBonusGovernments,
} from '../lib/governmentTileYield';
import { expect } from 'chai';

// `city.cpp` `city_tile_yield` compares the government's index (Anarchy 0 ... Fundamentalism 4, Republic 5, Democracy
//  6): a yield over 2 loses 1 below Monarchy; trade gains 1 from the Republic up, or from Monarchy up while celebrating.
describe('government tile steps', (): void => {
  it('penalises Anarchy and Despotism only', (): void => {
    expect(penalisedGovernments).to.deep.equal([Anarchy, Despotism]);
  });

  it('gives Fundamentalism the trade bonus only while a city celebrates', (): void => {
    expect(tradeBonusGovernments).to.deep.equal([Republic, Democracy]);
    expect(celebratingTradeBonusGovernments).to.deep.equal([
      Monarchy,
      Communism,
      Fundamentalism,
      Republic,
      Democracy,
    ]);
  });
});
