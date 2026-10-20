import type {ReactNode} from 'react';

export type NavIconName='units'|'vault'|'verbs'|'games'|'mistakes';

/** Line drawings (24 × 24): an open book, an armchair, a pencil, a game pad, a cross in a circle. */
const SHAPES:Record<NavIconName,ReactNode>={
 units:<><path d="M2.5 5.6c2.9-1 5.8-.8 9.5 1.3 3.7-2.1 6.6-2.3 9.5-1.3v13c-2.9-1-5.8-.8-9.5 1.3-3.7-2.1-6.6-2.3-9.5-1.3z"/><path d="M12 6.9v13.2"/></>,
 vault:<><path d="M5.5 11V8.5a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3V11"/><path d="M3 13.2a2 2 0 0 1 4 0V15h10v-1.8a2 2 0 0 1 4 0V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M6 19v2M18 19v2"/></>,
 verbs:<><path d="M16.6 3.6a2.2 2.2 0 0 1 3.1 3.1L7.3 19.1 3 20.5l1.4-4.3z"/><path d="m14.6 5.6 3.1 3.1"/></>,
 games:<><path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.3l-.6 3.4a2.6 2.6 0 0 1-4.6 1.1L15 15.5H9l-1.2 1.8a2.6 2.6 0 0 1-4.6-1.1l-.6-3.4A4.5 4.5 0 0 1 7 7.5z"/><path d="M8 10.5v3M6.5 12h3"/><circle cx="15.5" cy="11" r=".7" fill="currentColor"/><circle cx="17.3" cy="12.9" r=".7" fill="currentColor"/></>,
 mistakes:<><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></>,
};

/**
 * The home page sidebar icons: two-tone drawings on round white stickers, one colour per part
 * (units yellow, object vault blue, verb workshop purple, games pink, mistakes red). Styles:
 * `.nav-icon` in app/koko-theme.css.
 */
export function NavIcon({name}:{name:NavIconName}){
 const shape=SHAPES[name];
 return <span className={'nav-icon nav-icon-'+name} aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" focusable="false"><g className="nav-icon-fill">{shape}</g>{shape}</svg></span>;
}
