// Checks `data/terrain` against the player's own RULES.TXT, which is never committed. Skipped unless `CIV2_PATH` names
//  the folder it's in: `CIV2_PATH=~/Code/civ-clone/civ2 npm test`. Only numbers are compared; nothing from the file
//  is printed but a row number.
import { NO, YES, specials, terrains } from '../data/terrain';
import {
  TerrainRecord,
  readTerrain,
  toSlug,
} from '@civ-clone/civ2-asset-extractor/rules';
import { specialTypes, terrainTypes } from '../lib/terrainTable';
import { existsSync, readFileSync } from 'fs';
import { expect } from 'chai';
import { join } from 'path';

const path = process.env.CIV2_PATH
  ? join(process.env.CIV2_PATH, 'RULES.TXT')
  : null;

(path && existsSync(path) ? describe : describe.skip)(
  'RULES.TXT @TERRAIN',
  (): void => {
    const records: TerrainRecord[] = path
        ? readTerrain(readFileSync(path, 'latin1'))
        : [],
      // An order's result names a terrain by an abbreviation: the terrain whose name has its letters in order.
      resultOf = (token: string): number => {
        if (token.toLowerCase() === 'yes') {
          return YES;
        }

        if (token.toLowerCase() === 'no') {
          return NO;
        }

        const letters = token.toLowerCase().split(''),
          matches = records.slice(0, 11).filter(({ name }) => {
            let at = 0;

            for (const letter of name.toLowerCase()) {
              if (letter === letters[at]) {
                at++;
              }
            }

            return (
              name[0].toLowerCase() === letters[0] && at === letters.length
            );
          });

        expect(matches.length, `the abbreviation in a result`).to.equal(1);

        return matches[0].terrain;
      };

    it('has 33 rows', (): void => {
      expect(records.length).to.equal(33);
    });

    it('matches rows 0 to 10, the terrains', (): void => {
      records.slice(0, 11).forEach((record, index) => {
        // Booleans, so a failure prints nothing from the file.
        expect(
          toSlug(record.name) === toSlug(terrainTypes[index].name),
          `row ${index}'s name`
        ).to.true;
        expect(
          [
            record.moveCost,
            record.defence,
            record.food,
            record.shields,
            record.trade,
            [
              resultOf(record.irrigation!.result),
              record.irrigation!.bonus,
              record.irrigation!.turns,
              record.irrigation!.aiGovernment,
            ],
            [
              resultOf(record.mining!.result),
              record.mining!.bonus,
              record.mining!.turns,
              record.mining!.aiGovernment,
            ],
            resultOf(record.transform!),
          ],
          `row ${index}`
        ).to.deep.equal(terrains[index]);
      });
    });

    it('matches rows 11 to 32, the specials, and their classes', (): void => {
      records.slice(11).forEach((record, offset) => {
        const index = offset + 11,
          slot = record.special as 1 | 2,
          Type = specialTypes[slot - 1][record.terrain];

        expect(
          [
            record.moveCost,
            record.defence,
            record.food,
            record.shields,
            record.trade,
          ],
          `row ${index}`
        ).to.deep.equal(specials[slot - 1][record.terrain]);

        // Grassland's two are never placed, so they have no class.
        if (Type === null) {
          expect(record.terrain, `row ${index}`).to.equal(2);

          return;
        }

        // Its name, or its name after its terrain's (the Oil rows are named for theirs).
        expect(
          [
            toSlug(Type.name),
            `${toSlug(terrainTypes[record.terrain].name)}-${toSlug(Type.name)}`,
          ].includes(toSlug(record.name)),
          `row ${index}'s name`
        ).to.true;
      });
    });
  }
);
