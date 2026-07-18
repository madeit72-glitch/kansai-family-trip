const seed = {
  selected: '2026-08-05',
  days: [
    ['2026-08-03','월','3','간사이공항에서 교토로 이동'],['2026-08-04','화','4','교토에 머무는 날'],
    ['2026-08-05','수','5','교토에서 오사카로 이동'],['2026-08-06','목','6','오사카에 머무는 날'],
    ['2026-08-07','금','7','오사카에 머무는 날'],['2026-08-08','토','8','부산으로 돌아가는 날']
  ],
  schedules: {
    '2026-08-03':[
      ['05:30','[이동] 김해공항','~07:00 · 김해국제공항 · 공항 주차 및 국제선 수속'],
      ['08:25','[이동] 간사이공항','~10:00 · 부산 → 오사카(KIX T1) · 진에어 탑승'],
      ['10:00','[이동] 입국·수하물·교통 준비','~11:20 · Visit Japan QR, 수하물 수령, ICOCA/하루카 확인 · 후라이 551에서 만두(새우 2개, 고기 1개) 구매 · 편의점(계란샌드위치, 물), 환전'],
      ['11:44','[이동] 교토행 하루카','~13:00 · 간사이공항 → 교토역 · 하루카 특급 8호차 6A/6B/6C/6D'],
      ['13:00','[이동] 교토역에서 호텔','~14:00 · 게이오 프렐리아 호텔 교토 가라스마 고조 이동 및 짐 보관'],
      ['14:00','[관광] 교토 시내','~18:00 · 첫날 가벼운 관광 및 카페·휴식'],
      ['18:00','[식사] 호텔 인근','~20:00 · 저녁 식사 또는 다이마루 교토점 식료품 이용 · 후보: 교토 시조우 쿠온 우동, 코우 우나와 혼텐 장어덮밥, 이치란 라면'],
      ['20:00','[쇼핑] 돈키호테 시조도리','~22:00 · 다이마루 교토점 백화점 인근 · 돈키호테 쇼핑'],
      ['20:00','[이동] 돈키호테에서 숙소','~22:00 · 버스로 숙소 이동']
    ],
    '2026-08-04':[
      ['08:00','[관광] 교토 주요 관광','~18:00 · 아라시야마·치쿠린·기찻길 등 상세 동선 입력'],
      ['18:00','[관광] 가모강·시조 일대','~21:00 · 저녁 산책, 쇼핑, 식사']
    ],
    '2026-08-05':[
      ['06:00','[관광] 교토 오전 일정','~13:00 · 호텔 → 교토역 · 체크아웃, 기요미즈테라, 점심'],
      ['14:00','[이동] 호텔에서 교토역','~15:00 · 체크아웃 후 이동'],
      ['15:00','[이동] 교토역에서 오사카 난바','~16:00 · 센타라 라이프 난바 호텔 오사카 이동'],
      ['17:00','[관광] 난바·도톤보리','~18:00 · 호텔 짐 보관 후 난바 일대 관광']
    ],
    '2026-08-06':[['09:00','[관광] 오사카 시내','~21:00 · 오사카성, 저녁 야경(하루카스300 또는 우메다 공중정원), 도톤보리']],
    '2026-08-07':[['09:00','[관광] 오사카 시내','~21:00 · 백화점(한큐, 우메다), 도톤보리 저녁']],
    '2026-08-08':[
      ['08:00','[쇼핑] 난바·호텔 인근','~12:00 · 체크아웃 전후 마지막 쇼핑 및 식사'],
      ['12:00','[이동] 난바에서 간사이공항','~14:00 · 라피트 또는 공항급행 이용'],
      ['14:00','[이동] 출국 수속','~17:35 · 수하물 위탁, 보안검색, 면세점'],
      ['17:35','[이동] 오사카에서 부산','~19:30 · 진에어 LJ254 귀국편']
    ]
  },
  bookings: {
    '2026-08-03':[['✈️','진에어 LJ255','부산 08:25 → 간사이 09:55 · 4명','TA4B8B'],['🚆','하루카 교토행','11:44 · 8호차 · 6A/6B/6C/6D','4명'],['🏨','Keio Prelia Hotel Kyoto','8/3~8/5 · 2박 · 4 Bedded Room','1727950482']],
    '2026-08-05':[['🏨','Centara Life Namba Hotel Osaka','8/5~8/8 · 3박 · Family Room','1727992244']],
    '2026-08-08':[['✈️','진에어 LJ254','간사이 17:35 → 부산 18:55 · 4명','TA4B8B']]
  },
  checks:[['여권 4명',true],['eSIM · 로밍',true],['상비약',false],['보조배터리',false],['교통카드',true],['우산 · 양산',false]],
  lodgings:{
    kyoto:{name:'Keio Prelia Hotel Kyoto Karasuma Gojo',address:'396 Gojo Karasuma-cho, Shimogyo-ku, Kyoto 600-8418, Japan',map:'https://www.google.com/maps/search/?api=1&query=Keio+Prelia+Hotel+Kyoto+Karasuma+Gojo'},
    osaka:{name:'Centara Life Namba Hotel Osaka',address:'3-4-21 Shikitsuhigashi, Naniwa Ward, Osaka 556-0012, Japan',map:'https://www.google.com/maps/search/?api=1&query=Centara+Life+Namba+Hotel+Osaka'}
  }
};
let state = JSON.parse(localStorage.getItem('kansai-family-trip') || 'null') || structuredClone(seed);
const $ = s => document.querySelector(s);
const save = () => { localStorage.setItem('kansai-family-trip', JSON.stringify(state)); window.scheduleCloudSave?.(); };
const escapeHtml = s => String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderDates(){ $('#dateStrip').innerHTML=state.days.map(d=>`<button class="date-button ${d[0]===state.selected?'active':''}" data-date="${d[0]}"><span>${d[1]}</span><strong>${d[2]}</strong></button>`).join(''); }
function render(){
  renderDates(); const day=state.days.find(d=>d[0]===state.selected); $('#dayTitle').textContent=day[3]; $('#dayLabel').textContent=`8월 ${day[2]}일 · ${day[1]}요일`;
  const stay=state.selected<='2026-08-04'?state.lodgings?.kyoto:state.lodgings?.osaka;if(stay){$('#hotelMap').href=stay.map;$('#hotelMap').textContent=`🗺️ ${state.selected<='2026-08-04'?'교토':'오사카'} 숙소`;$('#copyAddress').dataset.address=stay.address;$('#copyAddress').dataset.name=stay.name}
  const schedules=state.schedules[state.selected]||[];
  $('#scheduleList').innerHTML=schedules.length?schedules.map((x,i)=>`<article class="timeline-item"><time class="timeline-time">${escapeHtml(x[0])}</time><i class="timeline-dot"></i><div class="timeline-card"><button class="delete" data-delete-schedule="${i}" aria-label="일정 삭제">×</button><h3>${escapeHtml(x[1])}</h3><p>${escapeHtml(x[2])}</p></div></article>`).join(''):'<div class="empty">등록된 일정이 없습니다. 첫 일정을 추가해 보세요.</div>';
  const bookings=state.bookings[state.selected]||[];
  $('#bookingList').innerHTML=bookings.length?bookings.map((x,i)=>`<article class="booking-card"><span class="booking-icon">${x[0]}</span><div><h3>${escapeHtml(x[1])}</h3><p>${escapeHtml(x[2])}</p></div><div><button class="delete" data-delete-booking="${i}" aria-label="예약 삭제">×</button><span class="booking-code">${escapeHtml(x[3])}</span></div></article>`).join(''):'<div class="empty">이 날짜의 예약이 없습니다.</div>';
  $('#checkList').innerHTML=state.checks.map((x,i)=>`<label class="check-item"><input type="checkbox" data-check="${i}" ${x[1]?'checked':''}>${escapeHtml(x[0])}</label>`).join('');
  const done=state.checks.filter(x=>x[1]).length; $('#progressText').textContent=`${done} / ${state.checks.length} 완료`; $('#progressBar').style.width=`${done/state.checks.length*100}%`;
}
document.addEventListener('click',e=>{
  const date=e.target.closest('[data-date]'); if(date){state.selected=date.dataset.date;save();render();return}
  const open=e.target.closest('[data-open]'); if(open){const type=open.dataset.open;$('#entryType').value=type;$('#dialogTitle').textContent=type==='schedule'?'일정 추가':'예약 추가';$('#timeField').hidden=type!=='schedule';$('#codeField').hidden=type!=='booking';$('#entryForm').reset();$('#entryType').value=type;$('#entryTime').value='10:00';$('#entryDialog').showModal();return}
  const ds=e.target.closest('[data-delete-schedule]'); if(ds){state.schedules[state.selected].splice(+ds.dataset.deleteSchedule,1);save();render();return}
  const db=e.target.closest('[data-delete-booking]'); if(db){state.bookings[state.selected].splice(+db.dataset.deleteBooking,1);save();render();return}
  const jump=e.target.closest('[data-jump]'); if(jump)document.getElementById(jump.dataset.jump).scrollIntoView({behavior:'smooth',block:'center'});
});
document.addEventListener('change',e=>{if(e.target.matches('[data-check]')){state.checks[+e.target.dataset.check][1]=e.target.checked;save();render()}});
$('#closeDialog').onclick=()=>$('#entryDialog').close();
$('#entryForm').onsubmit=e=>{e.preventDefault();const type=$('#entryType').value,title=$('#entryTitle').value.trim(),detail=$('#entryDetail').value.trim();if(!title)return;if(type==='schedule'){(state.schedules[state.selected]??=[]).push([$('#entryTime').value,title,detail]);state.schedules[state.selected].sort((a,b)=>a[0].localeCompare(b[0]));}else{(state.bookings[state.selected]??=[]).push(['🎫',title,detail,$('#entryCode').value||'확인 필요']);}save();render();$('#entryDialog').close();toast('저장했습니다');};
$('#copyAddress').onclick=async()=>{const text=`${$('#copyAddress').dataset.name||''}\n${$('#copyAddress').dataset.address||''}`;await navigator.clipboard?.writeText(text);toast('현재 숙소 주소를 복사했습니다')};
$('#resetBtn').onclick=()=>{if(confirm('입력한 내용을 지우고 샘플로 초기화할까요?')){state=structuredClone(seed);save();render();toast('초기화했습니다')}};
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
render();
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
