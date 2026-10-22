// The legal notice (the learner asked, 22 October 2026): /impressum in German, open without an account, linked in the
// footer of every page; for now only the city as the address (the learner's choice).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');

test('the Impressum: details, page, footer link, open to everyone',()=>{
 const brand=load('site-brand'),auth=load('member-auth'),legal=load('legal-copy'),site=load('site-languages');
 assert.equal(brand.IMPRESSUM.name,'Koray Coşkun');assert.deepEqual([...brand.IMPRESSUM.address],['Berlin']);assert.equal(brand.IMPRESSUM.email,'info@goliqo.com');
 assert.equal(brand.SITE_CONTACT_EMAIL,'info@goliqo.com','the privacy page and the terms name the same address');
 assert.ok(auth.isPublicPath('/impressum'));
 const page=read('app/impressum/page.tsx');
 for(const part of ['<h1>Impressum</h1>','Angaben gemäß § 5 DDG','{IMPRESSUM.name}','mailto:${IMPRESSUM.email}','<div lang="de" dir="ltr">',"language!=='de'&&<p className=\"lk-legal-note\" lang={language}>{legalText(language,'impressumNote')}</p>"])assert.ok(page.includes(part),part);
 assert.ok(read('app/site-footer.tsx').includes('<a href="/impressum" lang="de" data-footer-impressum>Impressum</a>'));
 for(const id of site.siteLanguages.map(item=>item.id))assert.ok(legal.legalText(id,'impressumNote').trim(),id);
 assert.ok(read('ci/smoke.cjs').includes('"/impressum"'),'the site check opens it');
});
