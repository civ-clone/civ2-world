import { expect } from 'chai';
import { readFileSync } from 'fs';
import { join } from 'path';

// Civilization II's rule set is chosen instead of Civilization's, so it can't bring any of it in: no civ1-* package,
//  and no library-* aggregate (library-science registers 67 advances on import).
describe('isolation', (): void => {
  it('depends on no civ1-* or library-* package', (): void => {
    const { dependencies, devDependencies } = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );

    expect(
      Object.keys({ ...dependencies, ...devDependencies }).filter((name) =>
        /^@civ-clone\/(civ1-|library-)/.test(name)
      )
    ).to.deep.equal([]);
  });
});
