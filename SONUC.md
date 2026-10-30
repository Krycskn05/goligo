# Yayın sonucu

- Calisma: 41109862340 / commit 6a224adf5b8072f82f2295db9b3074506f80ddb1
- Tarih (UTC): 2026-10-30 18:48

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
v24.22.1
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
Progress: resolved 640, reused 0, downloaded 22, added 0
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /home/runner/work/goligo/goligo/.sites-runtime/pnpm-store/v11
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 640, reused 0, downloaded 64, added 4
Progress: resolved 640, reused 0, downloaded 151, added 8
Progress: resolved 640, reused 0, downloaded 302, added 20
Progress: resolved 640, reused 0, downloaded 487, added 33
Progress: resolved 640, reused 0, downloaded 640, added 106
✓ Lockfile passes supply-chain policies (842 entries in 6.5s)
Progress: resolved 640, reused 0, downloaded 640, added 451
Progress: resolved 640, reused 0, downloaded 640, added 640, done
.../esbuild@0.28.0/node_modules/esbuild postinstall$ node install.js
.../node_modules/workerd postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.28.0/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
.../node_modules/unrs-resolver postinstall: Done
.../node_modules/workerd postinstall: Done
.../esbuild@0.25.12/node_modules/esbuild postinstall: Done
.../esbuild@0.18.20/node_modules/esbuild postinstall: Done
.../esbuild@0.27.3/node_modules/esbuild postinstall: Done

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

Done in 9.9s using pnpm v11.25.0
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
[32m✓ built in 676ms[39m
[34m[3/5] build rsc environment...[39m
[2Ktransforming...✓ 492 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 1.59s[39m
[34m[4/5] build client environment...[39m
[2Ktransforming...✓ 2125 modules transformed.
rendering chunks...
computing gzip size...
[33m[33m[PLUGIN_TIMINGS] [0mYour build spent significant time in plugins. Here is a breakdown:
  - vinext:middleware-server-only (33%)
  - vinext:css-data-url (17%)
  - vinext:jsx-in-js (10%)
  - alias (9%)
  - rsc:virtual-client-package (9%)
See https://rolldown.rs/options/checks#plugintimings for more details.
[39m
[32m✓ built in 11.87s[39m
[34m[5/5] build ssr environment...[39m
[2Ktransforming...✓ 361 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 1.21s[39m
[0m
  Route (app)
  ┌ ƒ /                      
  ├ ƒ /a1-1/willkommen       
  ├ ƒ /a1-2/ausbildung       
  ├ ƒ /a1-2/ausbildung/hoeren
  ├ ƒ /a1-2/ev-ve-yasam      
  ├ ƒ /a1-2/wege-in-der-stadt
  ├ λ /api/auth              
  ├ λ /api/ilerleme          
  ├ λ /api/konus             
  ├ λ /api/study             
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
Site sesleri: 36900 dosya
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
        "sql_duration_ms": 0.1273
      },
      "duration": 0.1273,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1187840,
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
        "sql_duration_ms": 0.0987
      },
      "duration": 0.0987,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1187840,
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
        "sql_duration_ms": 0.3563
      },
      "duration": 0.3563,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1187840,
      "rows_read": 29,
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
│ ssr/_next/static/verb-examples.ur-DIyBHPQY.js                                                                                 │ esm  │ 67.29 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/verb-examples.vi-oJBkyLE9.js                                                                                 │ esm  │ 55.89 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/verb-examples.zh-6_3FJGhA.js                                                                                 │ esm  │ 40.09 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/verb-study-DbuKV3uI.js                                                                                       │ esm  │ 130.39 KiB   │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/vi-0UPe3YK1.js                                                                                               │ esm  │ 130.33 KiB   │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/willkommen-course-xdDe5F5S.js                                                                                │ esm  │ 13.70 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/willkommen-progress-5gmm8FkI.js                                                                              │ esm  │ 39.20 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/willkommen-study-Cm1qjmmM.js                                                                                 │ esm  │ 90.83 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/zh-BufHI_O_.js                                                                                               │ esm  │ 111.87 KiB   │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/zh-Dz2CxW1Q.js                                                                                               │ esm  │ 41.55 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/index.js                                                                                                                  │ esm  │ 274.15 KiB   │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/vinext-client-assets.js                                                                                                   │ esm  │ 27.77 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ vinext-client-assets.js                                                                                                       │ esm  │ 27.77 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ Total (240 modules)                                                                                                           │      │ 11222.90 KiB │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────┴──────────────┘
🌀 Building list of assets...
✨ Read 37835 files from the assets directory /home/runner/work/goligo/goligo/dist/client
🌀 Starting asset upload...
🌀 Found 29 new or modified static assets to upload. Proceeding with upload...
+ /vinext-client-entry-manifest.json
+ /_next/static/chunks/public-language-Dn40b2cf.js
+ /_next/static/chunks/ausbildung-progress-XfzIT8at.js
+ /_next/static/chunks/ausbildung-hoeren-BMnYYNtl.js
+ /_next/static/chunks/category-study-CfY4s0IK.js
+ /_next/static/chunks/willkommen-progress-B2jKnnod.js
+ /_next/static/chunks/ausbildung-listen-BUEzXKDK.js
+ /_next/static/chunks/housing-study-NfOPVew9.js
+ /_next/static/chunks/learning-effects-b__SPsUq.js
+ /_next/static/chunks/progress-ui-CTt2Y9tq.js
+ /_next/static/chunks/vault-language-preference-h5GBBeQw.js
+ /_next/static/chunks/app-route-prefetch-policy-m37GopM3.js
+ /_next/static/chunks/course-selector-pU-iQXie.js
+ /_next/static/chunks/housing-copy-CkhunWSx.js
+ /_next/static/chunks/talk-scenarios-CFRSbaTd.js
+ /_next/static/chunks/ausbildung-study-EGUG7yAG.js
+ /_next/static/chunks/stadt-study-xcBzlmrW.js
+ /_next/static/chunks/willkommen-study-CF_Z0X49.js
+ /_next/static/chunks/site-menu-BChvaEwS.js
+ /_next/static/css/index.CEvBaCV0.css
+ /_next/static/chunks/layout-segment-context-D84NuMvv.js
+ /_next/static/chunks/device-language-B3q5DUho.js
+ /_next/static/chunks/site-languages-BeW364j1.js
+ /_next/static/chunks/stadt-progress-BS-sU94U.js
+ /_next/static/chunks/object-study-B7aehu7P.js
+ /_next/static/chunks/start-wait-Cf77DiPh.js
+ /_next/static/chunks/game-names-BANXgUHA.js
+ /_next/static/chunks/verb-study-CVi5s9iw.js
+ /_next/static/chunks/index-DppFCvxk.js
Uploaded 9 of 29 assets
Uploaded 19 of 29 assets
Uploaded 29 of 29 assets
✨ Success! Uploaded 29 files (37763 already uploaded) (2.17 sec)

Total Upload: 12620.50 KiB / gzip: 4166.89 KiB
Worker Startup Time: 26 ms
Your Worker has access to the following bindings:
Binding                                                           Resource                  
env.EMAIL (unrestricted)                                          Send Email                
env.DB (lernkoko-db)                                              D1 Database               
env.AI                                                            AI                        
env.TEAM_DOMAIN ("https://throbbing-bread-1016.cloudfla...")      Environment Variable      
env.POLICY_AUD ("3cd3e8e441c3a316e36262af3a1bb856b8e59...")       Environment Variable      

Uploaded goligo (14.43 sec)
Deployed goligo triggers (0.70 sec)
  https://goligo.kooraycoskun.workers.dev
Current Version ID: 22df4ebf-834d-4d76-906b-1bc963bbaf85
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

 ⛅️ wrangler 4.92.0 (update available 4.156.0)
──────────────────────────────────────────────
Total Upload: 3.44 KiB / gzip: 1.65 KiB
Worker Startup Time: 3 ms
Your Worker has access to the following bindings:
Binding                          Resource                  
env.NEW_ORIGIN ("(hidden)")      Environment Variable      

Uploaded lernkoko (2.19 sec)
Deployed lernkoko triggers (1.82 sec)
  https://lernkoko.kooraycoskun.workers.dev
Current Version ID: 3febdb37-22dd-478b-b52c-6496bb21f45d
```
