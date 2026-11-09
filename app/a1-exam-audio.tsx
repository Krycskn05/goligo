'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {AudioLine} from '@/lib/a1-exam-types';
import {useGermanSpeech} from './study-shared';

/**
 * Plays the texts of a Hören exam (A1 sınavı): the lines of one text in order, each with its speaker's own site voice
 * (lib/site-voices.ts; women and men differ, a person keeps one voice). Until the natural voices of a new text are
 * rendered — or when they cannot be loaded — the device's German voice reads every line. One text plays at a time;
 * `playing` is its key. Modelled on the Lektion 12 player (app/ausbildung-listen.tsx): the next line starts when the
 * speech goes from busy to idle.
 */
export function useExamAudio(){
 const speech=useGermanSpeech('de');
 const [playing,setPlaying]=useState<string|null>(null);
 const queue=useRef<{key:string;lines:readonly AudioLine[];index:number}|null>(null);const started=useRef(false);
 const latest=useRef(speech);latest.current=speech;
 const speakAt=useCallback((index:number)=>{
  const current=queue.current;if(!current)return;
  if(index>=current.lines.length){queue.current=null;setPlaying(null);return;}
  current.index=index;started.current=true;
  const line=current.lines[index];const voice=latest.current.siteVoices.find(item=>item.style===line.voice);
  latest.current.speak(line.text,false,voice?.id,1);
 },[]);
 // A line has ended (busy → idle): read the next one.
 useEffect(()=>{if(speech.busy){started.current=true;return;}if(started.current&&queue.current){started.current=false;speakAt(queue.current.index+1);}},[speech.busy,speakAt]);
 const stop=useCallback(()=>{queue.current=null;started.current=false;setPlaying(null);latest.current.stop();},[]);
 /** Starts a text from its first line (called in the tap, so the first line may play on iOS). */
 const play=useCallback((key:string,lines:readonly AudioLine[])=>{
  started.current=false;latest.current.stop();
  if(!lines.length)return;
  queue.current={key,lines,index:0};setPlaying(key);speakAt(0);
 },[speakAt]);
 useEffect(()=>()=>{queue.current=null;},[]);
 return {play,stop,playing,warning:speech.warning,voices:speech.siteVoicesState};
}
export type ExamAudio=ReturnType<typeof useExamAudio>;
