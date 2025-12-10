// API 클라이언트 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://auth-pixel-in-toss.vercel.app';

export interface EmbedResponse {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

export interface DecodeResponse {
    watermark?: string;
    error?: string;
}

export const apiClient = {
    /**
     * 워터마크 삽입 API
     */
    async embedWatermark(image: File, text: string): Promise<Blob> {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('text', text);

        const response = await fetch(`${API_BASE_URL}/api/embed`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '워터마크 삽입 중 오류가 발생했습니다.');
        }

        return await response.blob();
    },

    /**
     * 워터마크 검출 API
     */
    async decodeWatermark(image: File): Promise<DecodeResponse> {
        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch(`${API_BASE_URL}/api/decode`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '워터마크 검출 중 오류가 발생했습니다.');
        }

        return await response.json();
    },
};
