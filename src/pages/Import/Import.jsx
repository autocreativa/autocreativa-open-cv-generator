import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, CheckCircle, LayoutTemplate, Image as ImageIcon } from 'lucide-react';
import PDFUploader from '../../components/pdf/PDFUploader';
import ImageUploader from '../../components/pdf/ImageUploader';
import Button from '../../components/common/Button';
import { usePDFReader } from '../../hooks/usePDFReader';
import { useOCRReader } from '../../hooks/useOCRReader';
import { useCV } from '../../context/CVContext';
import { getSampleCVData } from '../../utils/constants';
import './Import.css';

const Import = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setCVData, setSelectedSections } = useCV();
    const pdf = usePDFReader();
    const ocr = useOCRReader();

    const [mode, setMode] = useState('file'); // 'file' | 'camera'
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (searchParams.get('mode') === 'ocr') {
            setMode('camera');
        }
    }, [searchParams]);

    const fileIsImage = selectedFile && /^image\//i.test(selectedFile.type);
    const active = mode === 'camera' ? ocr : (fileIsImage ? ocr : pdf);
    const activeCvData = active.cvData;

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setSelectedImage(null);
        setShowPreview(false);
        pdf.reset();
        ocr.reset();
    };

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        setSelectedFile(null);
        setShowPreview(false);
        ocr.reset();
        pdf.reset();
    };

    const handleProcess = async () => {
        if (mode === 'file' && !selectedFile) return;
        if (mode === 'camera' && !selectedImage) return;

        try {
            const extractedData = mode === 'camera'
                ? await ocr.processImage(selectedImage)
                : (fileIsImage ? await ocr.processImage(selectedFile) : await pdf.processPDF(selectedFile));
            if (extractedData) {
                setShowPreview(true);
            }
        } catch (err) {
            console.error('Error processing PDF:', err);
        }
    };

    const handleConfirm = () => {
        if (activeCvData) {
            // Guardar datos en el contexto
            setCVData({
                ...activeCvData,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Determinar secciones activas basadas en los datos extraídos
            const activeSections = ['contactInfo', 'workExperience', 'education'];
            if (activeCvData.professionalSummary) activeSections.push('professionalSummary');
            if (activeCvData.technicalSkills?.length) activeSections.push('technicalSkills');
            if (activeCvData.languages?.length) activeSections.push('languages');
            if (activeCvData.certifications?.length) activeSections.push('certifications');

            setSelectedSections(activeSections);

            // Navegar a selección de plantilla
            navigate('/seleccionar-plantilla?from=import');
        }
    };

    const handleStartWithSample = () => {
        const sampleData = getSampleCVData();
        setCVData({
            ...sampleData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        setSelectedSections(sampleData.selectedSections);
        navigate('/seleccionar-plantilla?from=import');
    };

    return (
        <main className="import-page">
            <div className="import-container container">
                {/* Header */}
                <div className="import-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver</span>
                    </Link>
                </div>

                <div className="import-content">
                    {/* Title */}
                    <div className="import-title-section">
                        <div className="title-icon">
                            <FileText size={32} />
                        </div>
                        <h1 className="import-title">Importa tu CV existente</h1>
                        <p className="import-description">
                            Sube tu currículum en PDF o una foto/imagen (OCR) y nuestra IA extraerá automáticamente
                            tu información para que puedas editarla y mejorarla.
                        </p>
                    </div>

                    {!showPreview ? (
                        <>
                            <div className="import-mode-tabs" role="tablist" aria-label="Modo de importación">
                                <button
                                    type="button"
                                    className={`import-mode-tab ${mode === 'file' ? 'active' : ''}`}
                                    onClick={() => {
                                        setMode('file');
                                        setShowPreview(false);
                                    }}
                                >
                                    Archivo (PDF o imagen)
                                </button>
                                <button
                                    type="button"
                                    className={`import-mode-tab ${mode === 'camera' ? 'active' : ''}`}
                                    onClick={() => {
                                        setMode('camera');
                                        setShowPreview(false);
                                    }}
                                >
                                    Tomar foto
                                </button>
                            </div>

                            {/* Uploader */}
                            {mode === 'file' ? (
                                <PDFUploader
                                    onFileSelect={handleFileSelect}
                                    disabled={active.isLoading}
                                    error={active.error}
                                />
                            ) : (
                                <ImageUploader
                                    onFileSelect={handleImageSelect}
                                    disabled={active.isLoading}
                                    error={active.error}
                                />
                            )}

                            {/* Progress */}
                            {active.isLoading && (
                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${active.progress.percent}%` }}
                                        />
                                    </div>
                                    <div className="progress-info">
                                        <Sparkles size={16} className="animate-pulse" />
                                        <span>{active.progress.step}</span>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="import-actions">
                                <Button
                                    size="lg"
                                    onClick={handleProcess}
                                    disabled={(mode === 'file' ? !selectedFile : !selectedImage) || active.isLoading}
                                    loading={active.isLoading}
                                    leftIcon={(mode === 'camera' || (mode === 'file' && fileIsImage)) ? <ImageIcon size={18} /> : undefined}
                                >
                                    {active.isLoading ? 'Procesando...' : ((mode === 'camera' || (mode === 'file' && fileIsImage)) ? 'Analizar imagen con OCR' : 'Analizar PDF con IA')}
                                </Button>
                            </div>

                            {/* Alternative */}
                            <div className="import-alternative">
                                <span>¿No tienes un CV?</span>
                                <Link to="/crear" className="alternative-link">
                                    Crear desde cero →
                                </Link>
                                <span> o </span>
                                <button className="alternative-link-btn" onClick={handleStartWithSample}>
                                    Usar datos de ejemplo →
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Preview de datos extraídos */
                        <div className="preview-section">
                            <div className="preview-header">
                                <CheckCircle size={24} className="success-icon" />
                                <h2>¡Datos extraídos correctamente!</h2>
                            </div>

                            <div className="preview-data">
                                {activeCvData?.contactInfo?.fullName && (
                                    <div className="preview-item">
                                        <strong>Nombre:</strong> {activeCvData.contactInfo.fullName}
                                    </div>
                                )}
                                {activeCvData?.contactInfo?.email && (
                                    <div className="preview-item">
                                        <strong>Email:</strong> {activeCvData.contactInfo.email}
                                    </div>
                                )}
                                {activeCvData?.workExperience?.length > 0 && (
                                    <div className="preview-item">
                                        <strong>Experiencias:</strong> {activeCvData.workExperience.length} encontradas
                                    </div>
                                )}
                                {activeCvData?.education?.length > 0 && (
                                    <div className="preview-item">
                                        <strong>Estudios:</strong> {activeCvData.education.length} encontrados
                                    </div>
                                )}
                                {activeCvData?.technicalSkills?.length > 0 && (
                                    <div className="preview-item">
                                        <strong>Habilidades:</strong> {activeCvData.technicalSkills.length} encontradas
                                    </div>
                                )}
                            </div>

                            <div className="preview-actions">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowPreview(false);
                                        setSelectedFile(null);
                                        setSelectedImage(null);
                                        pdf.reset();
                                        ocr.reset();
                                    }}
                                >
                                    Subir otro archivo
                                </Button>
                                <Button variant="ghost" onClick={handleStartWithSample} leftIcon={<LayoutTemplate size={18} />}>
                                    Empezar con datos de ejemplo
                                </Button>
                                <Button onClick={handleConfirm}>
                                    Continuar con estos datos
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Import;
