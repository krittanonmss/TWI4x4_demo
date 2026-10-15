'use strict';
// Deterministic examples built from the opening catalog; all customers are fictional.
function prepareDemoExamples(base){
 const result=structuredClone(base);result.orders=[];
 const anchor=Math.max(...result.moves.map(m=>new Date(m.at).getTime()));
 const at=minutes=>new Date(anchor+minutes*60000).toISOString();
 function line(id,qty,price){const p=result.products.find(p=>p.id===id);return {productId:id,name:p.name,sku:p.sku,qty,priceCents:Math.round(price*100)}}
 function bill(serial,state,customer,lines,minutes,note){const createdAt=at(minutes);const o={id:'sample-order-'+serial,serial,number:'SO-DEMO-'+String(serial).padStart(5,'0'),customer:customer+' (ตัวอย่าง)',phone:'',address:'ข้อมูลลูกค้าสมมติสำหรับทดลองระบบ',note,lines,state,createdAt,createdBy:'ฝ่ายขาย (ตัวอย่าง)',example:true};
  if(['confirmed','fulfilled','cancelled'].includes(state)){o.confirmedAt=at(minutes+5);o.confirmedBy='ฝ่ายขาย (ตัวอย่าง)'}
  if(state==='fulfilled'){o.fulfilledAt=at(minutes+15);o.fulfilledBy='ฝ่ายคลัง (ตัวอย่าง)';for(const l of lines){const p=result.products.find(p=>p.id===l.productId),before=p.qty;p.qty-=l.qty;result.moves.push({id:'sample-ship-'+serial+'-'+p.id,productId:p.id,name:l.name,sku:l.sku,kind:'out',qty:l.qty,before,after:p.qty,ref:o.number,reason:'จ่ายสินค้าตามบิลขายให้ '+o.customer,actor:o.fulfilledBy,orderId:o.id,at:o.fulfilledAt})}}
  if(state==='cancelled'){o.cancelledAt=at(minutes+15);o.cancelledBy='ฝ่ายขาย (ตัวอย่าง)'}
  result.orders.push(o);return o;
 }
 bill(1,'fulfilled','ร้านนครปฐมออฟโรด',[line('3',2,6500),line('5',3,3200)],30,'จ่ายสินค้าครบแล้ว ใช้ดูบิลพิมพ์และประวัติตัดสต๊อก ไม่ได้หมายถึงรับชำระแล้ว');
 bill(2,'fulfilled','ร้านลุยทางไกล',[line('7',1,7200)],60,'ตัวอย่างจ่ายครบ 1 รายการ ลองกดดูบิลและพิมพ์ PDF');
 bill(3,'confirmed','ร้านแอดเวนเจอร์การาจ',[line('1',2,18500),line('7',1,7200)],90,'รอคลังจัดสินค้า 2 รายการ กดกระดิ่งและทดลองยืนยันจ่ายได้');
 bill(4,'confirmed','ทีมทัวริ่ง 4WD',[line('2',1,14500),line('4',1,12800)],120,'รอจ่ายสินค้าที่ใกล้หมด ยอดจองยังไม่ตัดยอดคงเหลือจริง');
 bill(5,'draft','คุณต้น สายแคมป์',[line('8',2,1800),line('5',1,3200)],150,'ยังไม่ยืนยัน จึงยังไม่จองสินค้า ทดลองยืนยันหรือยกเลิกบิลได้');
 bill(6,'cancelled','ร้านเอ็กซ์พลอเรอร์',[line('5',2,3200)],180,'ตัวอย่างยืนยันแล้วเปลี่ยนใจยกเลิก คืนยอดจองทั้งหมด ไม่มีรายการตัดสต๊อก');
 const p=result.products.find(p=>p.id==='8');let before=p.qty;p.qty+=2;result.moves.push({id:'sample-return-8',productId:p.id,name:p.name,sku:p.sku,kind:'return',qty:2,before,after:p.qty,ref:'RT-DEMO-001',reason:'รับคืนสินค้าสาธิตจากหน้าร้าน (ไม่ใช่คืนตามบิลขาย)',actor:'ฝ่ายคลัง (ตัวอย่าง)',at:at(210)});
 before=p.qty;p.qty-=1;result.moves.push({id:'sample-adjust-8',productId:p.id,name:p.name,sku:p.sku,kind:'adjust',qty:-1,before,after:p.qty,ref:'ADJ-DEMO-001',reason:'ตรวจนับพบสินค้าตัวอย่างชำรุด 1 ชิ้น ปรับออกจากยอด',actor:'ฝ่ายคลัง (ตัวอย่าง)',at:at(220)});
 result.orders.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));result.moves.sort((a,b)=>new Date(b.at)-new Date(a.at));result.exampleSetVersion=1;return result;
}
function scenariosPage(){
 const samples=data.orders.filter(o=>o.example);const rows=[['fulfilled','จ่ายสินค้าแล้ว','คลังจ่ายครบและตัดสต๊อกแล้ว เปิดบิลเพื่อพิมพ์หรือเทียบประวัติ (ยังไม่มีการรับชำระเงิน)','warehouse'],['confirmed','รอคลังจ่ายสินค้า','ยืนยันและจองแล้ว ลองเปิดแจ้งเตือน → จ่ายตามบิล → ดูยอดและประวัติที่เปลี่ยน','warehouse'],['draft','บิลฉบับร่าง','บันทึกบิลแล้วแต่ยังไม่จอง ทดลองยืนยันบิลเพื่อส่งงานให้คลัง หรือยกเลิก','sales'],['cancelled','บิลยกเลิก','ยกเลิกก่อนจ่าย ยอดจองถูกคืน และไม่เกิดรายการตัดสต๊อก','sales']];
 return heading('INTERACTIVE DEMO PLAYBOOK','คู่มือทดลองทุกเคส','เริ่มจากตัวอย่างที่เตรียมไว้ หรือสร้างรายการใหม่เองได้ · ทุกข้อมูลเป็นข้อมูลสมมติ','<button class="button" data-action="load-examples">↻ โหลดชุดตัวอย่างเริ่มต้น</button>')+`<div class="notice">ทดลองต่อเนื่องในเบราว์เซอร์นี้: ฝ่ายขายเปิดบิล → ยืนยันจอง → สลับฝ่ายคลัง → กดกระดิ่ง → จ่ายตามบิล → ดูประวัติ · การแจ้งเตือนยังไม่ข้ามเครื่อง</div>${samples.length?'':'<div class="notice">ข้อมูลที่บันทึกไว้เดิมยังไม่มีชุดบิลตัวอย่าง กด “โหลดชุดตัวอย่างเริ่มต้น” เพื่อเริ่มสาธิต ระบบจะให้ยืนยันก่อนแทนข้อมูลเดิม</div>'}<div class="scenario-grid">${rows.map(([state,title,description,view])=>{const examples=samples.filter(o=>o.state===state);return `<article class="panel scenario-card"><span class="eyebrow">SALES CASE · ${state.toUpperCase()}</span><h2>${title}</h2><p>${description}</p><div class="scenario-links">${examples.map(o=>`<button class="button" data-action="try-case" data-role="${view}" data-id="${esc(o.id)}">${esc(o.number)} · ${esc(o.customer)} ↗</button>`).join('')||'<span class="muted">ตัวอย่างถูกเปลี่ยนสถานะแล้ว โหลดชุดเริ่มต้นเพื่อดูเคสนี้อีกครั้ง</span>'}</div></article>`}).join('')}${[
 ['CMS: สินค้าเผยแพร่ / ฉบับร่าง','ดูข้อมูล SKU สเปก หมวดหมู่ รุ่นรถ แล้วทดลองเพิ่มสินค้า แก้ไข และเผยแพร่ ก่อนเปิดแค็ตตาล็อก','products','admin','ไปจัดการสินค้า'],
 ['คลัง: พร้อมขาย / ใกล้หมด / หมด','ดูยอดจริง ยอดจอง พร้อมขาย และขั้นต่ำ กันชนหลัง Expedition เป็นสินค้าหมด ลองรับเข้าแล้วดูสถานะเปลี่ยน','stock','warehouse','ไปคลังสินค้า'],
 ['คลัง: รับเข้า / เบิกออก / รับคืน / ปรับยอด','มีประวัติตัวอย่างครบทั้ง 4 ประเภท พร้อมเลขอ้างอิง เหตุผล ผู้ทำรายการ และยอดก่อน–หลัง','history','warehouse','ดูประวัติสต๊อก'],
 ['บิลใหม่: หลายสินค้า / ราคา / พิมพ์ PDF','เปิดบิลใหม่ กรอกลูกค้า เลือกหลายรายการ ระบุจำนวนและราคา บันทึกร่างแล้วทดลองยืนยันและพิมพ์','orders','sales','ไปฝ่ายขาย'],
 ['แจ้งเตือนคลัง: บิลรอจ่าย','ปุ่มกระดิ่งแสดงจำนวนงานค้าง เปิดบิลเพื่อจัดสินค้า จ่ายหรือยกเลิกแล้วบิลออกจากคิว','notifications','warehouse','เปิดแจ้งเตือนคลัง'],
 ['ตรวจสอบข้อมูล: SKU ซ้ำ / สต๊อกไม่พอ','ลองเพิ่ม SKU ซ้ำ ยืนยันบิลเกินยอดพร้อมขาย หรือเบิกจนต่ำกว่ายอดจอง ระบบจะแสดงเหตุผลและไม่บันทึกรายการ','stock','warehouse','ทดลองรายการสต๊อก'],
 ['แค็ตตาล็อก: สินค้าที่เผยแพร่เท่านั้น','สินค้าแบบร่างไม่แสดงในแค็ตตาล็อก ตรวจภาพประกอบ รายละเอียดรถ และสถานะพร้อมขาย','catalog','sales','ดูแค็ตตาล็อก'],
 ['รายงาน: ส่งออกสต๊อก CSV','ค้นหาและกรองรายการในคลัง แล้วกดส่งออก CSV เพื่อดาวน์โหลดข้อมูลตามตัวกรอง','stock','warehouse','ส่งออกจากหน้าคลัง']
 ].map(([title,description,target,view,label])=>`<article class="panel scenario-card"><span class="eyebrow">FEATURE WALKTHROUGH</span><h2>${title}</h2><p>${description}</p><button class="button" data-action="try-feature" data-target="${target}" data-role="${view}">${label} ↗</button></article>`).join('')}</div><div class="notice">ขอบเขตเดโม: ไม่มีการรับเงิน ใบเสร็จ ใบกำกับภาษี การจ่ายบางส่วน หรือคืนสินค้าตามบิล · การสลับฝ่ายเป็นสิทธิ์จำลอง ข้อมูลบันทึกเฉพาะเบราว์เซอร์นี้</div>`;
}
function loadExampleData(){openModal('โหลดชุดข้อมูลตัวอย่าง',`<p>ระบบจะแทนข้อมูลสินค้า บิลขาย และประวัติที่ทดลองไว้ในเบราว์เซอร์นี้ ด้วยชุดตัวอย่างเริ่มต้น</p><p>ประกอบด้วยบิลจ่ายแล้ว 2 บิล รอคลังจ่าย 2 บิล ร่าง 1 บิล และยกเลิก 1 บิล พร้อมประวัติสต๊อกครบทุกประเภท</p>`,()=>{commitData(structuredClone(seed));activeOrder=null;query='';filter='all';$('#modal').close();location.hash='#scenarios';render();toast('โหลดชุดตัวอย่างครบแล้ว · มีบิลรอคลังจ่าย 2 บิล')});$('#form button[type="submit"]').textContent='ยืนยันโหลดตัวอย่าง'}
