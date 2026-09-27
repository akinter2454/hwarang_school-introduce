[적용 목적]
- 기존 디자인/기능은 정상 상태에서 그대로 유지
- 과거 localStorage 데이터 때문에 하얀 화면이 되는 문제 예방
- 잘못된 저장 데이터 자동 정리/마이그레이션
- React 오류 발생 시 학생이 복구할 수 있는 오류 화면 제공
- Firebase 연결을 위한 모듈/보안 규칙/환경 변수 준비

[GitHub 저장소에 추가/교체할 파일]
교체:
- src/main.tsx
- package.json
- .env.example

추가:
- src/components/AppErrorBoundary.tsx
- src/utils/persistence.ts
- src/lib/firebase.ts
- src/services/firebaseData.ts
- firebase.json
- firebase/firestore.rules
- firebase/storage.rules
- FIREBASE-SETUP.md

[적용 후]
1. package.json 변경 때문에 GitHub Actions의 npm install에서 firebase 패키지가 자동 설치됩니다.
2. main.tsx가 React 렌더링 전에 기존 localStorage를 검사/복구합니다.
3. 정상 사용자 화면에는 디자인 변경이 없습니다.
4. 심각한 오류가 발생할 때만 복구 화면이 나타납니다.
5. Firebase는 아직 자동 활성화되지 않습니다. 설정값을 넣고 실제 데이터 전환 작업을 하기 전까지 기존 localStorage 동작을 유지합니다.

[중요]
Firebase 연결 후에는 현재 선생님 PIN 7777을 서버 권한으로 사용하면 안 됩니다.
교사 승인 권한은 Firebase Authentication의 교사 계정 + teacher custom claim으로 보호해야 합니다.
