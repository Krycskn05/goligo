'use client';
import {learningText,type LearningLanguage} from '@/lib/learning-language';
import type {StudyLanguage} from '@/lib/study-languages';
export function CourseSelector({course,language,onChange,disabled=false}:{course:LearningLanguage;language:StudyLanguage;onChange:(course:LearningLanguage)=>void;disabled?:boolean}){
 return <div className="learning-course-switch" role="group" aria-label={learningText(language,'select')}>{(['de','en'] as const).map(value=><button type="button" key={value} className={course===value?'active':''} aria-pressed={course===value} disabled={disabled} onClick={()=>onChange(value)}><span className="course-language-mark" aria-hidden="true">{value.toUpperCase()}</span><span><strong>{learningText(language,value)}</strong><small lang={value}>{value==='de'?'Deutsch lernen':'Learn English'}</small></span></button>)}</div>;
}
