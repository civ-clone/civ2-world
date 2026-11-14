import Government from '@civ-clone/core-government/Government';

export { Anarchy } from '@civ-clone/base-government-anarchy/Anarchy';
export { Communism } from '@civ-clone/base-government-communism/Communism';
export { Democracy } from '@civ-clone/base-government-democracy/Democracy';
export { Despotism } from '@civ-clone/base-government-despotism/Despotism';
export { Monarchy } from '@civ-clone/base-government-monarchy/Monarchy';
export { Republic } from '@civ-clone/base-government-republic/Republic';

// Pending stage C1 of the M2a plan (civ-clone/web-renderer#1008), which creates base-government-fundamentalism. Until
//  then this is `null` and the rules that name it leave it out. Wiring it in is this one line.
export const Fundamentalism: typeof Government | null = null;
