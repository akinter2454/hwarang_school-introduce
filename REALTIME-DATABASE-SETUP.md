# Firebase Realtime Database 전환 패치

이 패치는 **현재 화면 디자인과 주요 기능은 그대로 유지**하면서 공유 데이터를 Firebase Realtime Database로 바꿉니다.

## 무엇이 Firebase에 저장되나요?

### Realtime Database에 저장
- 학생이 작성한 학교 공간 소개
- 학생이 올린 사진
- 승인 / 수정요청 상태
- 교사 피드백
- 공간 좋아요 수
- 댓글과 댓글 좋아요

### 각 기기의 브라우저에만 저장
- 내 캐릭터 꾸미기
- 내 방문 스탬프
- 내가 이미 누른 공간 좋아요 기록

학생 사진은 별도 Cloud Storage를 쓰지 않습니다.  
업로드 시 자동 압축한 뒤 `data:image/jpeg;base64,...` 문자열로 Realtime Database에 직접 저장합니다.

---

# 1. Firebase Console에서 Realtime Database 만들기

1. Firebase Console에서 프로젝트를 엽니다.
2. 왼쪽 **빌드 → Realtime Database**로 들어갑니다.
3. **데이터베이스 만들기**를 누릅니다.
4. 위치를 선택합니다.
5. **잠금 모드로 시작**을 선택합니다.
6. **사용 설정**을 누릅니다.

테스트 모드는 사용하지 않는 것을 권장합니다.

---

# 2. 익명 로그인 켜기

1. **빌드 → Authentication**
2. **시작하기**
3. **Sign-in method / 로그인 방법**
4. **익명(Anonymous)**
5. **사용 설정 → 저장**

학생 화면에 별도 로그인 창이 생기지는 않습니다.  
앱이 뒤에서 자동으로 익명 UID를 받습니다.

---

# 3. 웹 앱 설정값 가져오기

1. Firebase Console 왼쪽 위 톱니바퀴
2. **프로젝트 설정**
3. **일반**
4. 아래쪽 **내 앱**
5. 웹 앱이 없다면 `</>` 버튼으로 웹 앱을 만듭니다.
6. `firebaseConfig`가 표시됩니다.

예:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "https://프로젝트이름-default-rtdb....firebasedatabase.app",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

`databaseURL`이 반드시 있어야 합니다.

---

# 4. GitHub에서 설정값 붙여넣기

패치에 포함된:

`src/firebaseConfig.ts`

파일을 엽니다.

빈 문자열 부분을 Firebase Console의 값으로 바꿉니다.

```ts
export const firebaseWebConfig = {
  apiKey: '여기에',
  authDomain: '여기에',
  databaseURL: '여기에',
  projectId: '여기에',
  storageBucket: '여기에',
  messagingSenderId: '여기에',
  appId: '여기에',
};
```

Firebase 웹 설정값은 브라우저 앱에서 사용되는 공개 설정입니다.  
**서비스 계정 private key / Admin SDK JSON 파일은 절대 넣지 마세요.**

---

# 5. Realtime Database 보안 규칙 붙여넣기

Firebase Console:

**Realtime Database → 규칙(Rules)**

로 이동합니다.

현재 내용을 모두 지우고 패치의:

`database.rules.json`

내용을 그대로 붙여넣은 뒤 **게시**합니다.

이 규칙은:
- 익명 Firebase 인증을 받은 앱 사용자만 읽기/쓰기 가능
- 사진은 한 공간당 최대 10개
- 사진 문자열 1개가 지나치게 커지지 않도록 제한
- 기본 데이터 형식 검사

를 수행합니다.

---

# 6. GitHub에 패치 파일 적용

압축파일 안의 경로를 그대로 저장소에 덮어씁니다.

교체:
- `src/App.tsx`
- `src/lib/firebase.ts`
- `src/services/firebaseData.ts`
- `src/utils/imageUtils.ts`
- `.env.example`
- `firebase.json`

추가:
- `src/firebaseConfig.ts`
- `database.rules.json`

기존의:
- `firebase/firestore.rules`
- `firebase/storage.rules`

파일은 남아 있어도 실제 앱에서는 더 이상 사용하지 않습니다.

---

# 7. GitHub Pages 다시 배포

main 브랜치에 커밋하면 기존 GitHub Actions가 자동 실행됩니다.

Actions에서:

- Install dependencies ✅
- Build ✅
- Upload artifact ✅
- Deploy ✅

인지 확인합니다.

---

# 8. 정상 동작 확인

## 학생 기기 A
1. 사이트 접속
2. 캐릭터 꾸미기
3. 공간 소개글 작성
4. 사진 등록
5. 제출

## 교사 기기 B
1. 같은 사이트 접속
2. 선생님 확인방
3. 제출 글이 보이는지 확인
4. 승인

## 학생 기기 C
1. 같은 사이트 접속
2. 승인된 공간이 보이는지 확인

A/B/C가 서로 다른 브라우저여도 같은 DB 데이터를 보게 됩니다.

---

# 9. 사진 저장 방식과 무료 사용량

이 버전은 사진을 JPEG로 강하게 압축해 Realtime Database에 Base64 문자열로 넣습니다.

기본 목표:
- 최대 약 900×675
- 사진 1장 약 180KB 이하의 data URL을 목표
- DB 규칙상 한 공간 최대 10장

작은 학급 활동에는 단순하고 편한 방식입니다.

다만 사진이 많아질수록 Realtime Database의 **다운로드 사용량**이 빨리 늘어납니다.
학교 전체 장기 운영으로 커지면 나중에는 이미지 전용 저장소로 분리하는 편이 효율적입니다.

---

# 10. 중요한 보안 메모

현재 앱의 `선생님 확인방` 비밀번호 `7777`은 기존 디자인과 기능을 바꾸지 않기 위해 그대로 유지합니다.

하지만 이 PIN은 프론트엔드 코드 안에 있으므로 **강한 서버 관리자 인증이 아닙니다.**

이번 규칙은 `auth != null`인 앱 사용자에게 공유 데이터 쓰기를 허용합니다.
따라서 일반 학생이 정상 UI만 사용하는 교실 활동에는 편하지만,
개발자 도구/API를 고의로 사용하는 사람까지 막는 구조는 아닙니다.

실제 학교-wide 장기 운영 전에 원하시면 다음 단계에서:
- 교사 전용 Firebase 계정
- 교사 UID 기반 승인 권한
- 학생은 자기 제출물만 수정
- 교사만 승인/반려/삭제

구조로 강화할 수 있습니다.

---

# 11. 문제가 생겼을 때

### 사이트는 열리는데 공유가 안 됨
`src/firebaseConfig.ts`의 `databaseURL`을 확인하세요.

### Permission denied
- Authentication의 익명 로그인이 켜졌는지
- Realtime Database Rules를 게시했는지 확인하세요.

### 사진 저장 실패
사진이 너무 많거나 너무 큰 경우일 수 있습니다.
이 패치는 자동 압축하지만, 한 공간당 2~5장 정도를 권장합니다.

### 예전 브라우저 데이터 때문에 이상함
기존 ErrorBoundary의 **저장 데이터 초기화** 기능은 그대로 사용할 수 있습니다.
