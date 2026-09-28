Realtime Database 패치 적용 파일입니다.

가장 먼저 REALTIME-DATABASE-SETUP.md를 읽어주세요.

핵심:
1. Realtime Database를 잠금 모드로 생성
2. Authentication > Anonymous 활성화
3. src/firebaseConfig.ts에 Firebase 웹 설정값 붙여넣기
4. Realtime Database > Rules에 database.rules.json 붙여넣기
5. 패치 파일을 GitHub 저장소에 경로 그대로 덮어쓰기
6. GitHub Actions 배포 확인

기존 디자인/UI는 변경하지 않고 데이터 저장 방식만 Realtime Database로 전환합니다.
