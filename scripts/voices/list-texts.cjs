// Lists every German text the site speaks aloud, exactly as the pages pass it
// to speech (Ev ve Yaşam answers/passages/lesson examples, Nesne Kasası
// pronunciations and the voice preview). Needs the compiled lib (STUDY_CHECK_DIR).
const path=require('node:path');
const dir=process.env.STUDY_CHECK_DIR;
if(!dir)throw new Error('Set STUDY_CHECK_DIR to the compiled lib directory.');
const load=name=>require(path.join(dir,name+'.js'));
const housing=load('housing-course'),lessons=load('housing-lessons'),objects=load('object-course');
const practice=load('object-practice'),articles=load('article-challenges'),speech=load('german-speech'),voices=load('site-voices');
const texts=new Set();
const add=value=>{const text=voices.normalizeSpeechText(String(value??''));if(text)texts.add(text);};
add(speech.germanSpeechPreview);
for(const q of housing.housingQuestions){if(q.kind==='write'||q.options){add(q.answer);if(q.passage)add(q.passage);}}
for(const lesson of Object.values(lessons.housingLessons)){
 for(const example of lesson.examples)add(example.de);
 for(const step of lesson.steps)if(step.frame)add(step.frame.parts.map(part=>part.de).join(' '));
}
for(const q of objects.objectQuestions){
 const listening=practice.isObjectListeningQuestion(q);
 if(!practice.isObjectPictureQuestion(q)&&!practice.isObjectWritingQuestion(q)&&!listening)continue;
 const word=q.objectId?objects.objectWordMap.get(q.objectId):undefined;
 add(articles.isArticleChallenge(q)?articles.articleFullAnswer(q):word?word.de:q.answer);
 if(listening&&q.audio)add(q.audio);
}
process.stdout.write(JSON.stringify([...texts].sort(),null,1)+'\n');
