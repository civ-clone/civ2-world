"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const core_game_1 = require("@civ-clone/core-game");
const Requirements_1 = require("./Requirements");
const built_1 = require("./Rules/TileImprovement/built");
const conversion_1 = require("./Rules/Terrain/conversion");
const created_1 = require("./Rules/Terrain/created");
const available_1 = require("./Rules/TileImprovement/available");
const distribution_1 = require("./Rules/Terrain/distribution");
const distribution_groups_1 = require("./Rules/Terrain/distribution-groups");
const feature_1 = require("./Rules/Terrain/feature");
const distribution_2 = require("./Rules/GoodyHut/distribution");
const pillaged_1 = require("./Rules/TileImprovement/pillaged");
const pick_start_tile_1 = require("./Rules/Player/pick-start-tile");
const removed_1 = require("./Rules/TileImprovement/removed");
const start_1 = require("./Rules/Engine/start");
const terrain_changed_1 = require("./Rules/Tile/terrain-changed");
const terrain_changed_improvements_1 = require("./Rules/Tile/terrain-changed-improvements");
const yield_1 = require("./Rules/Tile/yield");
const yield_modifier_1 = require("./Rules/Tile/yield-modifier");
const built_2 = require("./Rules/World/built");
const pick_generator_1 = require("./Rules/WorldGenerator/pick-generator");
const register = (game) => {
    // Where tile improvements can go, from the entries in `Requirements`.
    game.requirements.add((0, available_1.deriveAvailableRules)(game.playerResearch, game.tileImprovements, game.terrainFeatures, game.cities), ...Requirements_1.default);
    game.rules.register(...(0, built_1.default)(game.tileImprovements, game.engine), ...(0, conversion_1.default)(), ...(0, created_1.default)(game.rules, game.availableTerrainFeatures), ...(0, distribution_1.default)(), ...(0, distribution_groups_1.default)(), ...(0, feature_1.default)(game.terrainFeatures, game.rng), ...(0, distribution_2.default)(game.goodyHuts, game.rng, game.engine), ...(0, pillaged_1.default)(game.tileImprovements, game.engine), ...(0, removed_1.default)(game.tileImprovements, game.engine), ...(0, pick_start_tile_1.default)(game.engine, game.rng, game.goodyHuts), ...(0, start_1.default)(game.rules, game.engine, game.landMasses), ...(0, terrain_changed_1.default)(game.terrainFeatures, game.players, game.rng, game.engine), ...(0, terrain_changed_improvements_1.default)(game.tileImprovements, game.rules), ...(0, yield_1.default)(game.tileImprovements, game.terrainFeatures), ...(0, yield_modifier_1.default)(game.tileImprovements, game.playerGovernments), ...(0, built_2.default)(game.terrainFeatures, game.goodyHuts, game.rules, game.rng, game.engine), ...(0, pick_generator_1.default)(game.generators, game.rng, game.engine));
};
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map