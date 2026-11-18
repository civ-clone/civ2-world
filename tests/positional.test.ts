import { hutAt, shieldAt, specialAt } from '../lib/positional';
import { expect } from 'chai';

// Every square of a 50 × 80 map in Civilization II's doubled coordinates: x and y both even or both odd.
const squares: [number, number][] = [];

for (let y = 0; y < 80; y++) {
  for (let x = y & 1; x < 100; x += 2) {
    squares.push([x, y]);
  }
}

describe('specialAt', (): void => {
  it('gives one square in 16 a special, of either kind, and Grassland none', (): void => {
    [1, 33, 40, 0x7fff].forEach((seed): void => {
      const slots = squares.map(([x, y]) => specialAt(x, y, seed, 0)),
        some = slots.filter((slot) => slot !== 0);

      expect(some.length / squares.length).within(0.055, 0.07);
      expect(some.filter((slot) => slot === 2).length / some.length).within(
        0.3,
        0.7
      );
      expect(squares.every(([x, y]) => specialAt(x, y, seed, 2) === 0)).true;
    });
  });

  it("is the original's formula", (): void => {
    // (2, 0), seed 33: u = 1, v = 1, so 1 + 4 = 5 against (0 + 13 × 0 + 33) & 15 = 1: none. Seed 37: 37 & 15 = 5, a
    //  special; mask 1 << ((37 >> 4) & 3) = 4, u & 4 = v & 4 = 0: the second.
    expect(specialAt(2, 0, 33, 0)).equal(0);
    expect(specialAt(2, 0, 37, 0)).equal(2);
    // (3, 1), seed 37: u = 2, v = 1: 2 + 4 = 6, not 5.
    expect(specialAt(3, 1, 37, 0)).equal(0);
    // (0, 2), seed 35: u = 1, v = -1: (1 & 3) + (-1 & 3) × 4 = 13, and (0 + (-1 >> 2) × 13 + 35) & 15 = 22 & 15 = 6.
    expect(specialAt(0, 2, 35, 0)).equal(0);
    expect(specialAt(0, 2, 42, 0)).not.equal(0);
  });
});

describe('shieldAt', (): void => {
  it('gives half the squares a shield, in diagonal stripes', (): void => {
    const shields = squares.filter(([x, y]) => shieldAt(x, y)).length;

    expect(shields / squares.length).equal(0.5);
    // (0, 0): -0 - 0 = 0, & 2 = 0: a shield; (2, 0): -1 - 2 = -3, & 2 = 0: a shield; (4, 0): -2 - 4 = -6, & 2 = 2.
    expect([shieldAt(0, 0), shieldAt(2, 0), shieldAt(4, 0)]).eql([
      true,
      true,
      false,
    ]);
  });
});

describe('hutAt', (): void => {
  it('gives one square in 32 a hut', (): void => {
    [1, 33, 40].forEach((seed): void => {
      expect(
        squares.filter(([x, y]) => hutAt(x, y, seed)).length / squares.length
      ).within(0.025, 0.04);
    });
  });
});
