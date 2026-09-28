[학생 제출은 Firebase에 저장되는데 교사 PC 승인 목록에 안 뜨는 문제 수정]

원인
- 기존 src/services/firebaseData.ts가 DB가 비어 있을 때 /spaces 또는 /comments 부모 경로에 한 번에 set()하려고 했습니다.
- 현재 Realtime Database 규칙은 /spaces/$spaceId 및 /comments/$commentId 단위로 쓰기를 허용하므로, 특히 comments가 비어 있으면 초기화 단계에서 Permission denied가 발생할 수 있습니다.
- App.tsx는 이 초기화가 끝난 뒤에야 onValue 실시간 구독을 시작했기 때문에, 초기화 실패 시 교사 PC는 Firebase 데이터를 실시간으로 읽지 못하고 로컬 기본 데이터만 보여줄 수 있었습니다.

수정
1) firebaseData.ts: 초기 데이터를 자식 항목별로 개별 저장
2) App.tsx: Firebase 인증 후 실시간 구독을 먼저 시작하고, 초기 데이터 seed는 그 뒤에 별도로 시도
3) seed가 실패해도 실시간 구독은 계속 유지
4) 디자인/메뉴/5층/Firebase 데이터 구조는 변경 없음

적용할 파일 2개
- src/App.tsx
- src/services/firebaseData.ts

적용 후
1. GitHub의 위 두 파일을 이 ZIP의 파일로 교체
2. Commit changes
3. GitHub Actions 배포 완료 확인
4. 교사 PC에서 Ctrl+Shift+R
5. 학생 태블릿도 페이지를 닫았다가 다시 열기
6. Firebase Console > Realtime Database > Data > spaces에서 학생 글 status가 pending인지 확인
7. 교사 PC > 선생님 확인방 > 검토 대기 목록 확인

Firebase Rules는 기존 5층용 database.rules.json을 그대로 사용해도 됩니다.
