[5층 확장 완료본]

이 프로젝트는 기존 디자인과 기능을 유지하면서 학교 공간 탐험 범위를 1~5층으로 확장한 전체 소스입니다.

주요 변경
- FloorNumber: 1~5층 지원
- 내가 직접 소개하기: 5층 선택 버튼 추가
- 5층 추천 예시 서식 추가(특정 시설명 고정 없음)
- 층별 엘리베이터: 5층 카드 추가
- 5층 상세 공간/필터/방명록 지원
- 방문 스탬프/탐험 진행도/명예 박사 조건: 5개 층 기준
- 캐릭터 훈장 조건: 5개 층 기준
- 인증서: 1~5층 기준
- 브라우저 저장 데이터 검증: 5층 허용
- Realtime Database 규칙: floor 1~5 허용
- Realtime Database 사진 규칙의 잘못된 numChildren() 사용 제거

중요: Firebase Realtime Database 규칙은 GitHub Pages 배포만으로 자동 적용되지 않습니다.
Firebase Console > Realtime Database > 규칙에서 이 프로젝트의 database.rules.json 내용을 붙여넣고 '게시'해 주세요.
그렇지 않으면 기존 규칙이 floor <= 4인 경우 5층 글 저장이 거부될 수 있습니다.

검증
- 전체 src/*.ts, src/*.tsx TypeScript/TSX 구문 파싱 검증 완료
- database.rules.json / firebase.json / metadata.json JSON 구문 검증 완료
- 프로젝트 내 4층 한정 카운트/완료 조건을 5층 기준으로 점검 완료
