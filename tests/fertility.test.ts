import { Buffalo, Oasis, River, Shield } from '../TerrainFeatures';
import {
  Desert,
  Grassland,
  Hills,
  Mountains,
  Ocean,
  Plains,
} from '../Terrains';
import fertility, { terrainScore } from '../lib/fertility';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Square } from './lib/world';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { expect } from 'chai';
import { fixedWorld } from './lib/world';
import hydroPossible from '../lib/hydro';

// A 9 by 9 world of `ring`, with `centre` in the middle (4, 4) and anything in `at` placed over the ring.
const world = async (
  ring: Square,
  centre: Square,
  at: Record<string, Square> = {}
) => {
  const terrainFeatureRegistry = new TerrainFeatureRegistry(),
    built = await fixedWorld(
      Array.from({ length: 9 }, (row, y) =>
        Array.from(
          { length: 9 },
          (column, x): Square =>
            x === 4 && y === 4 ? centre : at[`${x},${y}`] ?? ring
        )
      ),
      terrainFeatureRegistry,
      new RuleRegistry()
    );

  return {
    centre: built.get(4, 4),
    terrainFeatureRegistry,
  };
};

describe('fertility', (): void => {
  it("scores each terrain row as the game does: 3 × food + trade + 2 × shields (not Grassland's), + 3 Hills, + 1 mined, + 2 irrigated in place", (): void => {
    // Desert 0/1/0, mined in place: 2 + 1.
    expect(terrainScore(0)).equal(3);
    // Plains 1/1/0, irrigated in place: 3 + 2 + 2.
    expect(terrainScore(1)).equal(7);
    // Grassland 2/1/0: its shield isn't counted.
    expect(terrainScore(2)).equal(8);
    // Hills 1/0/0, mined in place: 3 + 3.
    expect(terrainScore(4)).equal(6);
    // Mountains 0/1/0, mined in place: 2 + 1.
    expect(terrainScore(5)).equal(3);
    // Ocean 1/0/2, neither.
    expect(terrainScore(10)).equal(5);
    // Desert's first special, 3/1/0, scored with Desert's mine: 9 + 2 + 1.
    expect(terrainScore(11)).equal(12);
    // Plains' first special, 1/3/0: 3 + 6 + 2.
    expect(terrainScore(12)).equal(11);
  });

  it('is 0 for anything but Grassland and Plains', async (): Promise<void> => {
    for (const TerrainType of [Desert, Hills, Mountains, Ocean]) {
      const { centre, terrainFeatureRegistry } = await world(
        [Grassland],
        [TerrainType]
      );

      expect(fertility(centre, terrainFeatureRegistry), TerrainType.name).equal(
        0
      );
    }
  });

  it('adds the 21 squares, the 8 beside the centre twice and the centre four times, then maps the total to 8 to 15', async (): Promise<void> => {
    // 7 × (4 + 16 + 12) = 224: (224 − 120) / 8 = 13, halved 6, + 8.
    expect(
      fertility(
        ...(Object.values(await world([Plains], [Plains])) as [any, any])
      )
    ).equal(14);
    // 28 + 3 × 16 + 3 × 12 = 112, below 120: kept at 1, halved 0, + 8.
    expect(
      fertility(
        ...(Object.values(await world([Desert], [Plains])) as [any, any])
      )
    ).equal(8);
  });

  it('takes 16 off Grassland without its shield', async (): Promise<void> => {
    // 32 + 112 + 84 = 228, − 16 = 212: 92 / 8 = 11, halved 5, + 8.
    const bare = await world([Plains], [Grassland]),
      // 40 + 112 + 84 = 236: 116 / 8 = 14, halved 7, + 8.
      shielded = await world([Plains], [Grassland, Shield]);

    expect(fertility(bare.centre, bare.terrainFeatureRegistry)).equal(13);
    expect(fertility(shielded.centre, shielded.terrainFeatureRegistry)).equal(
      15
    );
  });

  it("counts a special's row beside the centre, never on it", async (): Promise<void> => {
    // A Plains special on the centre is scored as Plains: 14 as for plain Plains.
    const onCentre = await world([Plains], [Plains, Buffalo]),
      // Beside it, 11 rather than 7, twice: 224 + 8 = 232, 112 / 8 = 14, halved 7, + 8.
      beside = await world([Plains], [Plains], { '5,4': [Plains, Buffalo] }),
      // Two away, once: 228, 108 / 8 = 13, halved 6, + 8.
      outer = await world([Plains], [Plains], { '6,4': [Plains, Buffalo] });

    expect(fertility(onCentre.centre, onCentre.terrainFeatureRegistry)).equal(
      14
    );
    expect(fertility(beside.centre, beside.terrainFeatureRegistry)).equal(15);
    expect(fertility(outer.centre, outer.terrainFeatureRegistry)).equal(14);
  });

  it('adds 1 for each river, and the centre six times on a river', async (): Promise<void> => {
    // Desert everywhere but a Plains centre, all on rivers: (7 + 1) × 6 + (3 + 1) × 2 × 8 + (3 + 1) × 12 = 160:
    //  40 / 8 = 5, halved 2, + 8. Without the rivers it is 8.
    const { centre, terrainFeatureRegistry } = await world(
      [Desert, River],
      [Plains, River]
    );

    expect(fertility(centre, terrainFeatureRegistry)).equal(10);
  });

  it('scores a Desert special once beside the centre as its own row', async (): Promise<void> => {
    // Oasis beside a Plains centre on Desert: 112 + (12 − 3) × 2 = 130: 10 / 8 = 1, halved 0, + 8.
    const { centre, terrainFeatureRegistry } = await world([Desert], [Plains], {
      '4,5': [Desert, Oasis],
    });

    expect(fertility(centre, terrainFeatureRegistry)).equal(8);
  });
});

describe('hydroPossible', (): void => {
  it('is true with Mountains or a river on the square or beside it, and false otherwise', async (): Promise<void> => {
    const plain = await world([Plains], [Plains]),
      mountains = await world([Plains], [Plains], { '5,5': [Mountains] }),
      river = await world([Plains], [Plains, River]),
      riverBeside = await world([Plains], [Plains], {
        '3,4': [Plains, River],
      }),
      farMountains = await world([Plains], [Plains], { '6,4': [Mountains] });

    expect(hydroPossible(plain.centre, plain.terrainFeatureRegistry)).false;
    expect(hydroPossible(mountains.centre, mountains.terrainFeatureRegistry))
      .true;
    expect(hydroPossible(river.centre, river.terrainFeatureRegistry)).true;
    expect(
      hydroPossible(riverBeside.centre, riverBeside.terrainFeatureRegistry)
    ).true;
    expect(
      hydroPossible(farMountains.centre, farMountains.terrainFeatureRegistry)
    ).false;
  });
});
