"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamePicture = exports.GAME_LEVEL = exports.GAME_SECONDS = void 0;
exports.gameName = gameName;
exports.gameDetail = gameDetail;
exports.gameNameList = gameNameList;
exports.gameLength = gameLength;
const verb_games_1 = require("./verb-games");
const verb_copy_1 = require("./verb-copy");
const game_copy_1 = require("./game-copy");
const verbGameTitle = { sentence: 'gameSentence', aux: 'gameAux', build: 'gameBuild', match: 'gameMatch' };
const newGameCopy = { rain: ['gameRain', 'gameRainDetail'], catch: ['gameCatch', 'gameCatchDetail'], quick: ['gameQuick', 'gameQuickDetail'], search: ['gameSearch', 'gameSearchDetail'], rescue: ['gameRescue', 'gameRescueDetail'], plural: ['gamePlural', 'gamePluralDetail'] };
const verbGameDetail = { sentence: 'gameSentenceDetail', aux: 'gameAuxDetail', build: 'gameBuildDetail' };
/** A game's name and one line about it, in the site language. */
function gameName(game, language) { const own = newGameCopy[game]; return own ? (0, game_copy_1.gameText)(language, own[0]) : (0, verb_copy_1.verbText)(language, verbGameTitle[game]); }
function gameDetail(game, language) { const own = newGameCopy[game]; return own ? (0, game_copy_1.gameText)(language, own[1]) : game === 'match' ? (0, game_copy_1.gameText)(language, 'gameMatchCard') : (0, verb_copy_1.verbText)(language, verbGameDetail[game]); }
/** Every game on the Oyunlar page by name, for the home page's line about the games ("7 kısa oyun …: Eşleştirme kartları, …"). */
function gameNameList(language) { return verb_games_1.gameIds.map(id => gameName(id, language)).join(', '); }
/**
 * About how long one round takes (the learner asked for a level and a length on each game, 22 October 2026): from the
 * round sizes in lib/verb-games.ts and lib/object-games.ts (6 pairs, 20 drops, 10 words, 30 seconds, 6 hidden words,
 * 5 words, 6 pairs). All games use A1 words.
 */
exports.GAME_SECONDS = { match: 120, rain: 120, catch: 120, quick: 30, search: 180, rescue: 180, plural: 120, sentence: 180, aux: 120, build: 180 };
exports.GAME_LEVEL = 'A1';
function gameLength(game, language) {
    const seconds = exports.GAME_SECONDS[game];
    return seconds < 60 ? (0, game_copy_1.gameText)(language, 'gameSeconds', { n: seconds }) : (0, game_copy_1.gameText)(language, 'gameMinutes', { n: Math.round(seconds / 60) });
}
/** The game's picture (the learner's drawings of Koko, one per game). */
const gamePicture = (game) => '/toon/games/' + game + '.webp';
exports.gamePicture = gamePicture;
