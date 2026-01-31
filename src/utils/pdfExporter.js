import html2pdf from 'html2pdf.js';

/**
 * Exportar elemento HTML a PDF
 * @param {HTMLElement} element - Elemento a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportToPDF = async (element, filename = 'mi-curriculum.pdf') => {
    if (!element) {
        console.error('No element provided for PDF export');
        return;
    }

    const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        },
        pagebreak: {
            mode: ['avoid-all', 'css', 'legacy'],
            avoid: [
                '.cv-section',
                '.experience-item',
                '.education-item',
                '.project-item',
                '.timeline-item',
                '.certification-item',
                '.language-item',
                '.skill-item',
                '.tag',
            ],
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(element).save();
        return true;
    } catch (error) {
        console.error('Error exporting PDF:', error);
        return false;
    }
};
