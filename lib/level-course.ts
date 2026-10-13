import type {Question} from './course';
import type {Topic,Word} from './lessons';
import {courseUnits} from './textbook-curriculum';
export {courseUnits} from './textbook-curriculum';
export type {CourseLevel,CourseUnit} from './textbook-curriculum';

export const levelTopics:Topic[]=courseUnits.map(u=>({id:u.id,title:u.title,de:u.de,unit:u.number,section:u.level,pages:'',minutes:0,lead:'',blocks:[]}));
export const levelWords:Word[]=[];
export const levelQuestions:Question[]=[];
