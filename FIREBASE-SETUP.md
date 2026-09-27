# Firebase 연결 준비 안내

이 패치는 현재 디자인과 기존 기능을 바꾸지 않습니다.
기본 저장 방식은 그대로 localStorage이며, Firebase 연결용 모듈과 보안 규칙만 미리 추가합니다.

## 1. Firebase 프로젝트 만들기

1. Firebase Console에서 새 프로젝트를 만듭니다.
2. Web App(</>)을 추가합니다.
3. Authentication > Sign-in method에서 Anonymous(익명)를 활성화합니다.
4. Firestore Database를 생성합니다.
5. Storage를 활성화합니다.

학생은 별도 로그인 화면 없이 익명 인증을 사용하도록 준비되어 있습니다.
익명 인증이어도 Firebase에서는 각 브라우저에 고유 UID가 생기므로, 학생이 자기 제출물만 수정하도록 Security Rules를 적용할 수 있습니다.

## 2. 환경 변수 입력

Firebase Web App 설정에서 아래 값을 복사합니다.

- apiKey -> VITE_FIREBASE_API_KEY
- authDomain -> VITE_FIREBASE_AUTH_DOMAIN
- projectId -> VITE_FIREBASE_PROJECT_ID
- storageBucket -> VITE_FIREBASE_STORAGE_BUCKET
- messagingSenderId -> VITE_FIREBASE_MESSAGING_SENDER_ID
- appId -> VITE_FIREBASE_APP_ID
- measurementId -> VITE_FIREBASE_MEASUREMENT_ID (선택)

로컬 개발에서는 `.env.local`에 넣고, `.env.local`은 GitHub에 커밋하지 않습니다.

주의: Firebase Web API key 자체는 서버 비밀번호가 아닙니다. 실제 데이터 보호는 Firestore/Storage Security Rules가 담당합니다.

## 3. GitHub Pages에서 환경 변수 사용

현재 GitHub Actions가 `npm run build`를 실행하므로, Firebase를 실제로 켤 때는 GitHub Repository > Settings > Secrets and variables > Actions에 값을 등록하고 deploy workflow의 Build 단계에 `env:`로 전달해야 합니다.

예시:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
    VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
    VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
    VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
```

## 4. 보안 규칙

이 패치의 `firebase/firestore.rules`와 `firebase/storage.rules`는 처음부터 공개 쓰기를 허용하지 않습니다.

- 학생: 익명 인증 후 자기 제출물을 pending 상태로 제출/수정
- 학생: approved로 직접 변경 불가
- 교사: teacher custom claim이 있는 계정만 승인/반려 가능
- 이미지: 인증 사용자만 읽기, 자기 UID 폴더에만 업로드, 이미지 파일만 허용, 5MB 제한

중요: 현재 앱의 `7777` PIN은 화면 진입용 UI일 뿐, Firebase 관리자 권한으로 사용하면 안 됩니다. PIN은 브라우저 소스에서 확인할 수 있기 때문입니다. 실제 교사 승인은 Firebase Authentication + teacher custom claim으로 보호해야 합니다.

## 5. 데이터 구조 권장

### Firestore `spaces/{spaceId}`

기존 SpaceItem 필드 +

- ownerUid
- status: pending | approved | rejected
- serverCreatedAt
- serverUpdatedAt

### Firestore `comments/{commentId}`

기존 SpaceComment 필드 +

- authorUid
- serverCreatedAt

### Storage

`spaceImages/{uid}/{spaceId}/{filename}.jpg`

사진 URL만 Firestore `images` 배열에 저장합니다. Base64 사진 자체를 Firestore에 저장하지 않습니다.

## 6. 실제 전환 시 작업

현재는 Firebase 파일이 추가되어도 App.tsx가 기존 localStorage를 그대로 사용합니다.
따라서 사이트 디자인/기능/데이터 흐름은 바뀌지 않습니다.

Firebase 설정값을 받은 뒤 다음 단계에서만 전환합니다.

1. 앱 시작 시 익명 인증
2. 공간 목록: Firestore 실시간 구독
3. 학생 제출: 이미지 Storage 업로드 -> URL 취득 -> Firestore pending 저장
4. 교사 승인: teacher 계정만 status 변경
5. 댓글: Firestore 저장/실시간 구독
6. 캐릭터와 개인 스탬프: localStorage 유지

권장 분리:

- localStorage: 내 캐릭터, 개인 스탬프, 개인 UI 설정
- Firestore: 학생 제출글, 댓글, 승인 상태, 교사 피드백
- Storage: 학생이 올린 사진

이 방식이 여러 태블릿과 교사 PC 사이에서 데이터를 공유하기에 적합합니다.
