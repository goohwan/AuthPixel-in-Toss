# Vercel Backend Deployment Guide

## Vercel에 백엔드 배포하기

### 1. Vercel CLI 설치 (선택사항)

```bash
npm install -g vercel
```

### 2. Vercel 계정 생성
[Vercel](https://vercel.com)에서 계정을 생성하세요.

### 3. 백엔드 배포

#### 방법 1: Vercel CLI 사용

```bash
# 프로젝트 루트에서
vercel

# 배포 완료 후 production 배포
vercel --prod
```

#### 방법 2: GitHub 연동 (추천)

1. GitHub에 프로젝트 push
2. Vercel 대시보드에서 "New Project" 클릭
3. GitHub 저장소 선택
4. Root Directory를 프로젝트 루트로 설정
5. Deploy 클릭

### 4. 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정할 수 있습니다:
- 프로젝트 설정 > Environment Variables
- 필요한 경우 추가 환경 변수 설정

### 5. 배포 URL 확인

배포가 완료되면 Vercel에서 제공하는 URL을 받게 됩니다:
- 예: `https://your-project.vercel.app`

### 6. 프론트엔드 환경 변수 업데이트

배포된 백엔드 URL로 `.env` 파일을 업데이트하세요:

```bash
VITE_API_BASE_URL=https://auth-pixel-in-toss.vercel.app/
```

## 주의사항

### Vercel Serverless Functions 제한사항
- 최대 실행 시간: 10초 (Hobby), 60초 (Pro)
- 최대 페이로드 크기: 4.5MB
- 이미지 크기가 큰 경우 제한에 걸릴 수 있음

### 대안 (큰 이미지 처리가 필요한 경우)
- Railway: 컨테이너 기반, 더 큰 파일 처리 가능
- Render: 무료 티어 제공, 컨테이너 기반
- 별도 서버: AWS EC2, DigitalOcean 등

## 테스트

배포 후 API 엔드포인트 테스트:

```bash
# 상태 확인
curl https://auth-pixel-in-toss.vercel.app/

# 워터마크 삽입 테스트
curl -X POST https://auth-pixel-in-toss.vercel.app/api/embed \
  -F "image=@test.jpg" \
  -F "text=TestWatermark"
```
