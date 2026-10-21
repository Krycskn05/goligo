import type {ReactNode} from 'react';
import {Lock,Sparkles} from 'lucide-react';
import {guestText} from '@/lib/guest-copy';
import type {SiteLanguage} from '@/lib/site-languages';

/**
 * The guest taste on the study pages (lib/guest-taste.ts): a short note on top, a lock on the parts for members and a
 * sign-up card at the end of a round. Sign up and sign in come back to the page the visitor was on (`back`).
 */
export const guestSignUp=(back:string)=>'/uye-ol?return_to='+encodeURIComponent(back);
export const guestSignIn=(back:string)=>'/giris?return_to='+encodeURIComponent(back);

export function GuestBanner({language,back}:{language:SiteLanguage;back:string}){
 return <div className="guest-banner" role="note" data-guest-banner>
  <Sparkles size={20} aria-hidden="true"/>
  <p>{guestText(language,'guestNote')}</p>
  <div className="guest-actions"><a className="btn small" href={guestSignUp(back)}>{guestText(language,'guestSignUp')}</a><a className="btn secondary small" href={guestSignIn(back)}>{guestText(language,'guestSignIn')}</a></div>
 </div>;
}

/** The end of a round, or a part for members: carry on after a free sign-up. */
export function GuestMore({language,back}:{language:SiteLanguage;back:string}){
 return <div className="guest-more" data-guest-more>
  <Lock size={20} aria-hidden="true"/>
  <p>{guestText(language,'guestMore')}</p>
  <div className="guest-actions"><a className="btn" href={guestSignUp(back)}>{guestText(language,'guestSignUp')}</a><a className="btn secondary" href={guestSignIn(back)}>{guestText(language,'guestSignIn')}</a></div>
 </div>;
}

/** In place of the button of a part for members: a lock that leads to the free sign-up. */
export function GuestLock({language,back,className='',children}:{language:SiteLanguage;back:string;className?:string;children?:ReactNode}){
 return <a className={('guest-lock '+className).trim()} href={guestSignUp(back)} data-guest-locked>
  <Lock size={16} aria-hidden="true"/>{children??guestText(language,'guestLocked')}
 </a>;
}
