import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import StudyApp from '../category-study';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Üniteler ve konular · ${SITE_NAME}`,description:'Kitaptaki A1.1 ve A1.2 üniteleri sırayla: Ev ve Yaşam, Ausbildung ve yakında gelecek üniteler.'};
/** The units catalogue (the home page "/" shows Koko's tour of the site). Members only: the site gate sends visitors to /giris. */
export default function UnitsPage(){return <StudyApp page="units"/>;}
