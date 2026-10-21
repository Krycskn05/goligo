/**
 * The old address (lernkoko.<account>.workers.dev) after the site moved to goligo.<account>.workers.dev (the learner
 * renamed the site Goligo). ci/yayin.sh deploys this tiny worker under the old name once the site itself is up.
 * A page opened in a browser shows a short note that packs the browser's saved settings (once) and goes on to the
 * same page on the new address; everything else (API calls, pictures …) is redirected straight away.
 */
import {newAddress,oldAddressPage} from '../../lib/storage-move';

type Env={NEW_ORIGIN:string};
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  const target=newAddress(request.url,env.NEW_ORIGIN);
  const page=request.method==='GET'&&(request.headers.get('accept')??'').includes('text/html');
  if(!page)return Response.redirect(target,308);
  return new Response(oldAddressPage(target),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'origin'}});
 },
};
