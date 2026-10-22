import {Loader2} from 'lucide-react';

/**
 * "Alıştırma hazırlanıyor…" while a round is being started (the learner asked, 22 October 2026: the button only went
 * grey and it was not clear the tap was seen). A small bar at the bottom of the screen, visible wherever the page is.
 */
export function StartWait({show,text}:{show:boolean;text:string}){
 return show?<p className="start-wait" role="status" aria-live="polite" data-start-wait=""><Loader2 size={18} className="start-wait-spin" aria-hidden="true"/>{text}</p>:null;
}
