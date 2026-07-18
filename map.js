const ROUTE_COLORS={'2026-08-03':'#e86f51','2026-08-04':'#d9a400','2026-08-05':'#b33b28','2026-08-06':'#2d6a5e','2026-08-07':'#6750a4','2026-08-08':'#2e6ca4'};
const ROUTES={
  '2026-08-03':[
    ['간사이공항 T1','09:55 도착',34.4347,135.2440],['교토역','13:00 도착 예정',34.9858,135.7588],['게이오 프렐리아 호텔','짐 보관',34.9993,135.7594],['교토 시내·다이마루','관광·저녁',35.0037,135.7618],['돈키호테 시조도리','쇼핑',35.0034,135.7684]
  ],
  '2026-08-04':[
    ['아라시야마','교토 서부 관광',35.0094,135.6668],['치쿠린 대나무숲','산책',35.0170,135.6713],['가모강·시조','저녁 산책',35.0038,135.7702],['시조 일대','쇼핑·식사',35.0038,135.7630]
  ],
  '2026-08-05':[
    ['게이오 프렐리아 호텔','오전 출발',34.9993,135.7594],['기요미즈데라','오전 관광',34.9949,135.7850],['교토역','오사카 이동',34.9858,135.7588],['센타라 라이프 난바','오사카 숙소',34.6562,135.5015],['도톤보리','저녁 관광',34.6687,135.5013]
  ],
  '2026-08-06':[
    ['센타라 라이프 난바','출발',34.6562,135.5015],['오사카성','주요 관광',34.6873,135.5262],['하루카스 300','야경 후보',34.6464,135.5133],['우메다 공중정원','야경 후보',34.7053,135.4902],['도톤보리','저녁',34.6687,135.5013]
  ],
  '2026-08-07':[
    ['센타라 라이프 난바','출발',34.6562,135.5015],['한큐 우메다','백화점 쇼핑',34.7030,135.4980],['우메다 일대','쇼핑',34.7025,135.4959],['도톤보리','저녁',34.6687,135.5013]
  ],
  '2026-08-08':[
    ['센타라 라이프 난바','체크아웃',34.6562,135.5015],['난바','마지막 쇼핑',34.6635,135.5019],['간사이공항 T1','출국·면세점',34.4347,135.2440]
  ]
};
const PLACE_COORDS=[
  [['김해공항','김해국제공항'],35.1795,128.9382,'김해국제공항'],
  [['간사이공항','kix'],34.4347,135.2440,'간사이공항 T1'],
  [['교토역'],34.9858,135.7588,'교토역'],
  [['게이오 프렐리아','keio prelia'],34.9993,135.7594,'게이오 프렐리아 호텔'],
  [['아라시야마'],35.0094,135.6668,'아라시야마'],
  [['치쿠린','대나무숲'],35.0170,135.6713,'치쿠린 대나무숲'],
  [['가모강','가모가와'],35.0038,135.7702,'가모강'],
  [['시조'],35.0038,135.7630,'시조 일대'],
  [['다이마루 교토','다이마루 쿄토'],35.0040,135.7618,'다이마루 교토점'],
  [['돈키호테 시조'],35.0034,135.7684,'돈키호테 시조도리'],
  [['기요미즈','청수사'],34.9949,135.7850,'기요미즈데라'],
  [['센타라 라이프','centara life'],34.6562,135.5015,'센타라 라이프 난바'],
  [['난바'],34.6635,135.5019,'난바'],
  [['도톤보리'],34.6687,135.5013,'도톤보리'],
  [['오사카성'],34.6873,135.5262,'오사카성'],
  [['하루카스'],34.6464,135.5133,'하루카스 300'],
  [['우메다 공중정원','스카이 빌딩'],34.7053,135.4902,'우메다 공중정원'],
  [['한큐','우메다'],34.7030,135.4980,'우메다 일대']
];
let routeMap,routeLayer;
const googleSearchUrl=point=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${point[2]},${point[3]}`)}`;
const googleDirectionsUrl=point=>`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${point[2]},${point[3]}`)}&travelmode=transit`;
const googleDayRouteUrl=points=>{
  if(points.length<2)return points.length?googleDirectionsUrl(points[0]):'#';
  const start=points[0],end=points[points.length-1],middle=points.slice(1,-1).map(point=>`${point[2]},${point[3]}`).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${start[2]},${start[3]}`)}&destination=${encodeURIComponent(`${end[2]},${end[3]}`)}${middle?`&waypoints=${encodeURIComponent(middle)}`:''}&travelmode=transit`;
};
window.renderRouteMap=function(date){
  if(!window.L||!document.querySelector('#routeMap'))return;
  if(!routeMap){routeMap=L.map('routeMap',{zoomControl:true,scrollWheelZoom:false});L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:20,attribution:'© OpenStreetMap contributors © CARTO'}).addTo(routeMap)}
  if(routeLayer)routeLayer.remove();routeLayer=L.layerGroup().addTo(routeMap);
  const custom=state?.routePoints?.[date]||[],points=[...(ROUTES[date]||[]),...custom],color=ROUTE_COLORS[date]||'#e86f51',latlngs=[];
  points.forEach((p,index)=>{const latlng=[p[2],p[3]];latlngs.push(latlng);const icon=L.divIcon({className:'',html:`<div class="route-marker" style="background:${color}"><span>${index+1}</span></div>`,iconSize:[30,30],iconAnchor:[15,28]});L.marker(latlng,{icon}).bindTooltip(`${index+1}. ${p[0]}`,{permanent:true,direction:'top',offset:[0,-28],className:'route-korean-label'}).bindPopup(`<strong>${index+1}. ${p[0]}</strong><br>${p[1]}<div class="map-popup-actions"><a href="${googleSearchUrl(p)}" target="_blank" rel="noopener">지도에서 보기</a><a href="${googleDirectionsUrl(p)}" target="_blank" rel="noopener">현재 위치에서 길찾기</a></div>`).addTo(routeLayer)});
  if(latlngs.length>1)L.polyline(latlngs,{color,weight:5,opacity:.85,lineJoin:'round',dashArray:'12 7'}).addTo(routeLayer);
  if(latlngs.length)routeMap.fitBounds(L.latLngBounds(latlngs).pad(.16),{maxZoom:14});
  document.querySelector('#routeLegend').innerHTML=`<a class="day-route-button" href="${googleDayRouteUrl(points)}" target="_blank" rel="noopener">오늘 전체 동선 구글 지도에서 보기</a>`+points.map((p,i)=>`<div class="route-stop"><b style="background:${color}">${i+1}</b><span>${p[0]}<small>${p[1]}</small><span class="route-links"><a href="${googleSearchUrl(p)}" target="_blank" rel="noopener">지도 보기</a><a href="${googleDirectionsUrl(p)}" target="_blank" rel="noopener">길찾기</a></span></span></div>`).join('');
  setTimeout(()=>routeMap.invalidateSize(),50);
};
window.addSchedulePoint=function(date,title,place,time,detail){
  if(!place)return;
  const query=place.toLowerCase().replace(/\s+/g,'');
  const match=PLACE_COORDS.find(entry=>entry[0].some(keyword=>query.includes(keyword.toLowerCase().replace(/\s+/g,''))));
  if(!match){toast('일정은 저장됐습니다. 지도 위치는 장소명을 더 정확히 입력해 주세요');return}
  state.routePoints??={};state.routePoints[date]??=[];
  state.routePoints[date]=state.routePoints[date].filter(point=>!(point[0]===title&&point[1].startsWith(time)));
  state.routePoints[date].push([title,`${time} · ${match[3]}${detail?` · ${detail}`:''}`,match[1],match[2]]);
  save();window.renderRouteMap(date);toast('일정과 지도 동선을 함께 업데이트했습니다');
};
window.removeSchedulePoint=function(date,title,time){
  if(!state.routePoints?.[date])return;
  state.routePoints[date]=state.routePoints[date].filter(point=>!(point[0]===title&&point[1].startsWith(time)));
};
