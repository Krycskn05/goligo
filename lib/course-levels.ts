import {courseUnits,type CourseLevel} from './level-course';
export function curriculumTopicIds(id:string):string[]|undefined{
 // These are independent A–D subtopics, not legacy aliases for the whole unit.
 if(/^book-11-[a-d]$/.test(id))return [id];
 const unit=courseUnits.find(u=>u.id===id)??courseUnits.find(u=>u.legacyTopics.includes(id));
 if(unit)return [unit.id,...unit.legacyTopics];
 if(id==='a11-all'||id==='a12-all'){
  const level:CourseLevel=id==='a11-all'?'A1.1':'A1.2';
  return [...new Set(courseUnits.filter(u=>u.level===level).flatMap(u=>[u.id,...u.legacyTopics]))];
 }
 return undefined;
}
export function courseUnitForTopic(topic:string){return courseUnits.find(u=>u.id===topic)??courseUnits.find(u=>u.legacyTopics.includes(topic));}
export function inCourseUnit(topic:string,id:string){return curriculumTopicIds(id)?.includes(topic)??topic===id;}
