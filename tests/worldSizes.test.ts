import '../registerWorldSizes';
import { customLimits, normal, worldSizes } from '../WorldSizes';
import { expect } from 'chai';
import { instance as worldSizeRegistryInstance } from '@civ-clone/core-world-generator/WorldSizeRegistry';

describe('world sizes', (): void => {
  it("offers Civilization II's three sizes on the staggered isometric grid, with 3 to 7 civilizations", (): void => {
    expect(
      worldSizeRegistryInstance
        .entries()
        .map((size) => [
          size.key(),
          size.width(),
          size.height(),
          size.topologyId(),
          size.minPlayers(),
          size.maxPlayers(),
          size.players(),
          size.earth(),
        ])
    ).eql([
      ['small', 40, 50, 'staggered-iso', 3, 7, 7, false],
      ['normal', 50, 80, 'staggered-iso', 3, 7, 7, false],
      ['large', 75, 120, 'staggered-iso', 3, 7, 7, false],
    ]);
  });

  it("has the same squares in all as Civilization II's sizes", (): void => {
    expect(worldSizes().map((size) => size.width() * size.height())).eql([
      2000, 4000, 9000,
    ]);
  });

  it('allows a size typed in from 20 to 250 squares each way, and 1,000 to 10,000 in all', (): void => {
    expect(worldSizeRegistryInstance.customLimits()).eql(customLimits);
    expect(customLimits).include({
      topologyId: 'staggered-iso',
      minWidth: 20,
      maxWidth: 250,
      minHeight: 20,
      maxHeight: 250,
      minArea: 1000,
      maxArea: 10000,
      minPlayers: 3,
      maxPlayers: 7,
      players: 7,
    });
  });

  it('starts a world at the normal size unless the game says otherwise', (): void => {
    const size = worldSizeRegistryInstance.getByKey('normal')!;

    expect(normal).eql({ width: size.width(), height: size.height() });
  });
});
