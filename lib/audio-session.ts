/** Prefer media playback on devices that expose the optional Audio Session API. */
export function configureAudioSession() {
 if(typeof navigator==='undefined')return;
 try {
  const session=(navigator as Navigator&{audioSession?:{type:string}}).audioSession;
  if(session&&session.type!=='playback')session.type='playback';
 }catch{}
}
