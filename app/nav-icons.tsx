import type {ReactNode} from 'react';

export type NavIconName='app'|'home'|'units'|'housing'|'ausbildung'|'vault'|'verbs'|'games'|'mistakes';

/** Line drawings (24 × 24): a phone (Uygulama olarak indir), a house (home page), an open book, a block of flats (Ev ve Yaşam), a briefcase
 * (Ausbildung), an armchair, a pencil, a game pad, a sheet with a cross. */
const SHAPES:Record<NavIconName,ReactNode>={
 app:<><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></>,
 home:<><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></>,
 units:<><path d="M2.5 5.6c2.9-1 5.8-.8 9.5 1.3 3.7-2.1 6.6-2.3 9.5-1.3v13c-2.9-1-5.8-.8-9.5 1.3-3.7-2.1-6.6-2.3-9.5-1.3z"/><path d="M12 6.9v13.2"/></>,
 housing:<><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15"/><path d="M10.5 20.5v-4h3v4"/></>,
 ausbildung:<><rect x="3" y="7.5" width="18" height="12" rx="2.5"/><path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2"/><path d="M3 13h18"/></>,
 vault:<><path d="M5.5 11V8.5a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3V11"/><path d="M3 13.2a2 2 0 0 1 4 0V15h10v-1.8a2 2 0 0 1 4 0V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M6 19v2M18 19v2"/></>,
 verbs:<><path d="M16.6 3.6a2.2 2.2 0 0 1 3.1 3.1L7.3 19.1 3 20.5l1.4-4.3z"/><path d="m14.6 5.6 3.1 3.1"/></>,
 games:<><path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.3l-.6 3.4a2.6 2.6 0 0 1-4.6 1.1L15 15.5H9l-1.2 1.8a2.6 2.6 0 0 1-4.6-1.1l-.6-3.4A4.5 4.5 0 0 1 7 7.5z"/><path d="M8 10.5v3M6.5 12h3"/><circle cx="15.5" cy="11" r=".7" fill="currentColor"/><circle cx="17.3" cy="12.9" r=".7" fill="currentColor"/></>,
 mistakes:<><path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/><path d="m9.5 11.5 4 4m0-4-4 4"/></>,
};

/**
 * The home page sidebar icons: two-tone drawings on round white stickers, one colour per part
 * (home green, units yellow, Ev ve Yaşam teal, Ausbildung orange, object vault blue, verb workshop purple,
 * games pink, mistakes red). Styles:
 * `.nav-icon` in app/koko-theme.css.
 */
export function NavIcon({name}:{name:NavIconName}){
 const shape=SHAPES[name];
 return <span className={'nav-icon nav-icon-'+name} aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" focusable="false"><g className="nav-icon-fill">{shape}</g>{shape}</svg></span>;
}
