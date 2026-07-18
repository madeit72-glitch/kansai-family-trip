const seed = {
  selected: '2026-08-05',
  days: [
    ['2026-08-03','월','3','교토에 도착하는 날'],['2026-08-04','화','4','천년 고도를 만나는 날'],
    ['2026-08-05','수','5','교토의 여름을 걷는 날'],['2026-08-06','목','6','오사카로 넘어가는 날'],
    ['2026-08-07','금','7','오사카를 맛보는 날'],['2026-08-08','토','8','추억을 안고 돌아가는 날']
  ],
  schedules: {
    '2026-08-03':[['15:00','간사이 공항 도착','하루카 특급으로 교토 이동'],['18:30','교토역 저녁 식사','역 빌딩 10층 라멘 코지']],
    '2026-08-04':[['09:00','기요미즈데라','오전 일찍 산넨자카 산책'],['14:00','니시키 시장','가족 간식 투어']],
    '2026-08-05':[['08:30','후시미 이나리','천본 도리이 · 교토역에서 JR 5분'],['12:00','장어덮밥 점심','예약명: KIM · 4명'],['15:30','아라시야마 대나무숲','사가아라시야마역 하차'],['19:00','가모가와 저녁 산책','시조대교에서 만나요']],
    '2026-08-06':[['10:00','오사카 이동','신쾌속 · 약 30분'],['16:00','우메다 스카이 빌딩','공중정원 전망대']],
    '2026-08-07':[['10:30','오사카성','천수각 입장'],['18:00','도톤보리','글리코상 앞 가족사진']],
    '2026-08-08':[['09:30','체크아웃','짐과 여권 다시 확인'],['14:00','간사이 공항','출발 3시간 전 도착']]
  },
  bookings: {
    '2026-08-05':[['🍱','장어덮밥 우나기야','12:00 · 4명','UNAGI-805'],['🏨','교토 센트럴 호텔','체크인 15:00 · 조식 포함','KYO-260803']],
    '2026-08-06':[['🚆','교토 → 오사카','신쾌속 · 자유석','JR-4P'],['🏨','오사카 난바 호텔','2박 · 트윈룸 2개','OSK-260806']]
  },
  checks:[['여권 4명',true],['eSIM · 로밍',true],['상비약',false],['보조배터리',false],['교통카드',true],['우산 · 양산',false]]
};
let state = JSON.parse(localStorage.getItem('kansai-family-trip') || 'null') || structuredClone(seed);
const $ = s => document.querySelector(s);
const save = () => { localStorage.setItem('kansai-family-trip', JSON.stringify(state)); window.scheduleCloudSave?.(); };
const escapeHtml = s => String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderDates(){ $('#dateStrip').innerHTML=state.days.map(d=>`<button class="date-button ${d[0]===state.selected?'active':''}" data-date="${d[0]}"><span>${d[1]}</span><strong>${d[2]}</strong></button>`).join(''); }
function render(){
  renderDates(); const day=state.days.find(d=>d[0]===state.selected); $('#dayTitle').textContent=day[3]; $('#dayLabel').textContent=`8월 ${day[2]}일 · ${day[1]}요일`;
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
$('#copyAddress').onclick=async()=>{await navigator.clipboard?.writeText('교토역, Higashishiokoji Kamadonocho, Shimogyo Ward, Kyoto');toast('숙소 주소를 복사했습니다')};
$('#resetBtn').onclick=()=>{if(confirm('입력한 내용을 지우고 샘플로 초기화할까요?')){state=structuredClone(seed);save();render();toast('초기화했습니다')}};
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
render();
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
