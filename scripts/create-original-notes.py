from pathlib import Path
import json,html
from reportlab.platypus import SimpleDocTemplate,Paragraph,Table,TableStyle,Spacer,PageBreak,KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
pdfmetrics.registerFont(TTFont('DejaVu','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuBold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
data=json.loads((Path(__file__).resolve().parent.parent/'docs/unit-nine-note-content.json').read_text()); topics={t['id']:t for t in data['topics']}
ink=colors.HexColor('#17243b'); purple=colors.HexColor('#4a3dbe');soft=colors.HexColor('#eeedf8')
styles={
 'body':ParagraphStyle('body',fontName='DejaVu',fontSize=9.7,leading=14,textColor=ink,spaceAfter=7),
 'heading':ParagraphStyle('heading',fontName='DejaVuBold',fontSize=15,leading=20,textColor=purple,spaceAfter=8,spaceBefore=5),
 'sub':ParagraphStyle('sub',fontName='DejaVuBold',fontSize=10.3,leading=14,textColor=ink,spaceAfter=5,spaceBefore=4),
 'cell':ParagraphStyle('cell',fontName='DejaVu',fontSize=8.8,leading=12,textColor=ink),
 'cellhead':ParagraphStyle('cellhead',fontName='DejaVuBold',fontSize=8.5,leading=11,textColor=purple),
 'small':ParagraphStyle('small',fontName='DejaVu',fontSize=8.7,leading=12,textColor=colors.HexColor('#526078'),spaceAfter=5),
}
def p(text,kind='body'):
 text=text.replace('–','-').replace('—','-').replace('…','...'); return Paragraph(html.escape(text).replace('\n','<br/>'),styles[kind])
def table(tb):
 rows=[[p(c,'cellhead') for c in tb['heads']]]+[[p(c,'cell') for c in r] for r in tb['rows']]
 width=A4[0]-88; col=width/len(tb['heads']); tab=Table(rows,colWidths=[col]*len(tb['heads']),repeatRows=1,hAlign='LEFT')
 tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),soft),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),.8,purple),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#dde1e8')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)]));return tab
pages=[['appointments'],['u9-telefon','u9-zaman'],['u9-acilis','u9-modal'],['u9-artikel','u9-yer'],['u9-zamir','u9-ayrilan'],['u9-kurumlar'],['u9-fiiller'],['u9-nehmen','u9-esyalar'],['u9-planlar'],['u9-mesajlar','u9-sesler']]
story=[]
for page,ids in enumerate(pages):
 if page:story.append(PageBreak())
 for tid in ids:
  t=topics[tid];story.append(p(t['title'],'heading'));story.append(p(data['rules'].get(tid,t['lead'])))
  for b in t['blocks']:
   if b.get('table') and b['table']['heads'][0]=='Kısaltma':story.append(p(' · '.join(' / '.join(r) for r in b['table']['rows']),'small'))
   elif b.get('table'):story.append(table(b['table']));story.append(Spacer(1,7))
  examples=[e for b in t['blocks'] for e in b.get('examples',[])][:1]
  for e in examples:story.append(p(e['de']+' → '+e['tr'],'small'))
 if page==9:
  story.append(p('Bugünün önemli noktaları','sub'));story.append(p('Randevu: einen Termin vereinbaren. Saat: um; gün: am. ab başlangıç, bis bitiş. Modal fiil ikinci ögede, mastar sonda. zu ve bei Dativ ister. Zamiri Almanca artikeline göre seç.'))
 story.append(Spacer(1,5))
 def footer(canvas,doc):
  canvas.setFillColor(purple);canvas.setFont('DejaVuBold',10);canvas.drawString(44,A4[1]-32,'A1 ATÖLYE · ÜNİTE 9')
  canvas.setFillColor(colors.HexColor('#526078'));canvas.setFont('DejaVu',8);canvas.drawString(44,27,'Özgün düzenleme · Ders bilgileri · * işaretli bilgiler ek açıklamadır.');canvas.drawRightString(A4[0]-44,27,str(doc.page))
out=Path('public/unit-9/Almanca_A1_Unite_9_Ozgun_Notlar.pdf')
SimpleDocTemplate(str(out),pagesize=A4,rightMargin=44,leftMargin=44,topMargin=57,bottomMargin=44,title='A1 Atölye - Ünite 9 kısa çalışma notları',author='A1 Atölye').build(story,onFirstPage=footer,onLaterPages=footer)
