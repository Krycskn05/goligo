import {CloudRain,Ear,Layers,LayoutGrid,PartyPopper,Search,Timer} from 'lucide-react';
import type {GameId} from '@/lib/verb-games';

/** The round coloured sign on each game card of the Oyunlar page. */
const icons:Partial<Record<GameId,typeof Search>>={match:LayoutGrid,rain:CloudRain,catch:Ear,quick:Timer,search:Search,rescue:PartyPopper,plural:Layers};
export function GameIcon({game}:{game:GameId}){const Icon=icons[game]??LayoutGrid;return <span className={'game-icon game-icon-'+game} aria-hidden="true"><Icon size={26}/></span>;}
