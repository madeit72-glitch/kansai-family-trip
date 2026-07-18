const SUPABASE_URL='https://zxilhcbdnqkdyhbxwjbl.supabase.co';
const SUPABASE_KEY='sb_publishable_mwN_QyuOpfnxWLamJmLFrw_QArfTydT';
let familyRoomId=localStorage.getItem('kansai-room-id');
let cloudReady=false,cloudTimer=null;
const cloud=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});

function syncStatus(text,online=false){
  const el=document.querySelector('#syncStatus');
  if(!el)return;el.className=`sync-status ${online?'online':'offline'}`;el.querySelector('span').textContent=text;
}
window.scheduleCloudSave=()=>{
  if(!cloudReady)return;
  clearTimeout(cloudTimer);cloudTimer=setTimeout(pushFamilyState,500);
};
async function pushFamilyState(){
  syncStatus('가족에게 저장 중');
  const {error}=await cloud.from('trip_state').update({payload:state,updated_at:new Date().toISOString()}).eq('trip_id',familyRoomId);
  syncStatus(error?'기기에만 저장됨':'가족 공유 완료',!error);
  if(error)toast('인터넷 연결 후 다시 동기화됩니다');
}
async function startFamilySync(){
  if(!cloud){syncStatus('공유 기능 로드 실패');return}
  const {data:{session}}=await cloud.auth.getSession();
  if(!session){const {error}=await cloud.auth.signInAnonymously();if(error){syncStatus('익명 로그인 설정 필요');toast('Supabase 익명 로그인을 켜주세요');return}}
  if(!familyRoomId){document.querySelector('#joinDialog').showModal();return}
  await loadFamilyState();
}
async function loadFamilyState(){
  syncStatus('가족 일정 불러오는 중');
  const {data,error}=await cloud.from('trip_state').select('payload').eq('trip_id',familyRoomId).maybeSingle();
  if(error){familyRoomId=null;localStorage.removeItem('kansai-room-id');document.querySelector('#joinDialog').showModal();syncStatus('참여코드 확인 필요');return}
  if(data?.payload){state=data.payload;localStorage.setItem('kansai-family-trip',JSON.stringify(state));render()}
  else await cloud.from('trip_state').insert({trip_id:familyRoomId,payload:state});
  cloudReady=true;syncStatus('가족 공유 연결됨',true);
  cloud.channel(`trip-${familyRoomId}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:'trip_state',filter:`trip_id=eq.${familyRoomId}`},change=>{
    if(change.new?.payload){state=change.new.payload;localStorage.setItem('kansai-family-trip',JSON.stringify(state));render();syncStatus('가족 변경사항 반영됨',true)}
  }).subscribe();
}
document.querySelector('#joinForm').addEventListener('submit',async event=>{
  event.preventDefault();
  const button=document.querySelector('#joinButton');
  const code=document.querySelector('#familyCode').value.trim().toUpperCase();
  button.disabled=true;button.textContent='여행방 찾는 중…';document.querySelector('#joinError').textContent='';
  const {data,error}=await cloud.rpc('join_trip',{p_code:code});
  if(error||!data){document.querySelector('#joinError').textContent='참여코드를 확인해 주세요.';button.disabled=false;button.textContent='함께 여행 시작하기';return}
  familyRoomId=data;localStorage.setItem('kansai-room-id',familyRoomId);document.querySelector('#joinDialog').close();await loadFamilyState();
});
startFamilySync();
