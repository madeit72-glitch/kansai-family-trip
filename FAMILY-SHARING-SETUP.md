# 가족 공유 설정

## 1. Supabase SQL 실행

1. Supabase 프로젝트 왼쪽 `SQL Editor`를 누릅니다.
2. `New query`를 누릅니다.
3. `supabase-setup.sql` 파일 전체를 복사해 붙여넣습니다.
4. 오른쪽 아래 `Run`을 누릅니다.
5. `Success. No rows returned`가 표시되면 완료입니다.

## 2. 익명 로그인 활성화

`Authentication` → `Sign In / Providers` → `Anonymous Sign-Ins`를 켭니다.

## 3. GitHub 파일 교체

GitHub 저장소에서 `Add file` → `Upload files`를 누르고 다음 파일을 업로드합니다.

- index.html
- styles.css
- app.js
- sync.js
- sw.js
- manifest.webmanifest

같은 이름 파일은 교체되며 `Commit changes`를 누르면 Pages가 다시 배포됩니다.

## 4. 가족 입장

각 가족 휴대폰에서 앱을 새로 열고 참여코드 `KANSAI26`을 입력합니다. 상단에 `가족 공유 연결됨`이 표시되면 완료입니다.
