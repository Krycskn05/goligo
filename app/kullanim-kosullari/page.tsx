import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../chatgpt-auth';
import {PublicPage} from '../public-shell';
import {Contact,LEGAL_UPDATED} from '../legal';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Kullanım koşulları · ${SITE_NAME}`,description:`${SITE_NAME} üyeliğinin kuralları.`};

export default async function TermsPage(){
 const signedIn=!!(await getChatGPTUser());
 return <PublicPage signedIn={signedIn} narrow>
  <article className="lk-legal">
   <h1>Kullanım koşulları</h1>
   <p className="lk-legal-date">Son güncelleme: {LEGAL_UPDATED}</p>
   <p>{SITE_NAME}&apos;ya üye olarak bu koşulları kabul etmiş olursun. Kişisel bilgilerinin nasıl kullanıldığı <a href="/gizlilik">gizlilik metninde</a> anlatılır.</p>

   <h2>Hizmet</h2>
   <p>{SITE_NAME} şu anda ücretsizdir. Site olduğu gibi sunulur; her zaman kesintisiz ve hatasız çalışacağını garanti edemeyiz. Dersler, alıştırmalar ve özellikler zamanla değişebilir.</p>

   <h2>Hesabın</h2>
   <ul>
    <li>Kayıt olurken doğru bir e-posta adresi kullan. Bir hesap tek bir kişi içindir.</li>
    <li>Şifreni kimseyle paylaşma ve başka sitelerde kullandığın bir şifreyi seçme. Hesabında yapılan işlemlerden sen sorumlusun.</li>
    <li>Hesabını istediğin zaman <a href="/hesabim">Hesabım</a> sayfasından silebilirsin.</li>
   </ul>

   <h2>Yapılmaması gerekenler</h2>
   <ul>
    <li>Başkasının hesabına girmeye çalışmak.</li>
    <li>Siteye zarar vermek, güvenliğini aşmaya çalışmak ya da siteyi otomatik araçlarla aşırı yüklemek.</li>
    <li>Sitedeki resimleri, metinleri ve alıştırmaları kopyalayıp başka yerde yayımlamak ya da satmak.</li>
   </ul>
   <p>Bu kurallara uyulmazsa hesap kapatılabilir.</p>

   <h2>İçerik</h2>
   <p>Sitedeki resimler, metinler ve alıştırmalar kişisel öğrenmen içindir. Her özenle hazırlansa da hata olabilir; bir hata görürsen bize bildir: <Contact/>.</p>

   <h2>Değişiklikler</h2>
   <p>Bu koşullar değişirse yeni hali bu sayfada yayımlanır ve üstteki tarih güncellenir.</p>
  </article>
 </PublicPage>;
}
