import type {GameId} from './verb-games';
import {gameIds} from './verb-games';
import {verbText,type VerbCopyKey} from './verb-copy';
import {gameText,type GameCopyKey} from './game-copy';
import type {VaultLanguage} from './object-vault-copy';

const verbGameTitle:Partial<Record<GameId,VerbCopyKey>>={sentence:'gameSentence',aux:'gameAux',build:'gameBuild',match:'gameMatch'};
const newGameCopy:Partial<Record<GameId,[GameCopyKey,GameCopyKey]>>={rain:['gameRain','gameRainDetail'],catch:['gameCatch','gameCatchDetail'],quick:['gameQuick','gameQuickDetail'],search:['gameSearch','gameSearchDetail'],rescue:['gameRescue','gameRescueDetail'],plural:['gamePlural','gamePluralDetail']};
const verbGameDetail:Partial<Record<GameId,VerbCopyKey>>={sentence:'gameSentenceDetail',aux:'gameAuxDetail',build:'gameBuildDetail'};
/** A game's name and one line about it, in the site language. */
export function gameName(game:GameId,language:VaultLanguage){const own=newGameCopy[game];return own?gameText(language,own[0]):verbText(language,verbGameTitle[game]!);}
export function gameDetail(game:GameId,language:VaultLanguage){const own=newGameCopy[game];return own?gameText(language,own[1]):game==='match'?gameText(language,'gameMatchCard'):verbText(language,verbGameDetail[game]!);}
/** Every game on the Oyunlar page by name, for the home page's line about the games ("7 kısa oyun …: Eşleştirme kartları, …"). */
export function gameNameList(language:VaultLanguage){return gameIds.map(id=>gameName(id,language)).join(', ');}

/**
 * About how long one round takes (the learner asked for a level and a length on each game, 22 October 2026): from the
 * round sizes in lib/verb-games.ts and lib/object-games.ts (6 pairs, 20 drops, 10 words, 30 seconds, 6 hidden words,
 * 5 words, 6 pairs). All games use A1 words.
 */
export const GAME_SECONDS:Record<GameId,number>={match:120,rain:120,catch:120,quick:30,search:180,rescue:180,plural:120,sentence:180,aux:120,build:180};
export const GAME_LEVEL='A1';
export function gameLength(game:GameId,language:VaultLanguage){
 const seconds=GAME_SECONDS[game];
 return seconds<60?gameText(language,'gameSeconds',{n:seconds}):gameText(language,'gameMinutes',{n:Math.round(seconds/60)});
}
/** The game's picture (the learner's drawings of Koko, one per game). */
export const gamePicture=(game:GameId)=>'/toon/games/'+game+'.webp';
