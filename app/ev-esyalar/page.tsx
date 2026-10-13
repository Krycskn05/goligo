import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import ObjectStudy from '../object-study';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Nesne Kasası · ${SITE_NAME}`,description:'Almanca veya İngilizce nesne adlarını özgün resimlerle öğren. Test ve Yazarak Pekiştir çalışmaları, seçtiğin dilde seslendirme ve kaldığın yerden devam etme.'};
export default function ObjectsPage(){return <ObjectStudy/>;}
