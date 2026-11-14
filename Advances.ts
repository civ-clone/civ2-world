import Advance from '@civ-clone/core-science/Advance';

export { BridgeBuilding } from '@civ-clone/base-science-advance-bridgebuilding/BridgeBuilding';
export { Construction } from '@civ-clone/base-science-advance-construction/Construction';
export { Railroad } from '@civ-clone/base-science-advance-railroad/Railroad';

// Pending stage C1 of the M2a plan (civ-clone/web-renderer#1008), which creates the 23 advances Civilization II adds.
//  Until then each is `null`, and a way to build something that needs one is left out of `Requirements` (so Farmland
//  and Airbases can't be built yet). Wiring each in is its one line.
export const Radio: typeof Advance | null = null;
export const Refrigeration: typeof Advance | null = null;
