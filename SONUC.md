# Yayın sonucu

- Calisma: 42196742858 / commit 9ae64e973f87801330fa4b2426b2578e9b899ea9
- Tarih (UTC): 2026-11-06 09:42

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
Progress: resolved 640, reused 0, downloaded 28, added 0
Progress: resolved 640, reused 0, downloaded 61, added 0
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /home/runner/work/goligo/goligo/.sites-runtime/pnpm-store/v11
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 640, reused 0, downloaded 119, added 4
Progress: resolved 640, reused 0, downloaded 195, added 12
Progress: resolved 640, reused 0, downloaded 288, added 16
Progress: resolved 640, reused 0, downloaded 455, added 28
Progress: resolved 640, reused 0, downloaded 640, added 43
✓ Lockfile passes supply-chain policies (842 entries in 9s)
Progress: resolved 640, reused 0, downloaded 640, added 640, done
.../node_modules/workerd postinstall$ node install.js
.../esbuild@0.28.0/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall: Done
.../esbuild@0.28.0/node_modules/esbuild postinstall: Done
.../node_modules/workerd postinstall: Done
.../esbuild@0.27.3/node_modules/esbuild postinstall: Done
.../esbuild@0.25.12/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
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

Done in 11.2s using pnpm v11.25.0
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
rendering chunks...
computing gzip size...
[32m✓ built in 2.92s[39m
[34m[4/5] build client environment...[39m
[2Ktransforming...✓ 2164 modules transformed.
rendering chunks...
computing gzip size...
[33m[33m[PLUGIN_TIMINGS] [0mYour build spent significant time in plugins. Here is a breakdown:
  - vinext:middleware-server-only (20%)
  - alias (13%)
  - rsc:virtual-client-package (13%)
  - vinext:css-data-url (13%)
  - vinext:jsx-in-js (8%)
See https://rolldown.rs/options/checks#plugintimings for more details.
[39m
[32m✓ built in 9.35s[39m
[34m[5/5] build ssr environment...[39m
[2Ktransforming...✓ 400 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 2.29s[39m
[0m
  Route (app)
  ┌ ƒ /                      
  ├ ƒ /a1-1/berufe           
  ├ ƒ /a1-1/orte-und-dinge   
  ├ ƒ /a1-1/willkommen       
  ├ ƒ /a1-2/ausbildung       
  ├ ƒ /a1-2/ausbildung/hoeren
  ├ ƒ /a1-2/ev-ve-yasam      
  ├ ƒ /a1-2/wege-in-der-stadt
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
Site sesleri: 47730 dosya
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
        "sql_duration_ms": 0.0853
      },
      "duration": 0.0853,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1060864,
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
        "sql_duration_ms": 0.0721
      },
      "duration": 0.0721,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1060864,
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
        "sql_duration_ms": 0.31
      },
      "duration": 0.31,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1060864,
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
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/willkommen-progress-lyr3JuLs.js                                                                              │ esm  │ 24.79 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/willkommen-study-D5iS06PB.js                                                                                 │ esm  │ 88.09 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/zh-B-LNPdIV.js                                                                                               │ esm  │ 123.37 KiB   │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/_next/static/zh-DtKMQerf.js                                                                                               │ esm  │ 41.55 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/index.js                                                                                                                  │ esm  │ 274.65 KiB   │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ ssr/vinext-client-assets.js                                                                                                   │ esm  │ 34.80 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ vinext-client-assets.js                                                                                                       │ esm  │ 34.80 KiB    │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┼──────────────┤
│ Total (267 modules)                                                                                                           │      │ 13478.93 KiB │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────┴──────────────┘
🌀 Building list of assets...
✨ Read 48963 files from the assets directory /home/runner/work/goligo/goligo/dist/client
🌀 Starting asset upload...
🌀 Found 40 new or modified static assets to upload. Proceeding with upload...
+ /vinext-client-entry-manifest.json
+ /_next/static/chunks/app-route-prefetch-policy-C1NVR4lB.js
+ /_next/static/chunks/ausbildung-progress-ZLLnmOZt.js
+ /_next/static/chunks/site-languages-Br2BAxZk.js
+ /_next/static/chunks/stadt-study-BvlIhtay.js
+ /_next/static/chunks/category-study-DMtio2hr.js
+ /_next/static/chunks/start-wait-BjpfbK7D.js
+ /_next/static/chunks/ausbildung-study-CknjZWSq.js
+ /_next/static/chunks/game-names-C0Q3nMm8.js
+ /_next/static/chunks/orte-progress-Dm0qBilj.js
+ /_next/static/chunks/verb-study-OZwmLW5T.js
+ /_next/static/chunks/index-0KuYRycP.js
+ /_next/static/chunks/ar-BdA7Fai6.js
+ /_next/static/css/index.Bz9lIN5m.css
+ /_next/static/chunks/layout-segment-context-CA_8-zmI.js
+ /_next/static/chunks/stadt-progress-DqEFpfTU.js
+ /_next/static/chunks/course-selector-D8DH4PfW.js
+ /_next/static/chunks/ausbildung-hoeren-CdxQOh2i.js
+ /_next/static/chunks/progress-meter-DE4QRYe0.js
+ /_next/static/chunks/orte-study-BnYo0Wr2.js
+ /_next/static/chunks/stadt-a-steps-BdoKPv67.js
+ /_next/static/chunks/ausbildung-listen-CjMFxVdt.js
+ /_next/static/chunks/housing-study-DrQvunyy.js
+ /_next/static/chunks/willkommen-study-zdM7MK3e.js
+ /_next/static/chunks/learning-effects-DguBmWuC.js
+ /_next/static/chunks/en-g2yFhzO8.js
+ /_next/static/chunks/uk-B5uH-xSi.js
+ /_next/static/chunks/public-language-DqQgtPkU.js
+ /_next/static/chunks/device-language-BdIuu9hl.js
+ /_next/static/chunks/mistake-repeat-B5nzkq-J.js
+ /_next/static/chunks/housing-copy-D4aEdgXj.js
+ /_next/static/chunks/willkommen-progress-C5p3-jtx.js
+ /_next/static/chunks/berufe-a-steps-ClyRpmiY.js
+ /_next/static/chunks/talk-scenarios-DhhJFgby.js
+ /_next/static/chunks/object-study-B_Qa998l.js
+ /_next/static/chunks/berufe-progress-1Ag70Mvp.js
+ /_next/static/chunks/berufe-study-VY85dZyA.js
+ /_next/static/chunks/site-menu-B0wZUxeS.js
+ /_next/static/chunks/de-BvSYceVG.js
+ /_next/static/chunks/progress-ui-ANsJ56tM.js
Uploaded 13 of 40 assets
Uploaded 26 of 40 assets
Uploaded 40 of 40 assets
✨ Success! Uploaded 40 files (48876 already uploaded) (1.20 sec)

Total Upload: 15227.27 KiB / gzip: 5009.60 KiB
Worker Startup Time: 43 ms
Your Worker has access to the following bindings:
Binding                                                           Resource                  
env.EMAIL (unrestricted)                                          Send Email                
env.DB (lernkoko-db)                                              D1 Database               
env.AI                                                            AI                        
env.TEAM_DOMAIN ("https://throbbing-bread-1016.cloudfla...")      Environment Variable      
env.POLICY_AUD ("3cd3e8e441c3a316e36262af3a1bb856b8e59...")       Environment Variable      

Uploaded goligo (15.27 sec)
Deployed goligo triggers (0.71 sec)
  https://goligo.kooraycoskun.workers.dev
Current Version ID: e47ed0f9-777e-4333-ac68-7ef8dab9dcf0
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

 ⛅️ wrangler 4.92.0 (update available 4.158.0)
──────────────────────────────────────────────
Total Upload: 3.44 KiB / gzip: 1.65 KiB
Worker Startup Time: 2 ms
Your Worker has access to the following bindings:
Binding                          Resource                  
env.NEW_ORIGIN ("(hidden)")      Environment Variable      

Uploaded lernkoko (1.67 sec)
Deployed lernkoko triggers (0.53 sec)
  https://lernkoko.kooraycoskun.workers.dev
Current Version ID: 5a4ecf34-1ccd-4c3a-bc67-a7ec1524d2ef
```
