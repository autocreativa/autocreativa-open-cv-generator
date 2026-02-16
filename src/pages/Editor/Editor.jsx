import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Eye,
    Edit3,
    Wand2,
    ChevronDown,
    FileText,
    Loader2,
    FileSignature,
    X,
    Check,
    Plus
} from 'lucide-react';
import Button from '../../components/common/Button';
import CoverLetterModal from '../../components/editor/CoverLetterModal';
import PagedPreview from '../../components/preview/PagedPreview'; // [NEW] Paged.js Preview
import { useCV } from '../../context/CVContext';
import { templates, getTemplateComponent } from '../../templates';
import { getImprovementSuggestions } from '../../services/apiFreeLLMService';
import { exportToPDF, generatePDFBlob } from '../../utils/pdfExporter';
import { trackDownload } from '../../services/mailTrackingService';
import './Editor.css';

const Editor = () => {
    const navigate = useNavigate();
    const { cvData, setCvData, selectedTemplate, selectedSections, setSelectedSections, saveCVData } = useCV();

    // activeTab removed for unified view
    const [editingSection, setEditingSection] = useState(null);
    const [isImproving, setIsImproving] = useState(null);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(selectedTemplate || 'modern-minimal');
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

    const [showCoverLetter, setShowCoverLetter] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const [pageSize, setPageSize] = useState('a4');

    // Removed old PDF preview states
    const previewDebounceRef = useRef(null);

    const prevTemplateRef = useRef(currentTemplate);
    const prevPageSizeRef = useRef(pageSize);
    // prevActiveTabRef removed

    const applySuggestionRef = useRef(null);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiModalTitle, setAiModalTitle] = useState('');
    const [aiModalSectionType, setAiModalSectionType] = useState('');
    const [aiOriginalText, setAiOriginalText] = useState('');
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [aiError, setAiError] = useState('');

    // Obtener el componente de la plantilla seleccionada
    const TemplateComponent = getTemplateComponent(currentTemplate);
    const templateInfo = templates.find((t) => t.id === currentTemplate);

    // Auto-guardar cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            handleAutoSave();
        }, 30000);
        return () => clearInterval(interval);
    }, [cvData]);

    const handleAutoSave = () => {
        setSaveStatus('saving');
        saveCVData();
        setTimeout(() => setSaveStatus('saved'), 500);
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const openImproveModal = async ({ title, sectionType, text, applySuggestion }) => {
        if (!text || isImproving) return;

        applySuggestionRef.current = applySuggestion;
        setAiModalTitle(title);
        setAiModalSectionType(sectionType);
        setAiOriginalText(text);
        setAiSuggestions([]);
        setAiError('');
        setAiModalOpen(true);

        setIsImproving(sectionType);
        try {
            const suggestions = await getImprovementSuggestions(text, sectionType, cvData);
            setAiSuggestions(Array.isArray(suggestions) ? suggestions : []);
        } catch (error) {
            console.error('Error improving text:', error);
            setAiError(error?.message || 'No se pudo mejorar el texto');
        } finally {
            setIsImproving(null);
        }
    };

    const closeAiModal = () => {
        setAiModalOpen(false);
        setAiSuggestions([]);
        setAiError('');
        applySuggestionRef.current = null;
    };

    const handleFieldChange = (section, field, value) => {
        setCvData((prev) => ({
            ...prev,
            [section]: typeof prev[section] === 'object'
                ? { ...prev[section], [field]: value }
                : value,
        }));
    };

    const updateArrayField = (section, index, field, value) => {
        setCvData((prev) => {
            const arr = Array.isArray(prev?.[section]) ? [...prev[section]] : [];
            const current = arr[index] || {};
            arr[index] = { ...current, [field]: value };
            return { ...prev, [section]: arr };
        });
    };

    const addArrayItem = (section, item) => {
        setCvData((prev) => {
            const arr = Array.isArray(prev?.[section]) ? [...prev[section]] : [];
            return { ...prev, [section]: [...arr, item] };
        });
    };

    const removeArrayItem = (section, index) => {
        setCvData((prev) => {
            const arr = Array.isArray(prev?.[section]) ? [...prev[section]] : [];
            arr.splice(index, 1);
            return { ...prev, [section]: arr };
        });
    };

    const handleExportPDF = async () => {
        // With Paged.js, the page is already formatted for print.
        // We simply trigger the browser's print dialog, which will respect the Paged.js CSS.
        if (isExporting) return;
        setIsExporting(true);

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const waitForPagedPages = async () => {
            const timeoutMs = 12000;
            const start = Date.now();
            while (Date.now() - start < timeoutMs) {
                const pagesRoot = document.querySelector('.paged-preview-wrapper .pagedjs_pages');
                const hasAtLeastOnePage = !!pagesRoot?.querySelector('.pagedjs_page');
                if (hasAtLeastOnePage) return true;
                await wait(200);
            }
            return false;
        };

        const waitForImages = async () => {
            const images = Array.from(document.querySelectorAll('.paged-preview-wrapper img'));
            const pending = images.filter((img) => !img.complete);
            if (pending.length === 0) return;

            await Promise.all(
                pending.map(
                    (img) =>
                        new Promise((resolve) => {
                            img.addEventListener('load', resolve, { once: true });
                            img.addEventListener('error', resolve, { once: true });
                        })
                )
            );
        };

        try {
            await wait(50);
            if (document?.fonts?.ready) {
                try {
                    await document.fonts.ready;
                } catch {
                    // ignore
                }
            }

            await waitForPagedPages();
            await waitForImages();
            await wait(50);

            window.print();
        } finally {
            setIsExporting(false);
        }

        // Track the download
        trackDownload({
            eventType: 'cv_pdf',
            fileName: `CV_${cvData?.contactInfo?.fullName || 'Profesional'}.pdf`,
            blob: null, // Paged.js prints directly, no blob generated here
            user: {
                fullName: cvData?.contactInfo?.fullName || '',
                email: cvData?.contactInfo?.email || '',
                phone: cvData?.contactInfo?.phone || '',
                city: cvData?.contactInfo?.city || '',
                country: cvData?.contactInfo?.country || '',
            },
        });
    };

    // Old PDF Preview renderer removed


    useEffect(() => {
        // Just keeping logic to clear debouncer if needed, though PagedPreview handles its own updates
        // We can keep specific side effects here if needed
    }, [currentTemplate, pageSize, cvData, selectedSections]);

    const sectionLabels = {
        contactInfo: 'Datos de Contacto',
        professionalSummary: 'Perfil Profesional',
        workExperience: 'Experiencia Laboral',
        education: 'Educación',
        technicalSkills: 'Habilidades Técnicas',
        softSkills: 'Habilidades Blandas',
        languages: 'Idiomas',
        certifications: 'Certificaciones',
        projects: 'Proyectos',
        socialLinks: 'Redes Sociales',
    };

    return (
        <main className="editor-page">
            {/* Modals */}
            <CoverLetterModal
                isOpen={showCoverLetter}
                onClose={() => setShowCoverLetter(false)}
                cvData={cvData}
            />

            {aiModalOpen && (
                <div className="ai-modal-overlay" onClick={closeAiModal}>
                    <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ai-modal-header">
                            <div className="ai-modal-title">
                                <Wand2 size={18} />
                                <h3>{aiModalTitle || 'Mejorar con IA'}</h3>
                            </div>
                            <button className="ai-modal-close" onClick={closeAiModal}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="ai-modal-body">
                            <div className="ai-original">
                                <div className="ai-original-label">Texto actual</div>
                                <div className="ai-original-text">{aiOriginalText}</div>
                            </div>

                            <div className="ai-suggestions">
                                <div className="ai-suggestions-label">Sugerencias (elige una)</div>

                                {isImproving === aiModalSectionType && (
                                    <div className="ai-loading">
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Generando sugerencias...</span>
                                    </div>
                                )}

                                {aiError && <div className="ai-error">{aiError}</div>}

                                {!aiError && isImproving !== aiModalSectionType && aiSuggestions.length === 0 && (
                                    <div className="ai-empty">No se generaron sugerencias.</div>
                                )}

                                {aiSuggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        className="ai-suggestion"
                                        onClick={() => {
                                            if (applySuggestionRef.current) {
                                                applySuggestionRef.current(s);
                                            }
                                            closeAiModal();
                                        }}
                                    >
                                        <span className="ai-suggestion-check"><Check size={16} /></span>
                                        <span className="ai-suggestion-text">{s}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="editor-toolbar">
                <div className="toolbar-left">
                    <button className="back-btn" onClick={() => navigate('/seleccionar-plantilla')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="doc-info">
                        <FileText size={18} />
                        <span>{cvData?.contactInfo?.fullName || 'Mi CV'}</span>
                        {saveStatus !== 'idle' && (
                            <span className={`save-status ${saveStatus}`}>
                                {saveStatus === 'saving' ? 'Guardando...' : '✓ Guardado'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="toolbar-center">
                    <div className="template-selector">
                        <button
                            className="template-btn"
                            onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                        >
                            <span>Plantilla: {templateInfo?.name || 'Seleccionar'}</span>
                            <ChevronDown size={16} />
                        </button>

                        {showTemplateDropdown && (
                            <div className="template-dropdown">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        className={`dropdown-item ${currentTemplate === template.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setCurrentTemplate(template.id);
                                            setShowTemplateDropdown(false);
                                        }}
                                    >
                                        <span>{template.name}</span>
                                        <span className="template-category">{template.category}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="toolbar-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<FileSignature size={16} />}
                        onClick={() => setShowCoverLetter(true)}
                    >
                        Generar carta de presentación
                    </Button>



                    {/* View toggle removed */}

                    <Button
                        variant="primary"
                        size="sm"
                        loading={isExporting}
                        leftIcon={<Download size={16} />}
                        onClick={handleExportPDF}
                    >
                        Descargar PDF
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="editor-content">
                {/* Left Panel - Edit */}
                <aside className="edit-panel">
                    <div className="panel-header">
                        <h2>Editar CV</h2>
                        <p>Haz clic en una sección para editarla</p>
                    </div>

                    <div className="sections-list">

                        {Object.keys(sectionLabels).map((sectionId) => {
                            const isActive = selectedSections.includes(sectionId);
                            return (
                                <div key={sectionId} className={`edit-section ${!isActive ? 'inactive' : ''}`}>
                                    <div
                                        className="section-header"
                                        onClick={() => {
                                            if (!isActive) {
                                                setSelectedSections([...selectedSections, sectionId]);
                                                setEditingSection(sectionId);
                                            } else {
                                                setEditingSection(editingSection === sectionId ? null : sectionId);
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3>{sectionLabels[sectionId] || sectionId}</h3>
                                            {!isActive && (
                                                <span style={{ fontSize: '10px', backgroundColor: '#e2e8f0', color: '#64748b', padding: '2px 6px', borderRadius: '4px' }}>
                                                    Agregar
                                                </span>
                                            )}
                                        </div>
                                        {isActive ? (
                                            <ChevronDown
                                                size={18}
                                                className={`chevron ${editingSection === sectionId ? 'open' : ''}`}
                                            />
                                        ) : (
                                            <Plus size={18} className="text-muted" />
                                        )}
                                    </div>

                                    {isActive && editingSection === sectionId && (
                                        <div className="section-content">
                                            {/* Content rendering logic remains same, but we need to ensure we don't break the loop nesting */}
                                            {/* Since we are inside the map, we need to handle specific sections again or ensure the existing conditionals work */}

                                            {sectionId === 'professionalSummary' && (
                                                <div className="field-group">
                                                    <div className="field-header">
                                                        <label>Resumen profesional</label>
                                                        <button
                                                            className="improve-btn"
                                                            onClick={() =>
                                                                openImproveModal({
                                                                    title: 'Resumen profesional',
                                                                    sectionType: 'professionalSummary',
                                                                    text: cvData?.professionalSummary,
                                                                    applySuggestion: (s) => handleFieldChange('professionalSummary', null, s),
                                                                })
                                                            }
                                                            disabled={isImproving}
                                                        >
                                                            {isImproving === 'professionalSummary' ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Wand2 size={14} />
                                                                    <span>Mejorar con IA</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={cvData?.professionalSummary || ''}
                                                        onChange={(e) => handleFieldChange(sectionId, null, e.target.value)}
                                                        placeholder="Describe tu perfil profesional..."
                                                        rows={4}
                                                    />
                                                </div>
                                            )}

                                            {sectionId === 'contactInfo' && (
                                                <>
                                                    <div className="field-group">
                                                        <label>Nombre completo</label>
                                                        <input
                                                            type="text"
                                                            value={cvData?.contactInfo?.fullName || ''}
                                                            onChange={(e) => handleFieldChange('contactInfo', 'fullName', e.target.value)}
                                                            placeholder="Tu nombre"
                                                        />
                                                    </div>
                                                    <div className="field-group">
                                                        <label>Título (Opcional)</label>
                                                        <input
                                                            type="text"
                                                            value={cvData?.contactInfo?.title || ''}
                                                            onChange={(e) => handleFieldChange('contactInfo', 'title', e.target.value)}
                                                            placeholder="Ej: Desarrollador Frontend"
                                                        />
                                                    </div>
                                                    <div className="field-group">
                                                        <label>Email</label>
                                                        <input
                                                            type="email"
                                                            value={cvData?.contactInfo?.email || ''}
                                                            onChange={(e) => handleFieldChange('contactInfo', 'email', e.target.value)}
                                                            placeholder="tu@email.com"
                                                        />
                                                    </div>
                                                    <div className="field-group">
                                                        <label>Teléfono</label>
                                                        <input
                                                            type="tel"
                                                            value={cvData?.contactInfo?.phone || ''}
                                                            onChange={(e) => handleFieldChange('contactInfo', 'phone', e.target.value)}
                                                            placeholder="+56 9 1234 5678"
                                                        />
                                                    </div>
                                                    <div className="field-group">
                                                        <label>Dirección</label>
                                                        <input
                                                            type="text"
                                                            value={cvData?.contactInfo?.address || ''}
                                                            onChange={(e) => handleFieldChange('contactInfo', 'address', e.target.value)}
                                                            placeholder="Calle 123"
                                                        />
                                                    </div>
                                                    <div className="field-group">
                                                        <label>Ciudad</label>
                                                        <input
                                                            type="text"
                                                            value={cvData?.contactInfo?.city || ''}
                                                            onChange={(e) => handleFieldChange('contactInfo', 'city', e.target.value)}
                                                            placeholder="Santiago"
                                                        />
                                                    </div>
                                                    <div className="field-group">
                                                        <label>País</label>
                                                        <input
                                                            type="text"
                                                            value={cvData?.contactInfo?.country || ''}
                                                            onChange={(e) => handleFieldChange('contactInfo', 'country', e.target.value)}
                                                            placeholder="Chile"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {sectionId === 'workExperience' && (
                                                <>
                                                    {(cvData?.workExperience || []).map((exp, idx) => (
                                                        <div key={idx} className="array-item">
                                                            <div className="array-item-header">
                                                                <strong>Experiencia {idx + 1}</strong>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeArrayItem('workExperience', idx)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Cargo</label>
                                                                <input
                                                                    type="text"
                                                                    value={exp.position || ''}
                                                                    onChange={(e) => updateArrayField('workExperience', idx, 'position', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Empresa</label>
                                                                <input
                                                                    type="text"
                                                                    value={exp.company || ''}
                                                                    onChange={(e) => updateArrayField('workExperience', idx, 'company', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Ubicación (Opcional)</label>
                                                                <input
                                                                    type="text"
                                                                    value={exp.location || ''}
                                                                    onChange={(e) => updateArrayField('workExperience', idx, 'location', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="two-col">
                                                                <div className="field-group">
                                                                    <label>Inicio</label>
                                                                    <input
                                                                        type="month"
                                                                        value={exp.startDate || ''}
                                                                        onChange={(e) => updateArrayField('workExperience', idx, 'startDate', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="field-group">
                                                                    <label>Fin</label>
                                                                    <input
                                                                        type="month"
                                                                        value={exp.endDate || ''}
                                                                        onChange={(e) => updateArrayField('workExperience', idx, 'endDate', e.target.value)}
                                                                        disabled={!!exp.isCurrent}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="field-group checkbox-row">
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!exp.isCurrent}
                                                                        onChange={(e) => updateArrayField('workExperience', idx, 'isCurrent', e.target.checked)}
                                                                    />
                                                                    Trabajo actual
                                                                </label>
                                                            </div>

                                                            <div className="field-group">
                                                                <div className="field-header">
                                                                    <label>Descripción</label>
                                                                    <button
                                                                        className="improve-btn"
                                                                        onClick={() =>
                                                                            openImproveModal({
                                                                                title: `Experiencia ${idx + 1} - Descripción`,
                                                                                sectionType: `workExperience.description`,
                                                                                text: exp.description,
                                                                                applySuggestion: (s) => updateArrayField('workExperience', idx, 'description', s),
                                                                            })
                                                                        }
                                                                        disabled={isImproving}
                                                                    >
                                                                        {isImproving === 'workExperience.description' ? (
                                                                            <Loader2 size={14} className="animate-spin" />
                                                                        ) : (
                                                                            <>
                                                                                <Wand2 size={14} />
                                                                                <span>Mejorar con IA</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <textarea
                                                                    value={exp.description || ''}
                                                                    onChange={(e) => updateArrayField('workExperience', idx, 'description', e.target.value)}
                                                                    rows={4}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            addArrayItem('workExperience', {
                                                                company: '',
                                                                position: '',
                                                                startDate: '',
                                                                endDate: '',
                                                                isCurrent: false,
                                                                description: '',
                                                                location: '',
                                                            })
                                                        }
                                                    >
                                                        Agregar experiencia
                                                    </Button>
                                                </>
                                            )}

                                            {sectionId === 'education' && (
                                                <>
                                                    {(cvData?.education || []).map((edu, idx) => (
                                                        <div key={idx} className="array-item">
                                                            <div className="array-item-header">
                                                                <strong>Estudio {idx + 1}</strong>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeArrayItem('education', idx)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Institución</label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.institution || ''}
                                                                    onChange={(e) => updateArrayField('education', idx, 'institution', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Título</label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.degree || ''}
                                                                    onChange={(e) => updateArrayField('education', idx, 'degree', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Área (Opcional)</label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.field || ''}
                                                                    onChange={(e) => updateArrayField('education', idx, 'field', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="two-col">
                                                                <div className="field-group">
                                                                    <label>Inicio</label>
                                                                    <input
                                                                        type="month"
                                                                        value={edu.startDate || ''}
                                                                        onChange={(e) => updateArrayField('education', idx, 'startDate', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="field-group">
                                                                    <label>Fin</label>
                                                                    <input
                                                                        type="month"
                                                                        value={edu.endDate || ''}
                                                                        onChange={(e) => updateArrayField('education', idx, 'endDate', e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="field-group">
                                                                <div className="field-header">
                                                                    <label>Descripción (Opcional)</label>
                                                                    <button
                                                                        className="improve-btn"
                                                                        onClick={() =>
                                                                            openImproveModal({
                                                                                title: `Estudio ${idx + 1} - Descripción`,
                                                                                sectionType: `education.description`,
                                                                                text: edu.description,
                                                                                applySuggestion: (s) => updateArrayField('education', idx, 'description', s),
                                                                            })
                                                                        }
                                                                        disabled={isImproving}
                                                                    >
                                                                        {isImproving === 'education.description' ? (
                                                                            <Loader2 size={14} className="animate-spin" />
                                                                        ) : (
                                                                            <>
                                                                                <Wand2 size={14} />
                                                                                <span>Mejorar con IA</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <textarea
                                                                    value={edu.description || ''}
                                                                    onChange={(e) => updateArrayField('education', idx, 'description', e.target.value)}
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            addArrayItem('education', {
                                                                institution: '',
                                                                degree: '',
                                                                field: '',
                                                                startDate: '',
                                                                endDate: '',
                                                                description: '',
                                                            })
                                                        }
                                                    >
                                                        Agregar estudio
                                                    </Button>
                                                </>
                                            )}

                                            {sectionId === 'technicalSkills' && (
                                                <>
                                                    {(cvData?.technicalSkills || []).map((skill, idx) => (
                                                        <div key={idx} className="array-item compact">
                                                            <div className="two-col">
                                                                <div className="field-group">
                                                                    <label>Habilidad</label>
                                                                    <input
                                                                        type="text"
                                                                        value={skill.name || ''}
                                                                        onChange={(e) => updateArrayField('technicalSkills', idx, 'name', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="field-group">
                                                                    <label>Nivel</label>
                                                                    <select
                                                                        value={skill.level ?? 3}
                                                                        onChange={(e) => updateArrayField('technicalSkills', idx, 'level', Number(e.target.value))}
                                                                    >
                                                                        {[1, 2, 3, 4, 5].map((n) => (
                                                                            <option key={n} value={n}>{n}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeArrayItem('technicalSkills', idx)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => addArrayItem('technicalSkills', { name: '', level: 3 })}
                                                    >
                                                        Agregar habilidad
                                                    </Button>
                                                </>
                                            )}

                                            {sectionId === 'softSkills' && (
                                                <>
                                                    {(cvData?.softSkills || []).map((skill, idx) => (
                                                        <div key={idx} className="array-item compact">
                                                            <div className="field-group">
                                                                <label>Habilidad</label>
                                                                <input
                                                                    type="text"
                                                                    value={skill.name || ''}
                                                                    onChange={(e) => updateArrayField('softSkills', idx, 'name', e.target.value)}
                                                                />
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeArrayItem('softSkills', idx)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => addArrayItem('softSkills', { name: '' })}
                                                    >
                                                        Agregar habilidad
                                                    </Button>
                                                </>
                                            )}

                                            {sectionId === 'languages' && (
                                                <>
                                                    {(cvData?.languages || []).map((lang, idx) => (
                                                        <div key={idx} className="array-item compact">
                                                            <div className="two-col">
                                                                <div className="field-group">
                                                                    <label>Idioma</label>
                                                                    <input
                                                                        type="text"
                                                                        value={lang.language || ''}
                                                                        onChange={(e) => updateArrayField('languages', idx, 'language', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="field-group">
                                                                    <label>Nivel</label>
                                                                    <input
                                                                        type="text"
                                                                        value={lang.level || ''}
                                                                        onChange={(e) => updateArrayField('languages', idx, 'level', e.target.value)}
                                                                        placeholder="Ej: B2"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeArrayItem('languages', idx)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => addArrayItem('languages', { language: '', level: '' })}
                                                    >
                                                        Agregar idioma
                                                    </Button>
                                                </>
                                            )}

                                            {sectionId === 'certifications' && (
                                                <>
                                                    {(cvData?.certifications || []).map((cert, idx) => (
                                                        <div key={idx} className="array-item">
                                                            <div className="array-item-header">
                                                                <strong>Certificación {idx + 1}</strong>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeArrayItem('certifications', idx)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Nombre</label>
                                                                <input
                                                                    type="text"
                                                                    value={cert.name || ''}
                                                                    onChange={(e) => updateArrayField('certifications', idx, 'name', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Institución</label>
                                                                <input
                                                                    type="text"
                                                                    value={cert.institution || ''}
                                                                    onChange={(e) => updateArrayField('certifications', idx, 'institution', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Fecha (Opcional)</label>
                                                                <input
                                                                    type="month"
                                                                    value={cert.date || ''}
                                                                    onChange={(e) => updateArrayField('certifications', idx, 'date', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => addArrayItem('certifications', { name: '', institution: '', date: '' })}
                                                    >
                                                        Agregar certificación
                                                    </Button>
                                                </>
                                            )}

                                            {sectionId === 'projects' && (
                                                <>
                                                    {(cvData?.projects || []).map((project, idx) => (
                                                        <div key={idx} className="array-item">
                                                            <div className="array-item-header">
                                                                <strong>Proyecto {idx + 1}</strong>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeArrayItem('projects', idx)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Nombre</label>
                                                                <input
                                                                    type="text"
                                                                    value={project.name || ''}
                                                                    onChange={(e) => updateArrayField('projects', idx, 'name', e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>URL (Opcional)</label>
                                                                <input
                                                                    type="url"
                                                                    value={project.url || ''}
                                                                    onChange={(e) => updateArrayField('projects', idx, 'url', e.target.value)}
                                                                    placeholder="https://..."
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <label>Tecnologías (separadas por coma)</label>
                                                                <input
                                                                    type="text"
                                                                    value={Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || '')}
                                                                    onChange={(e) =>
                                                                        updateArrayField(
                                                                            'projects',
                                                                            idx,
                                                                            'technologies',
                                                                            e.target.value
                                                                                .split(',')
                                                                                .map((t) => t.trim())
                                                                                .filter(Boolean)
                                                                        )
                                                                    }
                                                                    placeholder="React, Node, ..."
                                                                />
                                                            </div>

                                                            <div className="field-group">
                                                                <div className="field-header">
                                                                    <label>Descripción</label>
                                                                    <button
                                                                        className="improve-btn"
                                                                        onClick={() =>
                                                                            openImproveModal({
                                                                                title: `Proyecto ${idx + 1} - Descripción`,
                                                                                sectionType: `projects.description`,
                                                                                text: project.description,
                                                                                applySuggestion: (s) => updateArrayField('projects', idx, 'description', s),
                                                                            })
                                                                        }
                                                                        disabled={isImproving}
                                                                    >
                                                                        {isImproving === 'projects.description' ? (
                                                                            <Loader2 size={14} className="animate-spin" />
                                                                        ) : (
                                                                            <>
                                                                                <Wand2 size={14} />
                                                                                <span>Mejorar con IA</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <textarea
                                                                    value={project.description || ''}
                                                                    onChange={(e) => updateArrayField('projects', idx, 'description', e.target.value)}
                                                                    rows={4}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], url: '' })}
                                                    >
                                                        Agregar proyecto
                                                    </Button>
                                                </>
                                            )}

                                            {sectionId === 'socialLinks' && (
                                                <>
                                                    {(cvData?.socialLinks || []).map((link, idx) => (
                                                        <div key={idx} className="array-item compact">
                                                            <div className="two-col">
                                                                <div className="field-group">
                                                                    <label>Plataforma</label>
                                                                    <input
                                                                        type="text"
                                                                        value={link.platform || ''}
                                                                        onChange={(e) => updateArrayField('socialLinks', idx, 'platform', e.target.value)}
                                                                        placeholder="LinkedIn"
                                                                    />
                                                                </div>
                                                                <div className="field-group">
                                                                    <label>URL</label>
                                                                    <input
                                                                        type="url"
                                                                        value={link.url || ''}
                                                                        onChange={(e) => updateArrayField('socialLinks', idx, 'url', e.target.value)}
                                                                        placeholder="https://..."
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeArrayItem('socialLinks', idx)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => addArrayItem('socialLinks', { platform: '', url: '' })}
                                                    >
                                                        Agregar red social
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </aside>

                {/* Right Panel - Preview */}
                <div className="preview-panel">
                    <div className="preview-wrapper">
                        {TemplateComponent ? (
                            <>
                                {/* Paged.js Preview */}
                                <div className="paged-preview-host">
                                    <PagedPreview cvData={cvData}>
                                        <TemplateComponent
                                            cvData={{ ...cvData, selectedSections }}
                                        />
                                    </PagedPreview>
                                </div>
                            </>
                        ) : (
                            <div className="no-template">
                                <FileText size={48} />
                                <p>Selecciona una plantilla para comenzar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </main >
    );
};

export default Editor;
