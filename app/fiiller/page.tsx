import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import VerbStudy from '../verb-study';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Fiiller · ${SITE_NAME}`,description:'Almanca fiilleri anlamı, Präsens ve Perfekt biçimleriyle ezberle: Gör ve Seç, Yazarak Pekiştir ve Dinle ve Bul çalışmaları, ilerleme, yıldızlar ve kaldığın yerden devam etme.'};
export default function VerbsPage(){return <VerbStudy/>;}
