'use client';
import {useEffect,useState} from 'react';

/**
 * False in the page the server writes and on the first render in the browser, true once the page's JavaScript runs.
 * The sign-in, sign-up, password and account forms keep their button off until then (site check, 5 November 2026): a
 * form sent before that went the browser's own way, as a plain link, and put the email address and the password into
 * the page address (/giris?email=…&password=…), where the browser history and server logs keep it.
 */
export function useHydrated(){
 const [ready,setReady]=useState(false);
 useEffect(()=>{setReady(true);},[]);
 return ready;
}
