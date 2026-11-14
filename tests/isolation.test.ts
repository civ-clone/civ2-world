import { readFileSync, readdirSync, statSync } from 'fs';
import { expect } from 'chai';
import { join } from 'path';

// Civilization II's rule set is chosen instead of Civilization's, so it can't bring any of it in: no civ1-* package,
//  and no library-* aggregate (library-science registers 67 advances on import).
//
// A development dependency may: simple-world-generator, used by the tests, depends on library-world, which only
//  re-exports classes and registers nothing. It isn't a dependency of this package for a consumer.

const forbidden = /^@civ-clone\/(civ1-|library-)/;

/** The package's own `.ts` source, as published: everything but `node_modules`, `tests` and declarations. */
const shippedSource = (directory: string): string[] =>
  readdirSync(directory).flatMap((name: string): string[] => {
    const path = join(directory, name);

    if (['node_modules', 'tests', '.git'].includes(name)) {
      return [];
    }

    if (statSync(path).isDirectory()) {
      return shippedSource(path);
    }

    return name.endsWith('.ts') && !name.endsWith('.d.ts') ? [path] : [];
  });

describe('isolation', (): void => {
  it('depends on no civ1-* or library-* package', (): void => {
    const { dependencies } = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );

    expect(
      Object.keys(dependencies).filter((name) => forbidden.test(name))
    ).to.deep.equal([]);
  });

  it('imports no civ1-* or library-* module from its shipped source', (): void => {
    const files = shippedSource(process.cwd()),
      imports = files.flatMap((file: string): string[] =>
        [
          ...readFileSync(file, 'utf8').matchAll(
            /(?:from|import|require\()\s*['"]([^'"]+)['"]/g
          ),
        ].map(([, specifier]) => specifier)
      );

    expect(files.length).to.above(20);
    expect(imports.length).to.above(100);
    expect(
      imports.filter((specifier) => forbidden.test(specifier))
    ).to.deep.equal([]);
  });
});
