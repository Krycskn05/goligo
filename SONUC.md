# Yayın sonucu

- Calisma: 40136361907 / commit 5caf57b967c2f82f7487c6c429c80d277198feff
- Tarih (UTC): 2026-10-24 21:57

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
v24.21.0
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
Progress: resolved 640, reused 0, downloaded 55, added 0
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /home/runner/work/goligo/goligo/.sites-runtime/pnpm-store/v11
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 640, reused 0, downloaded 132, added 8
Progress: resolved 640, reused 0, downloaded 251, added 16
Progress: resolved 640, reused 0, downloaded 549, added 48
Progress: resolved 640, reused 0, downloaded 640, added 240
Progress: resolved 640, reused 0, downloaded 640, added 640, done
✓ Lockfile passes supply-chain policies (842 entries in 6.2s)
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../node_modules/workerd postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.28.0/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
.../node_modules/unrs-resolver postinstall: Done
.../esbuild@0.18.20/node_modules/esbuild postinstall: Done
.../node_modules/workerd postinstall: Done
.../esbuild@0.27.3/node_modules/esbuild postinstall: Done
.../esbuild@0.28.0/node_modules/esbuild postinstall: Done

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

Done in 8.6s using pnpm v11.25.0
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
[2Ktransforming...✓ 485 modules transformed.
rendering chunks...
[32m✓ built in 1.51s[39m
[34m[2/5] analyze server references...[39m
[2Ktransforming...✓ 336 modules transformed.
rendering chunks...
[32m✓ built in 495ms[39m
[34m[3/5] build rsc environment...[39m
[2Ktransforming...✓ 482 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 1.36s[39m
[34m[4/5] build client environment...[39m
[2Ktransforming...✓ 2107 modules transformed.
rendering chunks...
computing gzip size...
[33m[33m[PLUGIN_TIMINGS] [0mYour build spent significant time in plugins. Here is a breakdown:
  - vinext:middleware-server-only (32%)
  - rsc:virtual-client-package (11%)
  - alias (10%)
  - vinext:jsx-in-js (10%)
  - vinext:css-data-url (10%)
See https://rolldown.rs/options/checks#plugintimings for more details.
[39m
[32m✓ built in 15.51s[39m
[34m[5/5] build ssr environment...[39m
[2Ktransforming...✓ 342 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 1.03s[39m
[0m
  Route (app)
  ┌ ƒ /                      
  ├ ƒ /a1-1/willkommen       
  ├ ƒ /a1-2/ausbildung       
  ├ ƒ /a1-2/ausbildung/hoeren
  ├ ƒ /a1-2/ev-ve-yasam      
  ├ λ /api/auth              
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
 }
}
```
## 05-voices.log
```
Site sesleri: 32410 dosya
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
        "sql_duration_ms": 0.0319
      },
      "duration": 0.0319,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1101824,
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
        "sql_duration_ms": 0.0243
      },
      "duration": 0.0243,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1101824,
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
        "sql_duration_ms": 0.3322
      },
      "duration": 0.3322,
      "changes": 0,
      "last_row_id": 0,
      "changed_db": false,
      "size_after": 1101824,
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
+ /voices/F2/d6b79073ba180e8b.mp3
+ /voices/M2/af66685b314a285a.mp3
+ /voices/M4/bbe43e801618e427.mp3
+ /voices/F1/8df97696d2d7e981.mp3
+ /voices/F3/c364255e65e16bb1.mp3
+ /voices/M3/a4c04cff60d819ab.mp3
+ /voices/F2/32ecaccf078dfd6c.mp3
+ /voices/F3/8df97696d2d7e981.mp3
+ /voices/M2/5b3bbc8876e3bc0e.mp3
+ /voices/M3/32ecaccf078dfd6c.mp3
+ /voices/F2/f04e9b188aa8abb7.mp3
+ /voices/M1/af66685b314a285a.mp3
+ /voices/M3/fa05a25d11943995.mp3
+ /voices/F2/2f4ceae40e82e7c6.mp3
+ /voices/F4/822ba85802f8f67c.mp3
+ /voices/M2/666b86d0462c946b.mp3
+ /voices/M3/529de96021824a9e.mp3
+ /voices/M3/8b726a6899b69fa8.mp3
+ /voices/M5/32ecaccf078dfd6c.mp3
+ /voices/F1/af66685b314a285a.mp3
+ /voices/F2/3d0cbd48a2e52111.mp3
+ /voices/F2/5b3bbc8876e3bc0e.mp3
+ /voices/F2/c8943c9d882297dd.mp3
+ /voices/F4/2f4ceae40e82e7c6.mp3
+ /voices/F4/c8943c9d882297dd.mp3
+ /voices/M1/c8943c9d882297dd.mp3
+ /voices/M3/c8943c9d882297dd.mp3
+ /voices/M4/822ba85802f8f67c.mp3
+ /voices/F1/b7a2bf5422490d44.mp3
+ /voices/F2/af1dd0ad780b2480.mp3
+ /voices/F4/857e6574abbfc227.mp3
+ /voices/F5/822ba85802f8f67c.mp3
+ /voices/M1/b7a2bf5422490d44.mp3
+ /voices/M2/529de96021824a9e.mp3
+ /voices/M2/857e6574abbfc227.mp3
+ /voices/M3/0e0ba5d621cb99e5.mp3
+ /voices/M4/32ecaccf078dfd6c.mp3
+ /voices/M5/c8943c9d882297dd.mp3
+ /voices/F2/0e0ba5d621cb99e5.mp3
+ /voices/F2/ec94df6f6c761786.mp3
+ /voices/F4/598131b19f12c430.mp3
+ /voices/F5/5b3bbc8876e3bc0e.mp3
+ /voices/M1/857e6574abbfc227.mp3
+ /voices/M2/8c7ce924656093d0.mp3
+ /voices/M3/261877e401933964.mp3
+ /voices/M3/d93dd0e1d68dc1b3.mp3
+ /voices/M4/5b048ec5abdde0e1.mp3
+ /voices/M5/b7a2bf5422490d44.mp3
+ /voices/F2/500a54a20cff670a.mp3
+ /voices/F4/529de96021824a9e.mp3
+ /voices/F4/ea5a03d64e1e30da.mp3
+ /voices/F5/857e6574abbfc227.mp3
+ /voices/M1/598131b19f12c430.mp3
+ /voices/M1/ec94df6f6c761786.mp3
+ /voices/M2/4a0b3c9f10d342cd.mp3
+ /voices/M2/e51f4377cb30d3c3.mp3
+ /voices/M3/3aab147144059763.mp3
+ /voices/M3/ebc88e910c651adb.mp3
+ /voices/M4/598131b19f12c430.mp3
+ /voices/M5/822ba85802f8f67c.mp3
+ /voices/F1/3d0cbd48a2e52111.mp3
   (truncating changed assets log, set `WRANGLER_LOG=debug` environment variable to see full diff)
Uploaded 329 of 986 assets
Uploaded 658 of 986 assets
Uploaded 986 of 986 assets
✨ Success! Uploaded 986 files (32285 already uploaded) (2.27 sec)

Total Upload: 12227.88 KiB / gzip: 4056.23 KiB
Worker Startup Time: 21 ms
Your Worker has access to the following bindings:
Binding                                                           Resource                  
env.EMAIL (unrestricted)                                          Send Email                
env.DB (lernkoko-db)                                              D1 Database               
env.TEAM_DOMAIN ("https://throbbing-bread-1016.cloudfla...")      Environment Variable      
env.POLICY_AUD ("3cd3e8e441c3a316e36262af3a1bb856b8e59...")       Environment Variable      

Uploaded goligo (12.37 sec)
Deployed goligo triggers (0.58 sec)
  https://goligo.kooraycoskun.workers.dev
Current Version ID: 3228759e-053e-4f30-bfaa-f381874a1524
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

 ⛅️ wrangler 4.92.0 (update available 4.152.0)
──────────────────────────────────────────────
Total Upload: 3.44 KiB / gzip: 1.65 KiB
Worker Startup Time: 1 ms
Your Worker has access to the following bindings:
Binding                          Resource                  
env.NEW_ORIGIN ("(hidden)")      Environment Variable      

Uploaded lernkoko (1.55 sec)
Deployed lernkoko triggers (0.59 sec)
  https://lernkoko.kooraycoskun.workers.dev
Current Version ID: 81b42a75-5b1a-48ad-a574-1a785e3245a0
```
