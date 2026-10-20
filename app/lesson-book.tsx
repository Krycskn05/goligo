import type {ReactNode} from 'react';

/**
 * The lesson pages as an open spiral notebook (Lektion 11 „Ev ve Yaşam", Lektion 12 „Ausbildung").
 * - `even`: two equal pages (a lesson's cover and its contents),
 * - `wide`: a narrower left page (title, picture, progress) and a wider right page for the work,
 * - `single`: one page with the rings on top (practice questions and results).
 * Below 1000 px the two pages stack and the rings move to the top. Styles: app/lesson-book.css.
 * app/housing-lesson.tsx writes the same markup itself (its render test loads that file alone).
 */
export function LessonBook({left,right,variant='even',className=''}:{left?:ReactNode;right:ReactNode;variant?:'even'|'wide'|'single';className?:string}){
 return <div className={'lb lb-'+variant+(className?' '+className:'')}>
  <div className="lb-spread">
   {variant!=='single'&&<div className="lb-page lb-left">{left}</div>}
   <div className="lb-rings" aria-hidden="true"/>
   <div className="lb-page lb-right">{right}</div>
  </div>
 </div>;
}
