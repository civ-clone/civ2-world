import { Game, defaultGame } from '@civ-clone/core-game';
import availableRequirements from './Requirements';
import built from './Rules/TileImprovement/built';
import conversion from './Rules/Terrain/conversion';
import created from './Rules/Terrain/created';
import { deriveAvailableRules } from './Rules/TileImprovement/available';
import distribution from './Rules/Terrain/distribution';
import distributionGroups from './Rules/Terrain/distribution-groups';
import feature from './Rules/Terrain/feature';
import goodyHutDistribution from './Rules/GoodyHut/distribution';
import pillaged from './Rules/TileImprovement/pillaged';
import playerPickStartTile from './Rules/Player/pick-start-tile';
import removed from './Rules/TileImprovement/removed';
import start from './Rules/Engine/start';
import terrainChanged from './Rules/Tile/terrain-changed';
import terrainChangedImprovements from './Rules/Tile/terrain-changed-improvements';
import tileYield from './Rules/Tile/yield';
import tileYieldModifier from './Rules/Tile/yield-modifier';
import worldBuilt from './Rules/World/built';
import worldGeneratorPickGenerator from './Rules/WorldGenerator/pick-generator';

export const register = (game: Game): void => {
  // Where tile improvements can go, from the entries in `Requirements`.
  game.requirements.add(
    deriveAvailableRules(
      game.playerResearch,
      game.tileImprovements,
      game.terrainFeatures
    ),
    ...availableRequirements
  );

  game.rules.register(
    ...built(game.tileImprovements, game.engine),
    ...conversion(),
    ...created(game.rules, game.availableTerrainFeatures),
    ...distribution(),
    ...distributionGroups(),
    ...feature(game.terrainFeatures, game.rng),
    ...goodyHutDistribution(game.goodyHuts, game.rng),
    ...pillaged(game.tileImprovements, game.engine),
    ...removed(game.tileImprovements, game.engine),
    ...playerPickStartTile(game.engine, game.rng),
    ...start(game.rules, game.engine),
    ...terrainChanged(game.terrainFeatures, game.players, game.rng),
    ...terrainChangedImprovements(game.tileImprovements, game.rules),
    ...tileYield(game.tileImprovements, game.terrainFeatures),
    ...tileYieldModifier(game.tileImprovements, game.playerGovernments),
    ...worldBuilt(game.terrainFeatures, game.goodyHuts, game.rules, game.rng),
    ...worldGeneratorPickGenerator(game.generators, game.rng)
  );
};

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
