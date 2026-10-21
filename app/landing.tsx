import {BookOpen,CheckCircle2,Headphones,Languages,RotateCcw,Sparkles} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {PublicHeader} from './public-shell';
import {SiteFooter} from './site-footer';
import {BrandLogoWave} from './site-logo';
import {pickPictures,type PicturePart} from '@/lib/site-pictures';

// One card for each part of the site, in the order of the menu; the pictures come from all the learner's sets and change
// every 30 minutes (lib/site-pictures.ts; the learner asked: not always the same).
const features:{part:PicturePart;title:string;text:string}[]=[
 {part:'units',title:'Üniteler ve konular',text:'Kitaptaki üniteler A1.1 ve A1.2 olarak sırayla: konu notları, test, yazarak pekiştirme ve harf bulmacaları.'},
 {part:'vault',title:'Nesne Kasası',text:'Evdeki, mutfaktaki ve işteki eşyaların adlarını özgün resimlerle öğren. Almanca ya da İngilizce çalışabilirsin.'},
 {part:'verbs',title:'Fiil Atölyesi',text:'Fiiller tek tek ilerler: kart, anlam testi, yazım, geçmiş hali (Partizip II) ve onun yazımı.'},
 {part:'games',title:'Oyunlar',text:'Eşleştirme kartlarıyla fiilleri resmiyle, anlamıyla ya da Perfekt hâliyle eşleştir.'},
 {part:'mistakes',title:'Yanlışlarım',text:'Yanlış cevapladığın sorular burada toplanır; doğru cevapladıkça listeden çıkar.'},
];
const perks=[
 {icon:Headphones,text:'Cevaptan sonra doğru cevabın söylenişini duyarsın.'},
 {icon:RotateCcw,text:'İlerlemen hesabına kaydedilir; kaldığın yerden devam edersin.'},
 {icon:Languages,text:'Açıklamaları kendi dilinde okuyabilirsin: Türkçe, İngilizce, Arapça, Ukraynaca ve daha fazlası.'},
 {icon:Sparkles,text:'Puan, günlük hedef ve seri ile her gün biraz çalışmak kolaylaşır.'},
];
const steps=['Ücretsiz üye ol: adın, e-postan ve bir şifre yeterli.','Bir konu seç: kelimeler, fiiller ya da ünite konuları.','Her gün biraz çalış; yanlışların tekrar karşına gelir.'];

/** Giriş yapmamış ziyaretçinin gördüğü tanıtım sayfası. */
export default function Landing(){
 const pictures=pickPictures();
 return <div className="lk-public lk-landing" data-landing>
  <a className="skip-link" href="#main">İçeriğe geç</a>
  <PublicHeader/>
  <main id="main" tabIndex={-1} className="lk-public-main">
   <section className="lk-hero" aria-labelledby="lk-hero-title">
    <div className="lk-hero-text">
     <BrandLogoWave className="lk-hero-logo"/>
     <p className="lk-eyebrow">Ücretsiz Almanca ve İngilizce</p>
     <h1 id="lk-hero-title">Almancayı resimlerle, sesle ve küçük adımlarla öğren.</h1>
     <p className="lk-lead">{SITE_NAME}&apos;da kelimeleri resimli kartlarla tanır, testle pekiştirir, harf bulmacasıyla yazarsın. Üye ol, ilerlemen kaybolmasın.</p>
     <div className="lk-hero-actions">
      <a className="btn" href="/uye-ol" data-landing-register>Ücretsiz üye ol</a>
      <a className="btn secondary" href="/giris">Giriş yap</a>
     </div>
     <p className="lk-hero-note"><CheckCircle2 size={18} aria-hidden="true"/>Ücretsiz. Reklam yok.</p>
    </div>
    <div className="lk-hero-art"><img src={pictures.welcome} alt="Kitap maskotuyla birlikte Almanca öğrenenler; arkada Berlin’deki Brandenburg Kapısı" width={1400} height={700}/></div>
   </section>

   <section className="lk-section" aria-labelledby="lk-features-title">
    <h2 id="lk-features-title">Neler var?</h2>
    <div className="lk-features">
     {features.map(item=><article key={item.title} className="lk-feature">
      <img src={pictures[item.part]} alt="" width={1200} height={600} loading="lazy"/>
      <div><h3>{item.title}</h3><p>{item.text}</p></div>
     </article>)}
    </div>
   </section>

   <section className="lk-section lk-perks" aria-label="Öğrenirken">
    <ul>{perks.map(({icon:Icon,text})=><li key={text}><Icon size={22} aria-hidden="true"/><span>{text}</span></li>)}</ul>
   </section>

   <section className="lk-section lk-steps" aria-labelledby="lk-steps-title">
    <h2 id="lk-steps-title">Nasıl başlarım?</h2>
    <ol>{steps.map((text,index)=><li key={text}><span className="lk-step-number" aria-hidden="true">{index+1}</span><span>{text}</span></li>)}</ol>
    <div className="lk-hero-actions center">
     <a className="btn" href="/uye-ol">Ücretsiz üye ol</a>
     <a className="btn secondary" href="/giris"><BookOpen size={18} aria-hidden="true"/>Zaten üyeyim</a>
    </div>
   </section>
  </main>
  <SiteFooter/>
 </div>;
}
