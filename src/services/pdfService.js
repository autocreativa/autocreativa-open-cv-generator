import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configurar worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

/**
 * Extrae texto de un archivo PDF
 * @param {File} file - Archivo PDF
 * @returns {Promise<string>} - Texto extraído del PDF
 */
export const extractTextFromPDF = async (file) => {
    try {
        // Convertir el archivo a ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Cargar el documento PDF
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        // Iterar por cada página
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Extraer texto de cada item
            const pageText = textContent.items
                .map((item) => item.str)
                .join(' ');

            fullText += pageText + '\n\n';
        }

        return fullText.trim();
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('No se pudo leer el archivo PDF. Asegúrate de que sea un archivo válido.');
    }
};

/**
 * Valida que el archivo sea un PDF válido
 * @param {File} file - Archivo a validar
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validatePDFFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!file) {
        return { valid: false, error: 'No se seleccionó ningún archivo' };
    }

    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'El archivo debe ser un PDF' };
    }

    if (file.size > MAX_SIZE) {
        return { valid: false, error: 'El archivo no debe superar los 5MB' };
    }

    return { valid: true };
};

/**
 * Obtiene información básica del PDF
 * @param {File} file - Archivo PDF
 * @returns {Promise<Object>} - Información del PDF
 */
export const getPDFInfo = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        return {
            numPages: pdf.numPages,
            fileName: file.name,
            fileSize: file.size,
        };
    } catch (error) {
        console.error('Error getting PDF info:', error);
        throw new Error('No se pudo obtener información del PDF');
    }
};

export default {
    extractTextFromPDF,
    validatePDFFile,
    getPDFInfo,
};
