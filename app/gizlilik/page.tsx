import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../chatgpt-auth';
import {PublicPage} from '../public-shell';
import {Contact,LEGAL_UPDATED} from '../legal';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Gizlilik ve kişisel veriler · ${SITE_NAME}`,description:`${SITE_NAME} hangi kişisel verileri, neden ve nerede saklar; haklarını nasıl kullanırsın.`};

export default async function PrivacyPage(){
 const signedIn=!!(await getChatGPTUser());
 return <PublicPage signedIn={signedIn} narrow>
  <article className="lk-legal">
   <h1>Gizlilik ve kişisel veriler</h1>
   <p className="lk-legal-date">Son güncelleme: {LEGAL_UPDATED}</p>
   <p>{SITE_NAME}, Almanca ve İngilizce öğrenmek için ücretsiz bir sitedir. Bu metin, üye olduğunda hangi bilgilerinin saklandığını, neden saklandığını ve bu bilgiler üzerindeki haklarını anlatır.</p>

   <h2>Hangi bilgileri saklıyoruz?</h2>
   <ul>
    <li><strong>Hesap bilgileri:</strong> adın, e-posta adresin, üyelik ve son giriş tarihin, koşulları kabul ettiğin tarih.</li>
    <li><strong>Giriş zamanların:</strong> her girişinin tarihi ve saati. Bu kayıtlar en fazla 90 gün saklanır.</li>
    <li><strong>Şifren:</strong> şifrenin kendisi saklanmaz. Yalnızca geri çevrilemeyen bir özeti (PBKDF2-SHA256, her üyeye ayrı tuz) saklanır.</li>
    <li><strong>Çalışma kayıtların:</strong> başlattığın testler, verdiğin cevaplar, doğru/yanlış sonuçları, tekrar listesi, yıldızların ve site içi notların.</li>
    <li><strong>Oturum çerezi:</strong> giriş yaptığında tarayıcına <code>lk_session</code> adlı bir çerez yazılır. İçinde rastgele bir anahtar vardır; 30 gün sonra ya da çıkış yapınca geçersiz olur.</li>
    <li><strong>Güvenlik sayacı:</strong> şifre denemelerini sınırlamak için e-posta adresine ve IP adresine göre hatalı deneme sayısı tutulur. Bu sayaçlar en fazla 24 saat saklanır.</li>
    <li><strong>Tarayıcındaki ayarlar:</strong> site dili, ses ve efekt tercihleri gibi bazı ayarlar yalnızca kendi tarayıcında saklanır; bize gönderilmez.</li>
   </ul>

   <h2>Neden saklıyoruz?</h2>
   <p>Hesabını açmak, seni tanıyıp giriş yaptırmak, ilerlemeni kaydedip kaldığın yerden devam etmeni sağlamak, yanlışlarını tekrar göstermek ve hesabını kötüye kullanıma karşı korumak için. Bilgilerini reklam için kullanmayız, satmayız ve başkalarıyla paylaşmayız.</p>
   <p>Site yöneticisi, siteyi geliştirmek için üyelerin çalışma istatistiklerini (giriş zamanları, çalışılan bölümler, doğru ve yanlış cevaplar) yalnızca kendisinin açabildiği bir yönetici panelinde görebilir. Bu bilgiler kimseyle paylaşılmaz.</p>

   <h2>Nerede saklanıyor?</h2>
   <p>Site ve veritabanı <strong>Cloudflare</strong> altyapısında (Cloudflare Workers ve D1) çalışır. Bu nedenle bilgilerin <strong>Türkiye dışındaki sunucularda</strong> işlenebilir ve saklanabilir. Üye olurken bunu kabul edersin. Sayfaların yazı tipi Google Fonts&apos;tan yüklenir; bu sırada tarayıcın Google sunucularına bağlanır.</p>

   <h2>Ne kadar süre saklanıyor?</h2>
   <p>Hesabın açık olduğu sürece. Hesabını sildiğinde hesap bilgilerin, oturumların ve bütün çalışma kayıtların hemen silinir. Barındırma hizmetinin veritabanı geri yükleme kayıtlarında silinen bilgiler bir süre daha (en fazla 30 gün) kalabilir.</p>

   <h2>Hakların</h2>
   <ul>
    <li><strong>Görme ve indirme:</strong> <a href="/hesabim">Hesabım</a> sayfasındaki “Verilerimi indir” ile bütün bilgilerini bir dosya olarak alabilirsin.</li>
    <li><strong>Düzeltme:</strong> adını Hesabım sayfasından değiştirebilirsin.</li>
    <li><strong>Silme:</strong> Hesabım sayfasındaki “Hesabı sil” ile hesabını ve bütün kayıtlarını silebilirsin.</li>
    <li><strong>Diğer sorular:</strong> <Contact/>.</li>
   </ul>

   <h2>Çocuklar</h2>
   <p>18 yaşından küçüksen siteye anne, baba ya da velinin izniyle üye ol.</p>

   <h2>Değişiklikler</h2>
   <p>Bu metin değişirse yeni hali bu sayfada yayımlanır ve üstteki tarih güncellenir.</p>
  </article>
 </PublicPage>;
}
