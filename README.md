# 우리 가족 간사이 여행

가족 누구나 오늘 일정과 예약 정보를 빠르게 확인하도록 만든 모바일 우선 PWA입니다.

## 실행

```powershell
python -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 여세요. 입력 내용은 브라우저의 localStorage에 저장됩니다.

## 다음 단계

현재 버전은 한 기기에서 바로 쓸 수 있는 MVP입니다. 가족 간 실시간 공유는 Supabase 프로젝트를 연결하고 `schedules`, `bookings`, `check_items` 테이블을 추가하는 방식으로 확장할 수 있습니다.
