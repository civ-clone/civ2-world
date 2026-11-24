import {
  LandMassRegistry,
  instance as landMassRegistryInstance,
} from '@civ-clone/core-world/LandMassRegistry';
import { Grassland, Ocean } from '../Terrains';
import Built from '@civ-clone/core-world/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Generator from '@civ-clone/core-world-generator/Generator';
import PickGenerator from '@civ-clone/core-world-generator/Rules/PickGenerator';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Start from '@civ-clone/core-engine/Rules/Start';
import Terrain from '@civ-clone/core-terrain/Terrain';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import start from '../Rules/Engine/start';

// One continent: a column of Grassland down the middle of the Ocean.
class IslandGenerator extends Generator {
  async generate(): Promise<Terrain[]> {
    return Array.from(
      { length: this.height() * this.width() },
      (_: unknown, i: number): Terrain =>
        i % this.width() === 3 ? new Grassland() : new Ocean()
    );
  }
}

describe('start: land masses', (): void => {
  it("registers the world's continents in the land-mass registry it is given", async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      engine = new Engine(),
      landMassRegistry = new LandMassRegistry(),
      defaultLandMasses = landMassRegistryInstance.length;
    let resolveBuilt: (world: World) => void = () => {};

    engine.setOption('topologyId', 'square');
    engine.setOption('height', 6);
    engine.setOption('width', 8);

    ruleRegistry.register(
      ...start(ruleRegistry, engine, landMassRegistry),
      new PickGenerator(new Effect(() => IslandGenerator)),
      new Built(new Effect((world: World): void => resolveBuilt(world)))
    );

    const built = new Promise<World>((resolve) => (resolveBuilt = resolve));

    ruleRegistry.process(Start);

    await built;

    expect(landMassRegistry.entries()).to.have.length(1);
    expect(landMassRegistry.entries()[0].tiles()).to.have.length(6);
    expect(landMassRegistryInstance.length).to.equal(defaultLandMasses);
  });
});
