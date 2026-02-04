import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { extractCVFromText } from '../services/apiFreeLLMService';

/**
 * Preprocesa la imagen para mejorar la precisión del OCR
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - Data URL de la imagen procesada
 */
const preprocessImage = async (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Escalar imagen si es muy grande (mejora velocidad sin perder calidad)
            const maxDimension = 2000;
            let width = img.width;
            let height = img.height;

            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = (height / width) * maxDimension;
                    width = maxDimension;
                } else {
                    width = (width / height) * maxDimension;
                    height = maxDimension;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Dibujar imagen
            ctx.drawImage(img, 0, 0, width, height);

            // Obtener datos de píxeles
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            // Aplicar mejoras de contraste y brillo
            const contrast = 1.3; // Aumentar contraste
            const brightness = 10; // Aumentar brillo ligeramente

            for (let i = 0; i < data.length; i += 4) {
                // Aplicar contraste y brillo a cada canal RGB
                data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));     // R
                data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness)); // G
                data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness)); // B
            }

            // Aplicar nitidez (sharpening)
            const sharpenKernel = [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ];

            const tempData = new Uint8ClampedArray(data);
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    for (let c = 0; c < 3; c++) { // RGB channels
                        let sum = 0;
                        for (let ky = -1; ky <= 1; ky++) {
                            for (let kx = -1; kx <= 1; kx++) {
                                const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                                const kernelIdx = (ky + 1) * 3 + (kx + 1);
                                sum += tempData[idx] * sharpenKernel[kernelIdx];
                            }
                        }
                        const idx = (y * width + x) * 4 + c;
                        data[idx] = Math.min(255, Math.max(0, sum));
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Convertir a escala de grises para mejor OCR
            const grayImageData = ctx.getImageData(0, 0, width, height);
            const grayData = grayImageData.data;

            for (let i = 0; i < grayData.length; i += 4) {
                const gray = 0.299 * grayData[i] + 0.587 * grayData[i + 1] + 0.114 * grayData[i + 2];
                grayData[i] = gray;     // R
                grayData[i + 1] = gray; // G
                grayData[i + 2] = gray; // B
            }

            ctx.putImageData(grayImageData, 0, 0);

            // Retornar como data URL
            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        reader.onerror = () => reject(new Error('Error al leer el archivo'));

        reader.readAsDataURL(file);
    });
};

/**
 * Hook para manejar OCR en imágenes (Tesseract.js) y luego estructurar CV con ApiFreeLLM.
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

            // Preprocesar imagen para mejorar OCR
            setProgress({ step: 'Optimizando imagen...', percent: 15 });
            const processedImage = await preprocessImage(file);

            setProgress({ step: 'Leyendo texto (OCR)...', percent: 25 });

            // Usar configuración mejorada de Tesseract
            const result = await Tesseract.recognize(processedImage, 'spa', {
                logger: (m) => {
                    if (m?.status === 'recognizing text' && typeof m.progress === 'number') {
                        const pct = 25 + Math.round(m.progress * 45);
                        setProgress({ step: 'Leyendo texto (OCR)...', percent: Math.min(70, pct) });
                    }
                },
                // Configuración optimizada para CVs
                tessedit_pageseg_mode: Tesseract.PSM.AUTO,
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚáéíóúÑñ0123456789@.,;:()/-+*&%$#!? ',
            });

            const text = String(result?.data?.text || '').trim();
            setExtractedText(text);

            if (!text || text.length < 50) {
                throw new Error('No se pudo extraer suficiente texto. Intenta con una foto más nítida, con buena iluminación y asegúrate de que el texto sea legible.');
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
