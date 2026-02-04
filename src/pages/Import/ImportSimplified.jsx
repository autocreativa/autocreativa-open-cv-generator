import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, CheckCircle, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import PDFUploader from '../../components/pdf/PDFUploader';
import ImageUploader from '../../components/pdf/ImageUploader';
import Button from '../../components/common/Button';
import { usePDFReader } from '../../hooks/usePDFReader';
import { useOCRReader } from '../../hooks/useOCRReader';
import { useCV } from '../../context/CVContext';
import './ImportSimplified.css';

const ImportSimplified = () => {
    const navigate = useNavigate();
    const { setCVData, setSelectedSections } = useCV();
    const pdf = usePDFReader();
    const ocr = useOCRReader();

    const [uploadMethod, setUploadMethod] = useState(null); // null | 'file' | 'camera'
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const fileIsImage = selectedFile && /^image\//i.test(selectedFile.type);
    const active = uploadMethod === 'camera' ? ocr : (fileIsImage ? ocr : pdf);
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
        if (uploadMethod === 'file' && !selectedFile) return;
        if (uploadMethod === 'camera' && !selectedImage) return;

        try {
            const extractedData = uploadMethod === 'camera'
                ? await ocr.processImage(selectedImage)
                : (fileIsImage ? await ocr.processImage(selectedFile) : await pdf.processPDF(selectedFile));
            if (extractedData) {
                setShowPreview(true);
            }
        } catch (err) {
            console.error('Error processing file:', err);
        }
    };

    const handleConfirm = () => {
        if (activeCvData) {
            setCVData({
                ...activeCvData,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            const activeSections = ['contactInfo', 'workExperience', 'education'];
            if (activeCvData.professionalSummary) activeSections.push('professionalSummary');
            if (activeCvData.technicalSkills?.length) activeSections.push('technicalSkills');
            if (activeCvData.languages?.length) activeSections.push('languages');
            if (activeCvData.certifications?.length) activeSections.push('certifications');

            setSelectedSections(activeSections);
            navigate('/seleccionar-plantilla?from=import');
        }
    };

    const uploadMethods = [
        {
            id: 'file',
            icon: Upload,
            title: 'Subir archivo',
            description: 'PDF o imagen (JPG, PNG)',
        },
        {
            id: 'camera',
            icon: Camera,
            title: 'Tomar foto',
            description: 'Usa tu cámara',
        }
    ];

    return (
        <main className="import-simplified-page">
            <div className="import-simplified-container container">
                {/* Header */}
                <div className="import-simplified-header">
                    <button className="back-link" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                        <span>Volver</span>
                    </button>
                </div>

                {!showPreview ? (
                    <>
                        {/* Title Section */}
                        <div className="import-title-section">
                            <div className="section-badge">
                                <FileText size={16} />
                                <span>Mejorar CV</span>
                            </div>
                            <h1 className="import-title">Extrae información desde un archivo</h1>
                            <p className="import-description">
                                Sube tu CV existente en PDF, una imagen o toma una foto directamente.
                                Nuestra IA extraerá automáticamente toda tu información para que puedas editarla y mejorarla.
                            </p>
                        </div>

                        {/* Upload Method Selection */}
                        <div className="upload-methods">
                            {uploadMethods.map((method) => (
                                <button
                                    key={method.id}
                                    className={`upload-method-card ${uploadMethod === method.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setUploadMethod(method.id);
                                        setShowPreview(false);
                                        setSelectedFile(null);
                                        setSelectedImage(null);
                                        pdf.reset();
                                        ocr.reset();
                                    }}
                                    disabled={active.isLoading}
                                >
                                    <div className="upload-method-icon">
                                        <method.icon size={32} />
                                    </div>
                                    <div className="upload-method-content">
                                        <h3>{method.title}</h3>
                                        <p>{method.description}</p>
                                    </div>
                                    <div className="upload-method-radio">
                                        <span className={uploadMethod === method.id ? 'selected' : ''}></span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Uploader */}
                        {uploadMethod && (
                            <div className="uploader-section">
                                {uploadMethod === 'file' ? (
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
                            </div>
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
                        {uploadMethod && (
                            <div className="import-actions">
                                <Button
                                    size="lg"
                                    onClick={handleProcess}
                                    disabled={(uploadMethod === 'file' ? !selectedFile : !selectedImage) || active.isLoading}
                                    loading={active.isLoading}
                                    leftIcon={uploadMethod === 'camera' || fileIsImage ? <ImageIcon size={18} /> : <FileText size={18} />}
                                >
                                    {active.isLoading
                                        ? 'Procesando...'
                                        : (uploadMethod === 'camera' || fileIsImage)
                                            ? 'Analizar imagen con OCR'
                                            : 'Analizar PDF con IA'}
                                </Button>
                            </div>
                        )}

                        {/* Alternative */}
                        <div className="import-alternative">
                            <span>¿No tienes un CV?</span>
                            <Link to="/crear" className="alternative-link">
                                Crear desde cero →
                            </Link>
                        </div>
                    </>
                ) : (
                    /* Preview Section */
                    <div className="preview-section">
                        <div className="preview-header">
                            <div className="success-icon-wrapper">
                                <CheckCircle size={48} className="success-icon" />
                            </div>
                            <h2>¡Datos extraídos correctamente!</h2>
                            <p>Hemos extraído la siguiente información de tu documento</p>
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
                            {activeCvData?.contactInfo?.phone && (
                                <div className="preview-item">
                                    <strong>Teléfono:</strong> {activeCvData.contactInfo.phone}
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
                            <Button onClick={handleConfirm}>
                                Continuar con estos datos
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ImportSimplified;
