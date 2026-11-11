# Yayın sonucu

- Calisma: 43115420697 / commit 081829deaee8daacb389f9dee03b12128470cea2
- Tarih (UTC): 2026-11-11 22:55

```
1-pnpm=basarili
2-kurulum=basarili
mod=YAYIN (worker: goligo, d1: lernkoko-db)
3-hesap=basarili
4-d1=basarili
5-sesler=basarili
5-derleme=basarili
6-sema=basarili
6-uyelik=basarili
7-yayin=basarili
8-kontrol=basarili
9-eski-adres=basarili
```
## 01-pnpm.log
```
v24.22.2
Preparing pnpm@11.25.0 for immediate activation...
11.25.0
```
## 02-install.log
```
? Verifying lockfile against supply-chain policies (842 entries)...
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +640
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 640, reused 0, downloaded 0, added 0
Progress: resolved 640, reused 0, downloaded 35, added 0
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /home/runner/work/goligo/goligo/.sites-runtime/pnpm-store/v11
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 640, reused 0, downloaded 81, added 4
Progress: resolved 640, reused 0, downloaded 119, added 4
Progress: resolved 640, reused 0, downloaded 224, added 12
Progress: resolved 640, reused 0, downloaded 395, added 25
Progress: resolved 640, reused 0, downloaded 576, added 38
✓ Lockfile passes supply-chain policies (842 entries in 8.2s)
Progress: resolved 640, reused 0, downloaded 640, added 154
Progress: resolved 640, reused 0, downloaded 640, added 640, done
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../node_modules/workerd postinstall$ node install.js
.../esbuild@0.28.0/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
.../node_modules/workerd postinstall: Done
.../esbuild@0.28.0/node_modules/esbuild postinstall: Done
.../esbuild@0.25.12/node_modules/esbuild postinstall: Done
.../esbuild@0.27.3/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall: Done

dependencies:
+ @base-ui/react 1.7.0
+ @hookform/resolvers 5.7.1
+ @shadcn/react 0.3.0
+ class-variance-authority 0.7.1
+ clsx 2.1.1
+ cmdk 1.1.1
+ date-fns 4.4.0
+ drizzle-orm 0.45.2
+ embla-carousel-react 8.6.0
+ input-otp 1.4.2
+ lucide-react 1.31.0
+ next 16.3.4
+ next-themes 0.4.6
+ radix-ui 1.6.7
+ react 19.2.6
+ react-day-picker 10.0.1
+ react-dom 19.2.6
+ react-hook-form 7.85.0
+ react-resizable-panels 4.12.2
+ recharts 3.8.0
+ sonner 2.0.8
+ tailwind-merge 3.6.0
+ vaul 1.1.2
+ zod 3.25.76

devDependencies:
+ @cloudflare/vite-plugin 1.37.1
+ @cloudflare/workers-types 4.20260515.1
+ @tailwindcss/postcss 4.2.1
+ @types/node 22.19.19
+ @types/react 19.2.14
+ @types/react-dom 19.2.3
+ @vitejs/plugin-react 6.0.2
+ @vitejs/plugin-rsc 0.5.26
+ drizzle-kit 0.31.10
+ eslint 9.39.4
+ eslint-config-next 16.3.4
+ json-rpc-2.0 1.7.1
+ raw-body 3.0.2
+ react-server-dom-webpack 19.2.6
+ tailwindcss 4.2.1
+ tw-animate-css 1.4.0
+ typescript 5.9.3
+ vinext 1.0.0-beta.5
+ vite 8.0.13
+ wrangler 4.92.0

Done in 10.5s using pnpm v11.25.0
```
## 03-account.log
```
Anahtar özeti: 53 karakter, biçim: uygun, not: boşluklar temizlendi

 ⛅️ wrangler 4.92.0
───────────────────
Getting User settings...
👋 You are logged in with an User API Token, associated with the email kooraycoskun@gmail.com.
ℹ️  The API Token is read from the CLOUDFLARE_API_TOKEN environment variable.
┌──────────────────────────────────┬──────────────────────────────────┐
│ Account Name                     │ Account ID                       │
├──────────────────────────────────┼──────────────────────────────────┤
│ Kooraycoskun@gmail.com's Account │ 0a6c54cf57b27b54097f9fe4b6f59923 │
└──────────────────────────────────┴──────────────────────────────────┘
🔓 To see token permissions visit https://dash.cloudflare.com/profile/api-tokens.
```
## 04-d1.log
```
D1 veritabanı: lernkoko-db (bc8bdd18-7628-4727-9fd2-a7d6e96ac054)
```
## 05-build.log
```
[34m[4/5] build client environment...[39m
[2Ktransforming...✓ 2233 modules transformed.
rendering chunks...
computing gzip size...
[33m[33m[PLUGIN_TIMINGS] [0mYour build spent significant time in plugins. Here is a breakdown:
  - vinext:middleware-server-only (31%)
  - rsc:virtual-client-package (12%)
  - vinext:jsx-in-js (10%)
  - alias (10%)
  - vinext:css-data-url (10%)
See https://rolldown.rs/options/checks#plugintimings for more details.
[39m
[32m✓ built in 13.18s[39m
[34m[5/5] build ssr environment...[39m
[2Ktransforming...✓ 474 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 2.77s[39m
[0m
  Route (app)
  ┌ ƒ /                        
  ├ ƒ /a1-1/alltag-und-freizeit
  ├ ƒ /a1-1/berufe             
  ├ ƒ /a1-1/familie            
  ├ ƒ /a1-1/orte-und-dinge     
  ├ ƒ /a1-1/willkommen         
  ├ ƒ /a1-2/ausbildung         
  ├ ƒ /a1-2/ausbildung/hoeren  
  ├ ƒ /a1-2/ev-ve-yasam        
  ├ ƒ /a1-2/wege-in-der-stadt  
  ├ ƒ /a1-sinavi               
  ├ λ /api/auth                
  ├ λ /api/ilerleme            
  ├ λ /api/konus               
  ├ λ /api/study               
  ├ λ /api/ziyaret             
  ├ ƒ /ev-esyalar              
  ├ ƒ /fiiller                 
  ├ ƒ /giris                   
  ├ ƒ /gizlilik                
  ├ ƒ /hesabim                 
  ├ ƒ /impressum               
  ├ ƒ /konular                 
  ├ ƒ /kullanim-kosullari      
  ├ ƒ /oyunlar                 
  ├ ƒ /sifre-yenile            
  ├ ƒ /uye-ol                  
  ├ ƒ /yanlislarim             
  └ ƒ /yonetim                 

  λ API  ƒ Dynamic

  Build complete. Run `vinext start` to start the production server.

--- dist/server/wrangler.json (özet) ---
{
 "name": "goligo",
 "main": "index.js",
 "compatibility_date": "2026-05-15",
 "compatibility_flags": [
  "nodejs_compat"
 ],
 "d1_databases": [
  {
   "binding": "DB",
   "database_name": "lernkoko-db",
   "database_id": "bc8bdd18-7628-4727-9fd2-a7d6e96ac054"
  }
 ],
 "vars": {
  "TEAM_DOMAIN": "https://throbbing-bread-1016.cloudflareaccess.com",
  "POLICY_AUD": "3cd3e8e441c3a316e36262af3a1bb856b8e59cfe09100720ad8804701ffde8b0"
 },
 "assets": {
  "directory": "../client"
 },
 "ai": {
  "binding": "AI"
 }
}
```
## 05-voices.log
```
Site sesleri: 63630 dosya
```
## 06-members.log
```
      "rows_written": 0,
      "total_attempts": 1
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "served_by": "v3-prod",
      "served_by_region": "ENAM",
      "served_by_colo": "ORD",
      "served_by_primary": true,
      "timings": {
        "sql_duration_ms": 0.0801
      },
      "duration": 0.0801,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1163264,
      "rows_read": 0,
      "rows_written": 0,
      "total_attempts": 1
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "served_by": "v3-prod",
      "served_by_region": "ENAM",
      "served_by_colo": "ORD",
      "served_by_primary": true,
      "timings": {
        "sql_duration_ms": 0.069
      },
      "duration": 0.069,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1163264,
      "rows_read": 0,
      "rows_written": 0,
      "total_attempts": 1
    }
  }
]
[
  {
    "results": [
      {
        "name": "auth_attempts"
      },
      {
        "name": "member_sessions"
      },
      {
        "name": "members"
      }
    ],
    "success": true,
    "meta": {
      "served_by": "v3-prod",
      "served_by_region": "ENAM",
      "served_by_colo": "ORD",
      "served_by_primary": true,
      "timings": {
        "sql_duration_ms": 1.1384
      },
      "duration": 1.1384,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1163264,
      "rows_read": 38,
      "rows_written": 0,
      "total_attempts": 1
    }
  }
]
```
## 06-schema.log
```
Şema zaten var, dokunulmadı.
```
## 07-deploy.log
```
+ /_next/static/chunks/uk-DGyqrR3P.js
+ /_next/static/chunks/layout-segment-context-C4KULx4s.js
+ /_next/static/chunks/app-route-prefetch-policy-DHA6oWz0.js
+ /_next/static/chunks/a1-exam-schreiben-05-Cg4F8zko.js
+ /_next/static/chunks/a1-exam-schreiben-08-B03wkPKF.js
+ /_next/static/chunks/a1-exam-schreiben-07-hSCnOqcG.js
+ /_next/static/chunks/a1-exam-schreiben-09-CBkAAAU2.js
+ /_next/static/chunks/site-logo-CDNyS5Hx.js
+ /_next/static/chunks/a1-exam-schreiben-10-BQzlAMpA.js
+ /_next/static/chunks/site-languages-DIM4YNpQ.js
+ /_next/static/chunks/a1-exam-lesen-09-CDgyrMi2.js
+ /_next/static/chunks/a1-exam-lesen-07-DPHKU9H0.js
+ /_next/static/chunks/a1-exam-lesen-03-BpGTpA0G.js
+ /_next/static/chunks/a1-exam-lesen-02-CY0HmcHN.js
+ /_next/static/chunks/a1-exam-hoeren-07-BqF4eHpa.js
+ /_next/static/chunks/a1-exam-hoeren-03-DGaUNYtr.js
+ /_next/static/chunks/a1-exam-hoeren-01-CKedziiT.js
+ /_next/static/chunks/a1-exam-spell-CyWf_bds.js
+ /_next/static/chunks/progress-meter-CAcAgvF_.js
+ /_next/static/chunks/willkommen-b-course-CY_ZljPd.js
+ /objects/toon/l5-unterrichten-2.webp
+ /_next/static/chunks/berufe-course-BUK7L2oG.js
+ /toon/lektion5/spaziergang-2.webp
+ /toon/lektion2/busfahrer-2.webp
+ /_next/static/chunks/alltag-study-CTv41RgE.js
+ /_next/static/chunks/start-wait-Op-nw4bS.js
+ /toon/lektion1/kapak-b-2.webp
+ /_next/static/chunks/ausbildung-listen-BGXuqAJM.js
+ /_next/static/chunks/a1-exam-study-KlyNcj1E.js
+ /_next/static/chunks/object-study-DKpIt9a0.js
+ /_next/static/chunks/toon-art-DRogSfcC.js
+ /_next/static/chunks/familie-progress-lq_rhuAL.js
+ /_next/static/chunks/zh-DH_4djB7.js
+ /_next/static/chunks/nl-Bx7LLGZZ.js
+ /_next/static/chunks/hu-D2cWtXnt.js
+ /_next/static/chunks/so-CmlTL29T.js
+ /_next/static/chunks/vi-BcCE2Lxm.js
+ /_next/static/chunks/prs-b-VmGJ_c.js
+ /_next/static/chunks/bg-DGMIs0H3.js
+ /_next/static/chunks/index-qSUeY2t5.js
+ /_next/static/chunks/de-DyBuWTF8.js
+ /_next/static/chunks/progress-ui-DVtYcFUA.js
+ /sfx/manifest.json
+ /_next/static/chunks/stadt-progress-DGMEtYSS.js
+ /_next/static/chunks/ausbildung-progress-DzfcHQrD.js
+ /_next/static/chunks/course-selector-4c6BVdP5.js
+ /_next/static/chunks/a1-exam-schreiben-01-BhW_SXSr.js
+ /_next/static/chunks/a1-exam-schreiben-03-k_TvDo8J.js
+ /_next/static/chunks/housing-illustrations-CJ9nvBOv.js
+ /_next/static/chunks/reset-form-CW8Dx9HZ.js
+ /_next/static/chunks/auth-form-BX-EIZXa.js
+ /_next/static/chunks/a1-exam-lesen-05-BUdZDcr5.js
+ /_next/static/chunks/a1-exam-lesen-08-DtvsZ69O.js
+ /_next/static/chunks/a1-exam-hoeren-10-CXOZZvF6.js
+ /_next/static/chunks/a1-exam-hoeren-05-DK9bl-Vv.js
+ /_next/static/chunks/a1-exam-hoeren-09-DIZww53z.js
+ /_next/static/chunks/a1-exam-hoeren-04-C40jmqzg.js
+ /_next/static/chunks/account-panel-BYx8EdNz.js
+ /_next/static/chunks/housing-copy-BHuaVEx4.js
+ /_next/static/chunks/willkommen-course-D8pjp71N.js
   (truncating changed assets log, set `WRANGLER_LOG=debug` environment variable to see full diff)
Uploaded 41 of 123 assets
Uploaded 82 of 123 assets
Uploaded 123 of 123 assets
✨ Success! Uploaded 123 files (64997 already uploaded) (2.12 sec)

Total Upload: 17673.29 KiB / gzip: 5779.25 KiB
Worker Startup Time: 42 ms
Your Worker has access to the following bindings:
Binding                                                           Resource                  
env.EMAIL (unrestricted)                                          Send Email                
env.DB (lernkoko-db)                                              D1 Database               
env.AI                                                            AI                        
env.TEAM_DOMAIN ("https://throbbing-bread-1016.cloudfla...")      Environment Variable      
env.POLICY_AUD ("3cd3e8e441c3a316e36262af3a1bb856b8e59...")       Environment Variable      

Uploaded goligo (21.72 sec)
Deployed goligo triggers (0.69 sec)
  https://goligo.kooraycoskun.workers.dev
Current Version ID: 6ba2f8b4-2ab0-41cf-8f17-4748d7dc77e5
```
## 08-check.log
```
Adres: https://goligo.kooraycoskun.workers.dev
/ -> HTTP 308 https://goliqo.com/
/giris -> HTTP 308 https://goliqo.com/giris
/api/study -> HTTP 308 https://goliqo.com/api/study
/ev-esyalar -> HTTP 308 https://goliqo.com/ev-esyalar
Site adresi: https://goliqo.com
https://goliqo.com/ -> HTTP 200 
https://goliqo.com/giris -> HTTP 200 
https://goliqo.com/ev-esyalar -> HTTP 200 
https://www.goliqo.com/ -> HTTP 301 https://goliqo.com/
```
## 09-old-address.log
```
Eski adres: lernkoko -> https://goliqo.com

 ⛅️ wrangler 4.92.0 (update available 4.160.1)
──────────────────────────────────────────────
Total Upload: 3.44 KiB / gzip: 1.65 KiB
Worker Startup Time: 3 ms
Your Worker has access to the following bindings:
Binding                          Resource                  
env.NEW_ORIGIN ("(hidden)")      Environment Variable      

Uploaded lernkoko (2.52 sec)
Deployed lernkoko triggers (0.66 sec)
  https://lernkoko.kooraycoskun.workers.dev
Current Version ID: 3ff0c782-f27f-4616-868f-5382c435fa09
```
