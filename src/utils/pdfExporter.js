import html2pdf from 'html2pdf.js';

/**
 * Exportar elemento HTML a PDF
 * @param {HTMLElement} element - Elemento a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportToPDF = async (element, filename = 'mi-curriculum.pdf', options = {}) => {
    if (!element) {
        console.error('No element provided for PDF export');
        return;
    }

    const format = options?.format || 'a4';

    const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        },
        pagebreak: {
            mode: ['css', 'legacy'],
            /* Dejar que el navegador decida los saltos de página automáticamente */
        },
        jsPDF: { 
            unit: 'mm', 
            format: format, 
            orientation: 'portrait',
            compress: true
        }
    };

    try {
        document.documentElement.classList.add('pdf-exporting');
        await html2pdf().set(opt).from(element).save();
        return true;
    } catch (error) {
        console.error('Error exporting PDF:', error);
        return false;
    } finally {
        document.documentElement.classList.remove('pdf-exporting');
    }
};

export const generatePDFBlob = async (element, options = {}) => {
    if (!element) {
        console.error('No element provided for PDF generation');
        return null;
    }

    const format = options?.format || 'a4';

    const opt = {
        margin: [8, 8, 8, 8],
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        },
        pagebreak: {
            mode: ['css', 'legacy'],
        },
        jsPDF: {
            unit: 'mm',
            format: format,
            orientation: 'portrait',
            compress: true,
        },
    };

    try {
        document.documentElement.classList.add('pdf-exporting');
        const pdf = await html2pdf().set(opt).from(element).toPdf().get('pdf');
        return pdf.output('blob');
    } catch (error) {
        console.error('Error generating PDF blob:', error);
        return null;
    } finally {
        document.documentElement.classList.remove('pdf-exporting');
    }
};
