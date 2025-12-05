# AuthPixel 로컬 테스트 가이드

## 1. 백엔드 서버 시작

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

백엔드 서버가 `http://localhost:8000`에서 실행됩니다.

## 2. 프론트엔드 개발 서버 시작

새 터미널에서:

```bash
npm run dev
```

Granite 개발 서버가 시작되고, Vite 서버가 `http://localhost:5173`에서 실행됩니다.

## 3. 샌드박스 앱 테스트

1. Apps in Toss 샌드박스 앱 설치
2. 스킴 주소 입력: `intoss://auth-pixel`
3. 앱 실행 및 기능 테스트

## 테스트 시나리오

### 워터마크 삽입 테스트
1. "보호하기" 탭 선택
2. 이미지 업로드
3. 워터마크 텍스트 입력 (예: "Test2024")
4. "워터마크 삽입" 버튼 클릭
5. 보호된 이미지 다운로드

### 워터마크 검증 테스트
1. "검증하기" 탭 선택
2. 워터마크가 삽입된 이미지 업로드
3. "워터마크 해독" 버튼 클릭
4. 숨겨진 메시지 확인
