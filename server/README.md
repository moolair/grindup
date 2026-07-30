# GrindUp GraphQL 게이트웨이

Firestore 앞에 얇게 얹은 Apollo Server. 쿼리 하나만 노출합니다.

```graphql
query {
  habits {
    id
    name
    streak
  }
}
```

## 설계

**서비스 어카운트 키를 쓰지 않습니다.** 앱이 보낸 Firebase ID 토큰을 그대로
Firestore REST API 에 물려주는 패스스루입니다.

```
RN 앱 ──Authorization: Bearer <ID 토큰>──▶ Apollo Server
                                              │ 같은 토큰 그대로 전달
                                              ▼
                                    Firestore REST v1
                                    (보안 규칙이 실제 사용자 권한으로 적용)
```

결과적으로:

- 레포에 새 크레덴셜을 추가할 필요가 없습니다.
- 게이트웨이는 권한을 승격시키지 못합니다. `src/auth.ts` 는 ID 토큰의 서명을
  검증하지 않고 uid 만 꺼내 문서 경로를 만드는데, uid 를 위조해도 Firestore 가
  같은 토큰을 검증하면서 거부합니다.
- 게이트웨이가 자체 판단으로 인가를 하게 되는 순간(예: 관리자 전용 필드)
  `firebase-admin` 의 `verifyIdToken` 을 도입해야 합니다.

## 읽는 데이터

| GraphQL 필드 | 출처 |
|---|---|
| `habits[].id` | `habits/{uid}/items/{habitId}` 문서 ID (= 앱의 `Routine.id`) |
| `habits[].name` | 같은 문서의 `name` |
| `habits[].streak` | 같은 문서의 `currentStreak`, 없으면 `userStats/{uid}.currentStreak` 로 폴백 |

`habits/{uid}/items` 는 앱의 `src/services/habitSync.ts` 가 채웁니다. 루틴 정의의
원본은 여전히 기기의 AsyncStorage 이고, Firestore 쪽은 서버가 읽을 수 있게 만든
읽기용 사본입니다.

`streak` 은 현재 사용자 단위 값입니다 — GrindUp 은 루틴별 완료 이력을 저장하지
않기 때문입니다. 루틴별 스트릭을 도입하면 habit 문서에 `currentStreak` 를 쓰면
되고, 리졸버는 그대로 둬도 자동으로 그 값을 우선합니다.

## 실행

```bash
cd server && npm install
```

`server/.env` 에 Firebase 프로젝트 ID 를 넣습니다 (gitignore 대상). 값은 iOS의
`ios/GrindUp/GoogleService-Info.plist` 또는 Android의
`android/app/google-services.json` 의 `PROJECT_ID` 와 같아야 합니다.

```
FIREBASE_PROJECT_ID=<프로젝트 ID>
PORT=4000
```

```bash
cd server && npm run dev    # tsx watch, 파일 변경 시 재시작
cd server && npm start      # 1회 실행
```

기본 포트 4000, `0.0.0.0` 에 바인딩합니다. iOS 시뮬레이터는
`http://localhost:4000/`, Android 에뮬레이터는 `http://10.0.2.2:4000/` 로
접근합니다 (앱 쪽 `src/graphql/client.ts` 가 플랫폼별로 알아서 고릅니다).
실기기로 테스트하려면 그 파일의 `GRAPHQL_HOST` 를 맥의 LAN IP 로 바꾸세요.

## 확인

토큰 없이 던지면 401 이 나와야 정상입니다.

```bash
curl -s http://localhost:4000/ -H 'Content-Type: application/json' \
  -d '{"query":"{ habits { id name streak } }"}'
```

실제 데이터를 curl 로 보려면 앱에서 `auth().currentUser.getIdToken()` 값을
꺼내 헤더에 넣으면 됩니다.

```bash
curl -s http://localhost:4000/ -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $ID_TOKEN" \
  -d '{"query":"{ habits { id name streak } }"}'
```

## 주의

- `npm run typecheck` 는 이 디렉터리 자체 tsconfig 를 씁니다. 앱 루트의
  `npx tsc --noEmit` 에는 포함되지 않습니다 (별도 패키지).
- 이 디렉터리는 앱 번들에 들어가지 않습니다. RN 코드에서 `server/` 를 import
  하지 마세요.
