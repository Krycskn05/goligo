import {courseUnits,type CourseUnit} from './textbook-curriculum';
import type {Topic} from './lessons';
import {englishObjectQuestions} from './english-objects';

// Match the current German catalogue: headings and art only.
export const englishCourseUnits:CourseUnit[]=courseUnits.map(unit=>({...unit,id:'en-'+unit.id,de:unit.names[2],legacyTopics:[]}));
export const englishTopics:Topic[]=[...englishCourseUnits.map(unit=>({id:unit.id,title:unit.title,de:unit.de,unit:unit.number,section:unit.level,pages:'',minutes:0,lead:'',blocks:[]})),...['objects-house','objects-furniture','objects-building','objects-moving','objects-tools','objects-kitchen','objects-cleaning','objects-nature','objects-body','objects-health','objects-food','objects-drinks','objects-cooking','objects-school','objects-outdoors','objects-all','a11-all','a12-all','all'].map(id=>({id:'en-'+id,title:id,de:id,unit:0,section:'',pages:'',minutes:0,lead:'',blocks:[]}))];
export const englishQuestions=englishObjectQuestions;
export function englishUnitContains(topic:string,unit:string){
 if(unit==='en-all')return true;
 if(unit==='en-a11-all'||unit==='en-a12-all')return englishCourseUnits.some(u=>u.id===topic&&u.level===(unit==='en-a11-all'?'A1.1':'A1.2'));
 return unit==='en-objects-all'?topic.startsWith('en-objects-'):topic===unit;
}
