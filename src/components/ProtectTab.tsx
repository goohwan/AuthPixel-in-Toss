import { useState, useRef } from 'react';
import { apiClient } from '../api/client';

interface ProtectTabProps {
    language: 'ko' | 'en';
}

function ProtectTab({ language }: ProtectTabProps) {
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [watermarkText, setWatermarkText] = useState('');
    const [protectedImage, setProtectedImage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = {
        ko: {
            headerProtect: '보이지 않는 워터마크 삽입',
            uploadProtect: '보호할 이미지 업로드',
            privacyNotice: '이 서비스는 고객님의 사진과 정보를 일체 저장하지 않습니다.',
            watermarkLimitation:
                '⚠️ AuthPixel의 워터마크는 과도한 편집 시에는 훼손될 수 있습니다. (이미지 자르기: 75%, JPEG 압축: 99%, 사이즈 변경: 0%)',
            watermarkTextLabel: '워터마크 텍스트 입력 (최대 20자, 영문+숫자만 입력해주세요)',
            embedButton: '🔒 워터마크 삽입',
            warningNoText: '워터마크 텍스트를 입력해주세요.',
            embeddingSpinner: '워터마크 삽입 중...',
            successEmbed: '워터마크가 성공적으로 삽입되었습니다!',
            downloadButton: '⬇️ 보호된 이미지 다운로드',
            uploadHere: '여기를 클릭하거나 드래그하여 이미지 업로드',
            originalImage: '원본 이미지',
            protectedImageLabel: '보호된 이미지',
        },
        en: {
            headerProtect: 'Embed Invisible Watermark',
            uploadProtect: 'Upload Image to Protect',
            privacyNotice: 'This service does not store any of your photos or information.',
            watermarkLimitation:
                '⚠️ AuthPixel watermarks may be damaged by excessive editing. (Crop: 75%, JPEG: 99%, Resize: 0%)',
            watermarkTextLabel: 'Enter Watermark Text (Max 20 chars, English letters and numbers.)',
            embedButton: '🔒 Embed Watermark',
            warningNoText: 'Please enter watermark text.',
            embeddingSpinner: 'Embedding watermark...',
            successEmbed: 'Watermark embedded successfully!',
            downloadButton: '⬇️ Download Protected Image',
            uploadHere: 'Click or drag here to upload image',
            originalImage: 'Original Image',
            protectedImageLabel: 'Protected Image',
        },
    }[language];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setProtectedImage('');
            setError('');
            setSuccess(false);
        }
    };

    const handleEmbed = async () => {
        if (!watermarkText.trim()) {
            setError(t.warningNoText);
            return;
        }

        if (!uploadedImage) {
            setError('이미지를 먼저 업로드해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const blob = await apiClient.embedWatermark(uploadedImage, watermarkText);
            const url = URL.createObjectURL(blob);
            setProtectedImage(url);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || '워터마크 삽입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (protectedImage) {
            const a = document.createElement('a');
            a.href = protectedImage;
            a.download = 'protected_image.png';
            a.click();
        }
    };

    return (
        <div>
            <h2>{t.headerProtect}</h2>

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
                        setProtectedImage('');
                        setError('');
                        setSuccess(false);
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
                    <p><strong>{t.originalImage}</strong></p>
                    <img src={imagePreview} alt="Uploaded" />
                </div>
            )}

            {/* Watermark Text Input */}
            {uploadedImage && (
                <div style={{ marginTop: '1rem' }}>
                    <label htmlFor="watermark-text" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        {t.watermarkTextLabel}
                    </label>
                    <input
                        id="watermark-text"
                        type="text"
                        className="input"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        maxLength={20}
                        placeholder="e.g., MyWatermark2024"
                    />
                </div>
            )}

            {/* Embed Button */}
            {uploadedImage && (
                <button
                    className="btn btn-primary"
                    onClick={handleEmbed}
                    disabled={loading}
                    style={{ marginTop: '1rem', width: '100%' }}
                >
                    {loading ? t.embeddingSpinner : t.embedButton}
                </button>
            )}

            {/* Loading */}
            {loading && <div className="spinner"></div>}

            {/* Error */}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Success */}
            {success && (
                <>
                    <div className="alert alert-success">{t.successEmbed}</div>
                    {protectedImage && (
                        <div className="image-preview">
                            <p><strong>{t.protectedImageLabel}</strong></p>
                            <img src={protectedImage} alt="Protected" />
                            <button className="btn btn-primary" onClick={handleDownload} style={{ marginTop: '1rem', width: '100%' }}>
                                {t.downloadButton}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProtectTab;
