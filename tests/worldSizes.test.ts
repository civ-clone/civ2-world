import '../registerWorldSizes';
import WorldSizeRegistry, {
  instance as worldSizeRegistryInstance,
} from '@civ-clone/core-world-generator/WorldSizeRegistry';
import { customLimits, normal, worldSizes } from '../WorldSizes';
import WorldSize from '@civ-clone/core-world-generator/WorldSize';
import { expect } from 'chai';

const describeSize = (size: WorldSize) => [
  size.key(),
  size.width(),
  size.height(),
  size.topologyId(),
  size.minPlayers(),
  size.maxPlayers(),
  size.players(),
  size.earth(),
];

describe('world sizes', (): void => {
  it("are Civilization II's three sizes on the staggered isometric grid, with 3 to 7 civilizations", (): void => {
    const registry = new WorldSizeRegistry();

    registry.register(...worldSizes());

    expect(registry.entries().map(describeSize)).eql([
      ['small', 40, 50, 'staggered-iso', 3, 7, 7, false],
      ['normal', 50, 80, 'staggered-iso', 3, 7, 7, false],
      ['large', 75, 120, 'staggered-iso', 3, 7, 7, false],
    ]);
    expect(registry.entries().map((size) => size.width() * size.height())).eql([
      2000, 4000, 9000,
    ]);
  });

  it('are registered, with the bounds of a size typed in, once civ2-world is imported', (): void => {
    expect(
      ['small', 'normal', 'large'].map(
        (key) => worldSizeRegistryInstance.getByKey(key)?.width() ?? null
      )
    ).eql([40, 50, 75]);
    expect(worldSizeRegistryInstance.customLimits()).eql(customLimits);
  });

  it('allow a size typed in from 20 to 250 squares each way, and 1,000 to 10,000 in all', (): void => {
    const registry = new WorldSizeRegistry();

    registry.setCustomLimits(customLimits);

    expect(registry.customLimits()).include({
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

  it('start a world at the normal size unless the game says otherwise', (): void => {
    const size = worldSizeRegistryInstance.getByKey('normal')!;

    expect(normal).eql({ width: size.width(), height: size.height() });
    expect(Object.isFrozen(normal)).true;
  });

  it('are registered once when the module runs again', (): void => {
    const registered = worldSizeRegistryInstance.entries().length;

    delete require.cache[require.resolve('../registerWorldSizes')];
    delete require.cache[require.resolve('../WorldSizes')];
    require('../registerWorldSizes');

    expect(worldSizeRegistryInstance.entries().length).equal(registered);
  });
});
