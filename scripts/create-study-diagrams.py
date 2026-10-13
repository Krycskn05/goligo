from pathlib import Path
import html,json
root=Path('public/unit-9/original');root.mkdir(parents=True,exist_ok=True)
def esc(s):return html.escape(s)
def svg(name,title,subtitle,rows,accent='#5147ce'):
 h=150+len(rows)*68
 body=[f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="{h}" viewBox="0 0 900 {h}" role="img" aria-labelledby="title desc"><title id="title">{esc(title)}</title><desc id="desc">{esc(subtitle+"; "+"; ".join(" — ".join(r) for r in rows))}</desc><rect width="900" height="{h}" rx="28" fill="#faf8f4"/><rect x="24" y="24" width="852" height="{h-48}" rx="22" fill="white" stroke="#d9dfeb"/><rect x="24" y="24" width="10" height="{h-48}" rx="5" fill="{accent}"/><text x="60" y="76" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#18233c">{esc(title)}</text><text x="60" y="112" font-family="Arial,sans-serif" font-size="19" fill="#53617b">{esc(subtitle)}</text>']
 for i,row in enumerate(rows):
  y=151+i*68;body.append(f'<rect x="50" y="{y-6}" width="800" height="59" rx="10" fill="{("#f1f0fa" if i%2==0 else "#ffffff")}"/>')
  for j,c in enumerate(row):
   x=66+j*(770//len(row));body.append(f'<text x="{x}" y="{y+29}" font-family="Arial,sans-serif" font-size="{24 if len(row)<4 else 22}" font-weight="{700 if j==0 else 500}" fill="{accent if j==0 else "#18233c"}">{esc(c)}</text>')
 body.append('</svg>');(root/(name+'.svg')).write_text(''.join(body))
svg('market','Supermarkt','Öffnungszeiten · Übungstafel',[['Mo–Sa','07:00–22:00'],['So','geschlossen']], '#18756a')
svg('salon','Friseur','Öffnungszeiten · Übungstafel',[['Di–Sa','08:00–20:00'],['Mo','geschlossen']], '#5147ce')
svg('doctor','Arztpraxis','Sprechzeiten · Übungstafel',[['Mo–Do','09:00–12:00'],['Fr','09:00–11:00']], '#18756a')
svg('post','Post','Öffnungszeiten · Übungstafel',[['Mo–Fr','07:30–18:00'],['Sa','10:00–12:00'],['So','geschlossen']], '#ad5b28')
svg('pharmacy','Apotheke','Öffnungszeiten · Übungstafel',[['Mo–Fr','09:00–19:00'],['Sa','09:00–15:00'],['So','geschlossen']], '#18756a')
svg('office','Bürgerbüro','Öffnungszeiten · Übungstafel',[['Mo, Mi, Fr','09:00–19:00'],['Di, Do','11:00–18:00'],['Sa, So','geschlossen']], '#5147ce')
svg('termin','Termin oder Treffen?','Kurze Merkhilfe',[['Termin','offiziell'],['Treffen / Date','privat'],['Verabredung','privat']], '#5147ce')
svg('zaman','Wann?','Zeitwörter in kurzen Beispielen',[['am','am Montag'],['um','um 10 Uhr'],['von … bis …','von 8 bis 17 Uhr'],['ab','ab 14 Uhr'],['bis','bis 18 Uhr'],['zwischen … und …','zwischen 12 und 14 Uhr']], '#18756a')
svg('muessen','müssen','Pflicht: etwas ist notwendig',[['ich','muss','wir','müssen'],['du','musst','ihr','müsst'],['er / sie / es','muss','sie / Sie','müssen']], '#5147ce')
svg('satzklammer','Zwei Verben: Satzklammer','Modalverb + Infinitiv',[['Ich','muss','heute Abend','kochen.'],['Subjekt','Position 2','Information','Satzende']], '#ad5b28')
svg('artikel','Artikel: drei Fälle','Maskulin / Feminin / Neutrum / Plural',[['Nominativ','der / die','das','die'],['Akkusativ','den / die','das','die'],['Dativ','dem / der','dem','den (+n)']], '#5147ce')
svg('zum-kiosk','Wohin?','zu + Dativ',[['zu dem','zum'],['zu der','zur'],['Ich gehe','zum Kiosk.']], '#18756a')
svg('kurumlar','Wo ist der Termin?','bei + Dativ',[['beim','Arzt / Friseur / Jobcenter'],['bei der','Bank / Polizei / Familienkasse'],['im','Rathaus']], '#ad5b28')
manifest=[]
for name in ['market','salon','doctor','post','pharmacy','office','termin','zaman','muessen','satzklammer','artikel','zum-kiosk','kurumlar']:
 manifest.append({'src':'/unit-9/original/'+name+'.svg','kind':'sign' if name in ['market','salon','doctor','post','pharmacy','office'] else 'diagram','name':name})
for name in ['kolja','suri','germain']:manifest.append({'src':'/unit-9/original/'+name+'.webp','kind':'scene','name':name})
labels={
 'market':('Supermarkt','Öffnungszeiten: Montag bis Samstag von 7 bis 22 Uhr; Sonntag geschlossen.'),
 'salon':('Friseur','Öffnungszeiten: Dienstag bis Samstag von 8 bis 20 Uhr; Montag geschlossen.'),
 'doctor':('Arztpraxis','Sprechzeiten: Montag bis Donnerstag von 9 bis 12 Uhr; Freitag von 9 bis 11 Uhr.'),
 'post':('Post','Öffnungszeiten: Montag bis Freitag von 7:30 bis 18 Uhr; Samstag von 10 bis 12 Uhr; Sonntag geschlossen.'),
 'pharmacy':('Apotheke','Öffnungszeiten: Montag bis Freitag von 9 bis 19 Uhr; Samstag von 9 bis 15 Uhr; Sonntag geschlossen.'),
 'office':('Bürgerbüro','Öffnungszeiten: Montag, Mittwoch und Freitag von 9 bis 19 Uhr; Dienstag und Donnerstag von 11 bis 18 Uhr; Wochenende geschlossen.'),
 'termin':('Termin oder Treffen?','Ein Termin ist offiziell; Treffen, Date und Verabredung sind privat.'),
 'zaman':('Zeitangaben','Merkhilfe für am, um, von … bis …, ab, bis und zwischen … und ….'),
 'muessen':('müssen','Konjugation von müssen für ich, du, er / sie / es, wir, ihr und sie / Sie.'),
 'satzklammer':('Satzklammer','Ich muss heute Abend kochen. Modalverb an Position 2, Infinitiv am Satzende.'),
 'artikel':('Artikeltabelle','Nominativ, Akkusativ und Dativ für Maskulinum, Femininum, Neutrum und Plural.'),
 'zum-kiosk':('zum und zur','zu dem wird zum; zu der wird zur. Ich gehe zum Kiosk.'),
 'kurumlar':('Ortsangaben','beim Arzt, bei der Bank und im Rathaus: Merkhilfe für Ortsangaben.'),
 'kolja':('Kolja ist krank','Ein Mann sitzt krank im Bett und hält sich die Stirn.'),
 'suri':('Suri ist müde','Eine müde Frau liegt im Bett; ein Wecker steht daneben.'),
 'germain':('Der Kühlschrank ist leer','Ein Mann schaut in einen leeren Kühlschrank.'),
}
for asset in manifest:asset['title'],asset['alt']=labels[asset['name']]
Path('lib/unit-nine-art.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
