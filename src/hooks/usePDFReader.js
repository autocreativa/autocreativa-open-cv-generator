import { useState, useCallback } from 'react';
import { extractTextFromPDF, validatePDFFile, getPDFInfo } from '../services/pdfService';
import { extractCVFromText } from '../services/apiFreeLLMService';

/**
 * Hook para manejar la lectura y procesamiento de PDFs
 * @returns {Object} - Estado y funciones para manejar PDFs
 */
export const usePDFReader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({ step: '', percent: 0 });
    const [pdfInfo, setPdfInfo] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [cvData, setCVData] = useState(null);

    /**
     * Procesa un archivo PDF y extrae los datos del CV
     * @param {File} file - Archivo PDF
     * @returns {Promise<Object>} - Datos del CV estructurados
     */
    const processPDF = useCallback(async (file) => {
        setIsLoading(true);
        setError(null);
        setProgress({ step: 'Validando archivo...', percent: 10 });

        try {
            // Validar archivo
            const validation = validatePDFFile(file);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Obtener información del PDF
            setProgress({ step: 'Leyendo PDF...', percent: 20 });
            const info = await getPDFInfo(file);
            setPdfInfo(info);

            // Extraer texto
            setProgress({ step: 'Extrayendo texto...', percent: 40 });
            const text = await extractTextFromPDF(file);
            setExtractedText(text);

            if (!text || text.length < 50) {
                throw new Error('No se pudo extraer suficiente texto del PDF. Intenta con otro archivo.');
            }

            // Procesar con IA
            setProgress({ step: 'Analizando con IA...', percent: 60 });
            const extractedCV = await extractCVFromText(text);
            setCVData(extractedCV);

            setProgress({ step: '¡Completado!', percent: 100 });
            setIsLoading(false);

            return extractedCV;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    /**
     * Resetea el estado del hook
     */
    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setProgress({ step: '', percent: 0 });
        setPdfInfo(null);
        setExtractedText('');
        setCVData(null);
    }, []);

    return {
        isLoading,
        error,
        progress,
        pdfInfo,
        extractedText,
        cvData,
        processPDF,
        reset,
    };
};

export default usePDFReader;
