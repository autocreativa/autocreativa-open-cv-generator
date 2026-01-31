import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, CheckCircle } from 'lucide-react';
import PDFUploader from '../../components/pdf/PDFUploader';
import Button from '../../components/common/Button';
import { usePDFReader } from '../../hooks/usePDFReader';
import { useCV } from '../../context/CVContext';
import './Import.css';

const Import = () => {
    const navigate = useNavigate();
    const { setCVData, setSelectedSections } = useCV();
    const { isLoading, error, progress, cvData, processPDF, reset } = usePDFReader();
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        reset();
    };

    const handleProcess = async () => {
        if (!selectedFile) return;

        try {
            const extractedData = await processPDF(selectedFile);
            if (extractedData) {
                setShowPreview(true);
            }
        } catch (err) {
            console.error('Error processing PDF:', err);
        }
    };

    const handleConfirm = () => {
        if (cvData) {
            // Guardar datos en el contexto
            setCVData({
                ...cvData,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Determinar secciones activas basadas en los datos extraídos
            const activeSections = ['contactInfo', 'workExperience', 'education'];
            if (cvData.professionalSummary) activeSections.push('professionalSummary');
            if (cvData.technicalSkills?.length) activeSections.push('technicalSkills');
            if (cvData.languages?.length) activeSections.push('languages');
            if (cvData.certifications?.length) activeSections.push('certifications');

            setSelectedSections(activeSections);

            // Navegar a selección de plantilla
            navigate('/seleccionar-plantilla');
        }
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
                            Sube tu currículum en PDF y nuestra IA extraerá automáticamente
                            toda tu información para que puedas editarla y mejorarla.
                        </p>
                    </div>

                    {!showPreview ? (
                        <>
                            {/* Uploader */}
                            <PDFUploader
                                onFileSelect={handleFileSelect}
                                disabled={isLoading}
                                error={error}
                            />

                            {/* Progress */}
                            {isLoading && (
                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${progress.percent}%` }}
                                        />
                                    </div>
                                    <div className="progress-info">
                                        <Sparkles size={16} className="animate-pulse" />
                                        <span>{progress.step}</span>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="import-actions">
                                <Button
                                    size="lg"
                                    onClick={handleProcess}
                                    disabled={!selectedFile || isLoading}
                                    loading={isLoading}
                                >
                                    {isLoading ? 'Procesando...' : 'Analizar con IA'}
                                </Button>
                            </div>

                            {/* Alternative */}
                            <div className="import-alternative">
                                <span>¿No tienes un CV?</span>
                                <Link to="/crear" className="alternative-link">
                                    Crear desde cero →
                                </Link>
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
                                {cvData?.contactInfo?.fullName && (
                                    <div className="preview-item">
                                        <strong>Nombre:</strong> {cvData.contactInfo.fullName}
                                    </div>
                                )}
                                {cvData?.contactInfo?.email && (
                                    <div className="preview-item">
                                        <strong>Email:</strong> {cvData.contactInfo.email}
                                    </div>
                                )}
                                {cvData?.workExperience?.length > 0 && (
                                    <div className="preview-item">
                                        <strong>Experiencias:</strong> {cvData.workExperience.length} encontradas
                                    </div>
                                )}
                                {cvData?.education?.length > 0 && (
                                    <div className="preview-item">
                                        <strong>Estudios:</strong> {cvData.education.length} encontrados
                                    </div>
                                )}
                                {cvData?.technicalSkills?.length > 0 && (
                                    <div className="preview-item">
                                        <strong>Habilidades:</strong> {cvData.technicalSkills.length} encontradas
                                    </div>
                                )}
                            </div>

                            <div className="preview-actions">
                                <Button variant="outline" onClick={() => setShowPreview(false)}>
                                    Subir otro archivo
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
