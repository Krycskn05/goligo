/**
 * The first old address (lernkoko.<account>.workers.dev). The site moved to goligo.<account>.workers.dev and then to
 * its own address goliqo.com (the learner bought it, October 2026); ci/yayin.sh deploys this tiny worker under the old
 * name once the site itself is up, with NEW_ORIGIN = https://goliqo.com. A page opened in a browser shows a short note
 * that packs the browser's saved settings (once) and goes on to the same page on the new address; everything else (API
 * calls, pictures …) is redirected straight away (lib/storage-move.ts).
 */
import {oldAddressResponse} from '../../lib/storage-move';

type Env={NEW_ORIGIN:string};
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  return oldAddressResponse(request,env.NEW_ORIGIN);
 },
};
