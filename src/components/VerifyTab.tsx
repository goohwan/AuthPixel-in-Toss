import { useState, useRef } from 'react';
import { apiClient } from '../api/client';

interface VerifyTabProps {
    language: 'ko' | 'en';
}

function VerifyTab({ language }: VerifyTabProps) {
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [watermark, setWatermark] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = {
        ko: {
            headerVerify: '워터마크 검증 및 해독',
            uploadVerify: '검증할 이미지 업로드',
            privacyNotice: '이 서비스는 고객님의 사진과 정보를 일체 저장하지 않습니다.',
            watermarkLimitation:
                '⚠️ AuthPixel의 워터마크는 과도한 편집 시에는 훼손될 수 있습니다. (이미지 자르기: 75%, JPEG 압축: 99%, 사이즈 변경: 0%)',
            decodeButton: '🔍 워터마크 해독',
            decodingSpinner: '해독 중...',
            successDecode: '워터마크 감지됨!',
            hiddenMessage: '🕵️ 숨겨진 메시지: ',
            errorNoWatermark: '워터마크가 감지되지 않았거나 해독에 실패했습니다.',
            searchGoogle: '구글 이미지 검색',
            searchInstruction: '버튼을 클릭하여 구글 렌즈를 열고, 이미지를 드래그 앤 드롭하여 검색하세요.',
            uploadHere: '여기를 클릭하거나 드래그하여 이미지 업로드',
            uploadedImage: '업로드한 이미지',
        },
        en: {
            headerVerify: 'Verify & Decode Watermark',
            uploadVerify: 'Upload Image to Verify',
            privacyNotice: 'This service does not store any of your photos or information.',
            watermarkLimitation:
                '⚠️ AuthPixel watermarks may be damaged by excessive editing. (Crop: 75%, JPEG: 99%, Resize: 0%)',
            decodeButton: '🔍 Decode Watermark',
            decodingSpinner: 'Decoding...',
            successDecode: 'Watermark Detected!',
            hiddenMessage: '🕵️ Hidden Message: ',
            errorNoWatermark: 'No watermark detected or decoding failed.',
            searchGoogle: 'Search on Google Images',
            searchInstruction: 'Click the button to open Google Lens, then drag and drop your image there to search.',
            uploadHere: 'Click or drag here to upload image',
            uploadedImage: 'Uploaded Image',
        },
    }[language];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setWatermark('');
            setError('');
        }
    };

    const handleDecode = async () => {
        if (!uploadedImage) {
            setError('이미지를 먼저 업로드해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setWatermark('');

        try {
            const result = await apiClient.decodeWatermark(uploadedImage);
            if (result.watermark) {
                setWatermark(result.watermark);
            } else {
                setError(result.error || t.errorNoWatermark);
            }
        } catch (err: any) {
            setError(err.message || '워터마크 검출 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{t.headerVerify}</h2>

            {/* File Upload */}
            <div
                className="file-upload"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                        setUploadedImage(file);
                        setImagePreview(URL.createObjectURL(file));
                        setWatermark('');
                        setError('');
                    }
                }}
                onDragOver={(e) => e.preventDefault()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/bmp"
                    onChange={handleFileChange}
                />
                <p>{t.uploadHere}</p>
            </div>

            <p className="caption">{t.privacyNotice}</p>
            <p className="caption">{t.watermarkLimitation}</p>

            {/* Image Preview */}
            {imagePreview && (
                <div className="image-preview">
                    <p><strong>{t.uploadedImage}</strong></p>
                    <img src={imagePreview} alt="Uploaded" />
                </div>
            )}

            {/* Decode Button */}
            {uploadedImage && (
                <button
                    className="btn btn-primary"
                    onClick={handleDecode}
                    disabled={loading}
                    style={{ marginTop: '1rem', width: '100%' }}
                >
                    {loading ? t.decodingSpinner : t.decodeButton}
                </button>
            )}

            {/* Loading */}
            {loading && <div className="spinner"></div>}

            {/* Success */}
            {watermark && (
                <div className="alert alert-success">
                    <p><strong>{t.successDecode}</strong></p>
                    <h2>{t.hiddenMessage}<code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{watermark}</code></h2>
                </div>
            )}

            {/* Error */}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Google Images Search */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <h3>{t.searchGoogle}</h3>
                <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
                    {t.searchInstruction}
                </div>
                <a
                    href="https://lens.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}
                >
                    {t.searchGoogle}
                </a>
            </div>
        </div>
    );
}

export default VerifyTab;
