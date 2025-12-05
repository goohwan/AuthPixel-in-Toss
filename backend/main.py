from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from watermark_utils import WatermarkEmbedder, WatermarkDecoder
import numpy as np
from PIL import Image
import io

app = FastAPI(title="AuthPixel API", version="1.0.0")

# CORS 설정 - Vercel 배포용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # 로컬 개발
        "https://*.vercel.app",   # Vercel 배포
        "*"  # 임시로 모든 도메인 허용, 배포 후 제한 필요
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """API 상태 확인"""
    return {"status": "ok", "message": "AuthPixel API is running"}

@app.post("/api/embed")
async def embed_watermark(
    image: UploadFile = File(..., description="워터마크를 삽입할 이미지"),
    text: str = Form(..., description="삽입할 워터마크 텍스트 (최대 20자)")
):
    """
    이미지에 보이지 않는 워터마크를 삽입합니다.
    
    - **image**: 워터마크를 삽입할 이미지 파일 (PNG, JPG, JPEG, BMP)
    - **text**: 삽입할 워터마크 텍스트 (영문+숫자, 최대 20자)
    
    Returns:
        워터마크가 삽입된 PNG 이미지
    """
    try:
        # 텍스트 검증
        if not text or len(text) > 20:
            raise HTTPException(status_code=400, detail="워터마크 텍스트는 1~20자여야 합니다.")
        
        if not text.isalnum():
            raise HTTPException(status_code=400, detail="워터마크 텍스트는 영문과 숫자만 가능합니다.")
        
        # 이미지 로드
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        img_np = np.array(img)
        
        # 워터마크 삽입
        embedder = WatermarkEmbedder()
        result_np, error = embedder.embed(img_np, text)
        
        if error:
            raise HTTPException(status_code=400, detail=error)
        
        # 결과를 PNG로 변환
        result_img = Image.fromarray(result_np)
        buf = io.BytesIO()
        result_img.save(buf, format='PNG')
        buf.seek(0)
        
        return Response(
            content=buf.getvalue(),
            media_type="image/png",
            headers={
                "Content-Disposition": "attachment; filename=watermarked.png"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"워터마크 삽입 중 오류 발생: {str(e)}")

@app.post("/api/decode")
async def decode_watermark(
    image: UploadFile = File(..., description="워터마크를 검증할 이미지")
):
    """
    이미지에서 워터마크를 검출하고 해독합니다.
    
    - **image**: 워터마크를 검증할 이미지 파일 (PNG, JPG, JPEG, BMP)
    
    Returns:
        {"watermark": "검출된 워터마크 텍스트"} 또는 {"error": "오류 메시지"}
    """
    try:
        # 이미지 로드
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        img_np = np.array(img)
        
        # 워터마크 검출
        decoder = WatermarkDecoder()
        watermark, error = decoder.decode(img_np)
        
        if watermark:
            return {"watermark": watermark}
        else:
            return {"error": error or "워터마크가 감지되지 않았습니다."}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"워터마크 검출 중 오류 발생: {str(e)}")

# Vercel Serverless Functions를 위한 handler
# Vercel은 'app' 변수를 자동으로 감지합니다
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
