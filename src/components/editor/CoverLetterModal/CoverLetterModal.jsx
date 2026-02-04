import { useRef, useState } from 'react';
import { X, Sparkles, Copy, Download, RefreshCw, Check } from 'lucide-react';
import Button from '../../common/Button';
import { generateCoverLetter } from '../../../services/apiFreeLLMService';
import { exportToPDF, generatePDFBlob } from '../../../utils/pdfExporter';
import { trackDownload } from '../../../services/mailTrackingService';
import './CoverLetterModal.css';

/**
 * Modal para generar carta de presentación con IA
 */
const CoverLetterModal = ({ isOpen, onClose, cvData }) => {
    const [jobPosition, setJobPosition] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    const pdfRef = useRef(null);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const letter = await generateCoverLetter(cvData, jobPosition);
            setCoverLetter(letter);
            setGenerated(true);
        } catch (error) {
            console.error('Error generating cover letter:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        if (!pdfRef.current) return;

        const fileName = `Carta_${cvData?.contactInfo?.fullName || 'CVMagic'}.pdf`;
        const blob = await generatePDFBlob(pdfRef.current, { format: 'a4' });
        await trackDownload({
            eventType: 'cover_letter_pdf',
            fileName,
            blob,
            user: {
                fullName: cvData?.contactInfo?.fullName || '',
                email: cvData?.contactInfo?.email || '',
                phone: cvData?.contactInfo?.phone || '',
                city: cvData?.contactInfo?.city || '',
                country: cvData?.contactInfo?.country || '',
            },
        });

        exportToPDF(pdfRef.current, fileName);
    };

    return (
        <div className="cover-modal-overlay" onClick={onClose}>
            <div className="cover-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cover-modal-header">
                    <div className="cover-title">
                        <Sparkles className="sparkle-icon" size={20} />
                        <h2>Generador de Carta de Presentación</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="cover-modal-content">
                    {!generated ? (
                        <div className="generator-step">
                            <p className="generator-desc">
                                Nuestra IA analizará tu CV y redactará una carta profesional destacando tus fortalezas.
                                Si tienes un puesto específico en mente, ingrésalo abajo.
                            </p>

                            <div className="input-group">
                                <label>Puesto o Empresa (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Desarrollador Frontend en Google"
                                    value={jobPosition}
                                    onChange={(e) => setJobPosition(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                                />
                            </div>

                            <div className="generator-actions">
                                <Button
                                    onClick={handleGenerate}
                                    loading={isGenerating}
                                    leftIcon={<Sparkles size={18} />}
                                    fullWidth
                                >
                                    Generar Carta con IA
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="result-step">
                            <div className="result-actions">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setGenerated(false)}
                                    leftIcon={<RefreshCw size={14} />}
                                >
                                    Regenerar
                                </Button>
                                <div className="right-actions">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownload}
                                        leftIcon={<Download size={14} />}
                                    >
                                        Descargar PDF
                                    </Button>
                                    <button className="icon-btn" onClick={handleCopy} title="Copiar">
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                                <div
                                    ref={pdfRef}
                                    style={{
                                        width: '210mm',
                                        boxSizing: 'border-box',
                                        padding: '16mm',
                                        background: 'white',
                                        color: 'black',
                                        fontFamily: 'Arial, sans-serif',
                                    }}
                                >
                                    <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                                        Carta de Presentación
                                    </div>
                                    <div
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            fontSize: '12px',
                                            lineHeight: 1.6,
                                            overflowWrap: 'anywhere',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {coverLetter}
                                    </div>
                                </div>
                            </div>

                            <textarea
                                className="letter-preview"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            />

                            <Button onClick={onClose} fullWidth>
                                Listo
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoverLetterModal;
