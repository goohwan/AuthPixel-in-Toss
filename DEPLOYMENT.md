# AuthPixel - Apps in Toss 배포 가이드

## 개요
AuthPixel을 Apps in Toss 플랫폼에 배포하는 전체 가이드입니다.

## 아키텍처
- **프론트엔드**: Granite 프레임워크 기반 React 앱 (Apps in Toss에 직접 배포)
- **백엔드**: FastAPI (Vercel Serverless Functions에 배포)

## 1단계: 백엔드 배포 (Vercel)

### Vercel 계정 및 프로젝트 설정
1. [Vercel](https://vercel.com)에서 계정 생성
2. GitHub에 프로젝트 push (백엔드만 별도 저장소로 분리하는 것도 고려)

### Vercel에 배포

#### 방법 1: Vercel CLI (추천)
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 루트에서 로그인
vercel login

# 배포 (테스트)
vercel

# 프로덕션 배포
vercel --prod
```

#### 방법 2: GitHub 연동
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. Root Directory를 프로젝트 루트로 설정
4. "Deploy" 클릭

### 배포 후 URL 확인
배포 완료 후 제공되는 URL을 복사하세요:
- 예: `https://authpixel-backend.vercel.app`

## 2단계: 프론트엔드 환경 변수 설정

### .env 파일 업데이트
```bash
# .env 파일에 배포된 백엔드 URL 추가
VITE_API_BASE_URL=https://authpixel-backend.vercel.app
```

## 3단계: 프론트엔드 빌드

```bash
# 의존성 설치 확인
npm install

# Granite 빌드 (Apps in Toss 배포 파일 생성)
npm run build
```

빌드가 완료되면 `.ait` 파일이 생성됩니다.

## 4단계: Apps in Toss 콘솔 업로드

### 콘솔 접속
1. [Apps in Toss 개발자 콘솔](https://console.apps-in-toss.im) 접속
2. 로그인 및 워크스페이스 선택

### 미니앱 등록/업데이트
1. "미니앱 관리" 메뉴 선택
2. 기존 앱이 있다면 선택, 없다면 "새 미니앱 등록"
3. 앱 정보 입력:
   - 앱 이름: `auth-pixel` (granite.config.ts의 appName과 동일)
   - 표시 이름: AuthPixel
   - 카테고리: 도구
   - 설명: 보이지 않는 워터마크를 삽입해서 이미지 자산을 보호하세요

### 버전 업로드
1. "출시하기" > "새 버전 업로드"
2. 생성된 `.ait` 파일 업로드
3. 버전 정보 입력 (예: 1.0.0)
4. 변경사항 기록

## 5단계: 테스트

### QR 코드 테스트
1. 콘솔에서 "테스트" > "QR 코드 생성"
2. 토스 앱에서 QR 코드 스캔
3. 앱 실행 및 기능 테스트

### 샌드박스 앱 테스트
```bash
# 로컬 개발 서버 실행
npm run dev

# 샌드박스 앱에서 실행
intoss://auth-pixel
```

## 6단계: 검수 및 출시

### 검수 체크리스트
- [ ] 브릿지 뷰 정상 작동
- [ ] 내비게이션 바 설정
- [ ] 기능 정상 작동 (워터마크 삽입/검증)
- [ ] 에러 핸들링
- [ ] 다크 모드 확인
- [ ] UX 라이팅 가이드 준수

### 검수 요청
1. 콘솔에서 "출시하기" > "검수 요청"
2. 검수 담당자가 확인
3. 피드백 대응

### 출시
검수 통과 후 "출시" 버튼 클릭

## 트러블슈팅

### 백엔드 CORS 에러
- `backend/main.py`의 `allow_origins`에 Apps in Toss 도메인 추가

### 이미지 업로드 실패
- Vercel Serverless Functions는 4.5MB 제한이 있음
- 큰 이미지 처리 시 Railway나 별도 서버 고려

### 빌드 실패
```bash
# 캐시 삭제
rm -rf node_modules .granite dist
npm install
npm run build
```

## 참고 문서
- [Apps in Toss 개발자 가이드](https://developers-apps-in-toss.toss.im/)
- [Vercel 배포 가이드](./VERCEL_DEPLOY.md)
- [로컬 테스트 가이드](./LOCAL_TEST.md)
