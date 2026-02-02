import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { extractCVFromText } from '../services/openRouterService';

/**
 * Hook para manejar OCR en imágenes (Tesseract.js) y luego estructurar CV con OpenRouter.
 */
export const useOCRReader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({ step: '', percent: 0 });
    const [extractedText, setExtractedText] = useState('');
    const [cvData, setCVData] = useState(null);

    const processImage = useCallback(async (file) => {
        setIsLoading(true);
        setError(null);
        setProgress({ step: 'Preparando imagen...', percent: 10 });
        setExtractedText('');
        setCVData(null);

        try {
            if (!file) throw new Error('No se seleccionó archivo');
            if (!/^image\//i.test(file.type)) {
                throw new Error('El archivo debe ser una imagen (JPG/PNG/WebP)');
            }

            setProgress({ step: 'Leyendo texto (OCR)...', percent: 25 });

            const result = await Tesseract.recognize(file, 'spa', {
                logger: (m) => {
                    if (m?.status === 'recognizing text' && typeof m.progress === 'number') {
                        const pct = 25 + Math.round(m.progress * 45);
                        setProgress({ step: 'Leyendo texto (OCR)...', percent: Math.min(70, pct) });
                    }
                },
            });

            const text = String(result?.data?.text || '').trim();
            setExtractedText(text);

            if (!text || text.length < 50) {
                throw new Error('No se pudo extraer suficiente texto. Intenta con una foto más nítida y con buena luz.');
            }

            setProgress({ step: 'Analizando con IA...', percent: 80 });
            const extractedCV = await extractCVFromText(text);
            setCVData(extractedCV);

            setProgress({ step: '¡Completado!', percent: 100 });
            setIsLoading(false);
            return extractedCV;
        } catch (err) {
            setError(err?.message || 'Error procesando la imagen');
            setIsLoading(false);
            throw err;
        }
    }, []);

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setProgress({ step: '', percent: 0 });
        setExtractedText('');
        setCVData(null);
    }, []);

    return {
        isLoading,
        error,
        progress,
        extractedText,
        cvData,
        processImage,
        reset,
    };
};

export default useOCRReader;
