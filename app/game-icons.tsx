import type {GameId} from '@/lib/verb-games';
import {gamePicture} from '@/lib/game-names';

/** The picture on each game card of the Oyunlar page: the learner's drawing of Koko for that game (22 October 2026). */
export function GameIcon({game}:{game:GameId}){return <span className={'game-icon game-icon-'+game} aria-hidden="true"><img src={gamePicture(game)} alt="" width={400} height={400} loading="lazy" decoding="async"/></span>;}
