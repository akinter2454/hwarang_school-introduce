Firebase 학생-교사 실시간 공유 수정본

확인된 문제
1. 기존 앱은 학생이 [제출]을 누르면 Firebase 저장 완료를 기다리지 않고 화면에 먼저 성공으로 표시했습니다.
   따라서 Firebase 저장이 실패해도 학생에게는 제출 성공처럼 보일 수 있었습니다.

2. 초기 Firebase 연결 과정에서 /spaces 또는 /comments 부모 노드 전체에 set()을 시도했습니다.
   현재 Realtime Database 규칙은 /spaces/$spaceId, /comments/$commentId 단위로 쓰기를 허용하므로
   부모 노드 전체 쓰기가 권한 거부되면 실시간 구독 자체가 시작되지 않을 수 있었습니다.
   이 경우 교사 PC가 학생 제출물을 실시간으로 받지 못합니다.

수정 내용
- 기본 예시 데이터는 각 공간/댓글의 자식 경로에 개별 저장합니다.
- 학생 제출은 Firebase 저장 성공을 실제로 확인한 뒤에만 '성공적으로 등록' 메시지를 표시합니다.
- Firebase 연결 실패 시 한 세션에 한 번 사용자에게 알림을 표시합니다.
- 교사 승인/수정요청/삭제도 Firebase 저장 성공 후 화면을 변경합니다.
- 기존 디자인, 작성 양식, 캐릭터, 5층 기능은 변경하지 않았습니다.

Firebase Console 확인
A. Authentication > Sign-in method > Anonymous(익명) = 사용 설정
B. Realtime Database > Rules = 프로젝트의 database.rules.json 내용으로 게시
C. Realtime Database > Data에서 학생 제출 후
   spaces > space-... 항목이 실제로 생성되는지 확인

배포 후 테스트
1. GitHub main에 이 전체 소스를 업로드/교체합니다.
2. GitHub Actions 배포가 성공할 때까지 기다립니다.
3. 학생 태블릿과 교사 PC 모두 브라우저를 완전히 새로고침합니다.
   - PC: Ctrl+Shift+R
   - 태블릿: 탭을 닫고 다시 열거나 브라우저 캐시를 새로고침
4. 학생 태블릿에서 테스트 글 1개 제출
5. Firebase Console > Realtime Database > Data > spaces에 즉시 생성되는지 확인
6. 교사 PC의 선생님 확인방 > 검토 대기 목록에서 확인

중요
- 기존 버전에서 학생 화면에만 보였던 글은 Firebase에 실제 저장되지 않았을 수 있습니다.
- 해당 학생 태블릿에서 아직 페이지를 새로고침하지 않았다면 글 내용을 먼저 복사/기록해 두는 것이 안전합니다.
