import Advance from '@civ-clone/core-science/Advance';

export { BridgeBuilding } from '@civ-clone/base-science-advance-bridgebuilding/BridgeBuilding';
export { Construction } from '@civ-clone/base-science-advance-construction/Construction';
export { Radio } from '@civ-clone/base-science-advance-radio/Radio';
export { Railroad } from '@civ-clone/base-science-advance-railroad/Railroad';

// An advance that is `null` here leaves a way to build something that needs it out of `Requirements`, so Farmland
//  can't be built yet: it waits for the Supermarket's effect. Wiring it in is its one line.
export const Refrigeration: typeof Advance | null = null;
