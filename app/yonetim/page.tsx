import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {getRawDb} from '@/db';
import {SITE_NAME} from '@/lib/site-brand';
import {signInPath} from '@/lib/member-auth';
import type {Db} from '@/lib/member-store';
import {isAdminEmail,loadOverview,loadAreas,loadMembers,loadTopMistakes,loadSessions,loadMember,formatTime,ago,percent,modeName,topicName,dayStart,zoneOffsetMs,type DayRow,type AreaRow,type SessionRow} from '@/lib/admin-stats';
import {getChatGPTUser} from '../chatgpt-auth';
import {PublicPage} from '../public-shell';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Yönetici paneli · ${SITE_NAME}`,robots:{index:false,follow:false}};

type Search=Promise<Record<string,string|string[]|undefined>>;

/**
 * Yönetici paneli: üyeler, giriş zamanları, ne çalıştıkları ve nerede yanlış yaptıkları.
 * Yalnızca lib/admin-access.ts içindeki ADMIN_EMAILS ile giriş yapan hesap görür; başka herkese
 * "Sayfa bulunamadı" görünür ve hiçbir kayıt okunmaz.
 */
export default async function AdminPage({searchParams}:{searchParams:Search}){
 const user=await getChatGPTUser();
 if(!user)redirect(signInPath('/yonetim'));
 if(!isAdminEmail(user.email))return <PublicPage signedIn narrow><section className="lk-auth-card" data-admin-denied><h1>Sayfa bulunamadı</h1><p className="lk-auth-lead">Aradığın sayfa yok.</p><a className="btn" href="/">Ana sayfaya dön</a></section></PublicPage>;
 const query=await searchParams;const memberId=typeof query.uye==='string'?query.uye:null;
 const db=getRawDb() as unknown as Db;const now=Date.now();
 try{
  if(memberId){
   const member=await loadMember(db,memberId,now);
   return <PublicPage signedIn><div className="adm" data-admin-panel="member">{member?<MemberView member={member} now={now}/>:<section className="adm-card"><a className="adm-back" href="/yonetim">← Yönetici paneli</a><h1>Üye bulunamadı</h1></section>}</div></PublicPage>;
  }
  const [overview,areas,members,mistakes,sessions]=await Promise.all([loadOverview(db,now),loadAreas(db),loadMembers(db,now),loadTopMistakes(db,20),loadSessions(db,30)]);
  const accuracy=percent(overview.correct,overview.answers);
  return <PublicPage signedIn><div className="adm" data-admin-panel="overview">
   <header className="adm-head"><div><span className="eyebrow">{SITE_NAME}</span><h1>Yönetici paneli</h1><p>Üyelerin ne çalıştığı, ne zaman girdiği ve nerede zorlandığı. Saatler Berlin saatiyle.</p></div>
    <nav className="adm-jump" aria-label="Bölümler"><a href="#uyeler">Üyeler</a><a href="#yanlislar">Zorlanılan sorular</a><a href="#son">Son çalışmalar</a></nav></header>
   <section className="adm-cards" aria-label="Özet">
    <Stat label="Üye" value={overview.members} note={`Son 7 günde ${overview.new7} yeni · 30 günde ${overview.new30}`}/>
    <Stat label="Bugün çalışan" value={overview.learnersToday} note={`7 günde ${overview.learners7} · 30 günde ${overview.learners30} kişi`}/>
    <Stat label="Giriş (7 gün)" value={overview.logins7} note="Her giriş ayrı sayılır"/>
    <Stat label="Toplam cevap" value={overview.answers} note={`${overview.learnersEver} kişi · ${overview.sessions} test`}/>
    <Stat label="Doğruluk" value={'%'+accuracy} note={`${overview.correct} doğru · ${overview.answers-overview.correct} yanlış`}/>
   </section>
   <section className="adm-card" aria-labelledby="adm-days"><h2 id="adm-days">Son 30 gün</h2><DayChart days={overview.days} now={now} withLearners/></section>
   <section className="adm-card" aria-labelledby="adm-areas"><h2 id="adm-areas">Bölümler</h2><Areas rows={areas}/><p className="adm-note">Lektion 12 (Ausbildung) ilerlemesi üyenin kendi tarayıcısında tutuluyor; bu yüzden burada görünmüyor.</p></section>
   <section className="adm-card" id="uyeler" aria-labelledby="adm-members"><h2 id="adm-members">Üyeler <small>{members.length}</small></h2>
    {members.length?<div className="adm-scroll"><table className="adm-table">
     <thead><tr><th>Üye</th><th>Üyelik</th><th>Son giriş</th><th>Giriş<br/><small>90 gün</small></th><th>Cevap</th><th>Doğru</th><th>Çalıştığı gün</th><th>Son çalışma</th><th>En çok</th></tr></thead>
     <tbody>{members.map(m=><tr key={m.id}>
      <td><a className="adm-member" href={'/yonetim?uye='+encodeURIComponent(m.id)}><strong>{m.name||'—'}</strong><small>{m.legacy?'Üyelikten önceki kayıtlar':m.email}</small></a></td>
      <td>{formatTime(m.createdAt,false)}</td>
      <td>{formatTime(m.lastLoginAt)}<small className="adm-ago">{ago(m.lastLoginAt,now)}</small></td>
      <td className="num">{m.legacy?'—':m.logins}</td>
      <td className="num">{m.answers}</td>
      <td className="num">{m.answers?'%'+percent(m.correct,m.answers):'—'}</td>
      <td className="num">{m.activeDays}</td>
      <td>{formatTime(m.lastStudyAt)}<small className="adm-ago">{ago(m.lastStudyAt,now)}</small></td>
      <td>{m.mainArea||'—'}</td>
     </tr>)}</tbody></table></div>:<p className="adm-empty">Henüz üye yok.</p>}
   </section>
   <section className="adm-card" id="yanlislar" aria-labelledby="adm-mistakes"><h2 id="adm-mistakes">En çok yanlış yapılan sorular</h2>
    {mistakes.length?<div className="adm-scroll"><table className="adm-table">
     <thead><tr><th>Soru</th><th>Doğru cevap</th><th>Yanlış</th><th>Kişi</th><th>En sık verilen yanlış cevaplar</th></tr></thead>
     <tbody>{mistakes.map(q=><tr key={q.id}>
      <td><span className="adm-tag">{q.areaName} · {q.task}</span><span className="adm-q">{q.prompt}</span>{q.detail&&<span className="adm-detail">{q.detail}</span>}</td>
      <td><strong lang="de">{q.answer||'—'}</strong></td>
      <td className="num">{q.wrong}<small className="adm-ago">{q.total} denemede</small></td>
      <td className="num">{q.learners}</td>
      <td>{q.wrongAnswers.map(w=><span className="adm-wrong" key={w.answer} lang="de">{w.answer||'(boş)'} <small>×{w.n}</small></span>)}</td>
     </tr>)}</tbody></table></div>:<p className="adm-empty">Henüz yanlış cevap yok.</p>}
   </section>
   <section className="adm-card" id="son" aria-labelledby="adm-recent"><h2 id="adm-recent">Son çalışmalar</h2><Sessions rows={sessions} showMember now={now}/></section>
  </div></PublicPage>;
 }catch(error){
  console.error('Yönetici paneli okunamadı',error);
  return <PublicPage signedIn narrow><section className="lk-auth-card"><h1>Yönetici paneli</h1><p className="lk-form-error" role="alert">Kayıtlara şu anda ulaşılamıyor. Biraz sonra yeniden dene.</p></section></PublicPage>;
 }
}

function Stat({label,value,note}:{label:string;value:number|string;note:string}){
 return <div className="adm-stat"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

/** One bar per day: the answers of that day; the tooltip also tells the learners, logins and new members. */
function DayChart({days,now,withLearners=false}:{days:DayRow[];now:number;withLearners?:boolean}){
 const offset=zoneOffsetMs(now);const max=Math.max(1,...days.map(d=>d.answers));
 const total=days.reduce((sum,d)=>sum+d.answers,0);
 return <figure className="adm-chart">
  <div className="adm-bars" role="img" aria-label={`Son ${days.length} günde ${total} cevap`}>
   {days.map((d,i)=>{const date=formatTime(dayStart(d.day,offset)+12*3600000,false).slice(0,5);
    const tip=`${date}: ${d.answers} cevap (%${percent(d.correct,d.answers)} doğru)${withLearners?` · ${d.learners} kişi`:''} · ${d.logins} giriş${withLearners&&d.newMembers?` · ${d.newMembers} yeni üye`:''}`;
    return <div className="adm-bar" key={d.day} title={tip}>
     <span className="adm-bar-fill" style={{height:Math.max(d.answers?6:0,Math.round(d.answers/max*100))+'%'}}><span className="adm-bar-ok" style={{height:percent(d.correct,d.answers)+'%'}}/></span>
     {d.logins>0&&<i className="adm-login-dot" aria-hidden="true"/>}
     <small>{i%5===0||i===days.length-1?date:''}</small>
    </div>;})}
  </div>
  <figcaption><span className="adm-key ok"/>Doğru <span className="adm-key bad"/>Yanlış <span className="adm-key login"/>Giriş yapılan gün · Çubuğun üstüne gelince ayrıntı görünür.</figcaption>
 </figure>;
}

function Areas({rows,learners=true}:{rows:AreaRow[];learners?:boolean}){
 const max=Math.max(1,...rows.map(r=>r.answers));
 return <ul className="adm-areas">{rows.map(r=><li key={r.area}>
  <span className="adm-area-name">{r.name}</span>
  <span className="adm-area-bar"><span style={{width:Math.round(r.answers/max*100)+'%'}}/></span>
  <span className="adm-area-num"><strong>{r.answers}</strong> cevap · %{percent(r.correct,r.answers)} doğru{learners?` · ${r.learners} kişi`:''}</span>
 </li>)}</ul>;
}

function Sessions({rows,showMember=false,now}:{rows:SessionRow[];showMember?:boolean;now:number}){
 if(!rows.length)return <p className="adm-empty">Henüz test başlatılmamış.</p>;
 return <div className="adm-scroll"><table className="adm-table">
  <thead><tr><th>Zaman</th>{showMember&&<th>Üye</th>}<th>Konu</th><th>Çalışma</th><th>Cevap</th><th>Doğru</th></tr></thead>
  <tbody>{rows.map(s=><tr key={s.id}>
   <td>{formatTime(s.createdAt)}<small className="adm-ago">{ago(s.createdAt,now)}</small></td>
   {showMember&&<td><a className="adm-member" href={'/yonetim?uye='+encodeURIComponent(s.userId)}><strong>{s.name||'—'}</strong></a></td>}
   <td>{topicName(s.topic)}</td>
   <td>{modeName(s.mode)}{s.finishedAt?<small className="adm-ago">bitti</small>:null}</td>
   <td className="num">{s.answered}{s.questions?<small className="adm-ago">/ {s.questions}</small>:null}</td>
   <td className="num">{s.answered?'%'+percent(s.correct,s.answered):'—'}</td>
  </tr>)}</tbody></table></div>;
}

function MemberView({member,now}:{member:NonNullable<Awaited<ReturnType<typeof loadMember>>>;now:number}){
 const m=member;
 return <>
  <a className="adm-back" href="/yonetim">← Yönetici paneli</a>
  <header className="adm-head"><div><span className="eyebrow">{m.legacy?'Üyelikten önceki kayıtlar':'Üye'}</span><h1>{m.name||'—'}</h1><p>{m.email}{m.createdAt?` · ${formatTime(m.createdAt,false)} tarihinden beri üye`:''}</p></div></header>
  <section className="adm-cards" aria-label="Özet">
   <Stat label="Son giriş" value={m.lastLoginAt?ago(m.lastLoginAt,now):'—'} note={formatTime(m.lastLoginAt)}/>
   <Stat label="Giriş" value={m.logins.length} note="Son 90 gün"/>
   <Stat label="Cevap" value={m.answers} note={`${m.correct} doğru · ${m.answers-m.correct} yanlış`}/>
   <Stat label="Doğruluk" value={m.answers?'%'+percent(m.correct,m.answers):'—'} note={`${m.activeDays} gün çalıştı`}/>
   <Stat label="Son çalışma" value={m.lastStudyAt?ago(m.lastStudyAt,now):'—'} note={m.firstStudyAt?`İlk: ${formatTime(m.firstStudyAt,false)}`:'Henüz çalışmadı'}/>
  </section>
  <section className="adm-card" aria-labelledby="adm-m-days"><h2 id="adm-m-days">Son 60 gün</h2><DayChart days={m.days} now={now}/></section>
  <div className="adm-two">
   <section className="adm-card" aria-labelledby="adm-m-areas"><h2 id="adm-m-areas">Bölümler</h2><Areas rows={m.areas} learners={false}/></section>
   <section className="adm-card" aria-labelledby="adm-m-logins"><h2 id="adm-m-logins">Giriş zamanları</h2>
    {m.logins.length?<ol className="adm-logins">{m.logins.slice(0,40).map(at=><li key={at}>{formatTime(at)}<small className="adm-ago">{ago(at,now)}</small></li>)}</ol>
    :<p className="adm-empty">{m.lastLoginAt?`Kayıtlı giriş yok. Son giriş: ${formatTime(m.lastLoginAt)}`:'Kayıtlı giriş yok.'}</p>}
    <p className="adm-note">Girişler son 90 gün tutulur.</p>
   </section>
  </div>
  <section className="adm-card" aria-labelledby="adm-m-hard"><h2 id="adm-m-hard">En çok zorlandığı sorular</h2>
   {m.hardest.length?<div className="adm-scroll"><table className="adm-table">
    <thead><tr><th>Soru</th><th>Doğru cevap</th><th>Son yanlış cevabı</th><th>Yanlış</th><th>Durum</th></tr></thead>
    <tbody>{m.hardest.map(q=><tr key={q.id}>
     <td><span className="adm-tag">{q.areaName} · {q.task}</span><span className="adm-q">{q.prompt}</span>{q.detail&&<span className="adm-detail">{q.detail}</span>}</td>
     <td><strong lang="de">{q.answer||'—'}</strong></td>
     <td><span className="adm-wrong" lang="de">{q.lastWrong||'(boş)'}</span></td>
     <td className="num">{q.wrongCount}<small className="adm-ago">{q.seen} denemede</small></td>
     <td>{q.streak>=3?'Öğrendi':q.streak>0?`Son ${q.streak} kez doğru`:'Tekrar bekliyor'}</td>
    </tr>)}</tbody></table></div>:<p className="adm-empty">Yanlışı yok.</p>}
  </section>
  <section className="adm-card" aria-labelledby="adm-m-mistakes"><h2 id="adm-m-mistakes">Son yanlış cevapları</h2>
   {m.mistakes.length?<div className="adm-scroll"><table className="adm-table">
    <thead><tr><th>Zaman</th><th>Soru</th><th>Verdiği cevap</th><th>Doğru cevap</th></tr></thead>
    <tbody>{m.mistakes.map((q,i)=><tr key={q.id+i}>
     <td>{formatTime(q.at)}</td>
     <td><span className="adm-tag">{q.areaName} · {q.task}</span><span className="adm-q">{q.prompt}</span>{q.detail&&<span className="adm-detail">{q.detail}</span>}</td>
     <td><span className="adm-wrong" lang="de">{q.given||'(boş)'}</span></td>
     <td><strong lang="de">{q.answer||'—'}</strong></td>
    </tr>)}</tbody></table></div>:<p className="adm-empty">Yanlış cevabı yok.</p>}
  </section>
  <section className="adm-card" aria-labelledby="adm-m-sessions"><h2 id="adm-m-sessions">Testleri</h2><Sessions rows={m.sessions} now={now}/></section>
 </>;
}
