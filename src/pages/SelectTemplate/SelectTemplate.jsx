import { useState, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Check, LayoutTemplate, X, Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import { templates, getTemplatesByCategory } from '../../templates';
import { useCV } from '../../context/CVContext';
import { getSampleCVData } from '../../utils/constants';
import './SelectTemplate.css';

const CATEGORIES = [
    { id: 'all', label: 'Todas', icon: '📋' },
    { id: 'tech', label: 'Tecnología', icon: '💻' },
    { id: 'business', label: 'Negocios', icon: '💼' },
    { id: 'creative', label: 'Creativos', icon: '🎨' },
    { id: 'general', label: 'General', icon: '📄' },
];

const SelectTemplate = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const sampleFromQuery = searchParams.get('sample') === '1';
    const from = searchParams.get('from');
    const { selectedTemplate, setSelectedTemplate, setCvData, cvData } = useCV();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredTemplate, setHoveredTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const canUseSample = from !== 'import' && from !== 'assistant' && cvData?.onboardingSource !== 'assistant';
    const [useSampleData, setUseSampleData] = useState(canUseSample && sampleFromQuery);

    // Filter templates
    const filteredTemplates = useMemo(() => {
        let result = getTemplatesByCategory(activeCategory);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.name.toLowerCase().includes(query) ||
                    t.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        return result;
    }, [activeCategory, searchQuery]);

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template.id);
        setCvData((prev) => {
            const base = useSampleData ? { ...prev, ...getSampleCVData() } : prev;
            return {
                ...base,
                selectedTemplate: template.id,
            };
        });
        navigate('/editor');
    };

    const toggleSample = () => {
        const next = !useSampleData;
        setUseSampleData(next);
        const nextParams = new URLSearchParams(searchParams);
        if (next) nextParams.set('sample', '1');
        else nextParams.delete('sample');
        setSearchParams(nextParams);
    };

    return (
        <main className="select-template-page">
            <div className="select-container container">
                {/* Header */}
                <div className="select-header">
                    <Link to="/importar" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Volver</span>
                    </Link>
                    <div className="header-title">
                        <LayoutTemplate size={32} className="title-icon" />
                        <div>
                            <h1>Selecciona tu plantilla</h1>
                            <p>Elige el diseño que mejor represente tu perfil profesional</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    {/* Categories */}
                    <div className="category-tabs">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span className="tab-icon">{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar plantillas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {canUseSample && (
                        <button
                            type="button"
                            className={`sample-toggle ${useSampleData ? 'active' : ''}`}
                            onClick={toggleSample}
                        >
                            <span className="sample-toggle-title">Rellenar con datos de ejemplo</span>
                            <span className="sample-toggle-subtitle">Ideal para empezar desde cero y luego editar</span>
                        </button>
                    )}
                </div>

                {/* Templates Grid */}
                <div className="templates-grid">
                    {filteredTemplates.map((template) => {
                        const isSelected = selectedTemplate === template.id;
                        const isHovered = hoveredTemplate === template.id;
                        const TemplateComponent = template.component;

                        return (
                            <div
                                key={template.id}
                                className={`template-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelectTemplate(template)}
                                onMouseEnter={() => setHoveredTemplate(template.id)}
                                onMouseLeave={() => setHoveredTemplate(null)}
                            >
                                {/* Preview */}
                                <div className="template-preview">
                                    <div className="preview-scale-container">
                                        <TemplateComponent
                                            cvData={getSampleCVData()}
                                            sections={[]}
                                            isEditing={false}
                                        />
                                    </div>

                                    {/* Overlay */}
                                    {(isHovered || isSelected) && (
                                        <div className="preview-overlay">
                                            {isSelected ? (
                                                <div className="selected-badge">
                                                    <Check size={20} />
                                                    <span>Seleccionada</span>
                                                </div>
                                            ) : (
                                                <div className="card-actions">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewTemplate(template);
                                                        }}
                                                        leftIcon={<Eye size={16} />}
                                                    >
                                                        Vista previa
                                                    </Button>
                                                    <Button variant="primary" size="sm">
                                                        Seleccionar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                    }
                                </div>

                                {/* Info */}
                                <div className="template-info">
                                    <h3 className="template-name">{template.name}</h3>
                                    <p className="template-desc">{template.description}</p>
                                    <div className="template-tags">
                                        {template.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {
                    filteredTemplates.length === 0 && (
                        <div className="empty-state">
                            <Filter size={48} />
                            <h3>No se encontraron plantillas</h3>
                            <p>Intenta con otros filtros o términos de búsqueda</p>
                            <Button variant="outline" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
                                Limpiar filtros
                            </Button>
                        </div>
                    )
                }

                {/* Footer Action */}
                {
                    selectedTemplate && (
                        <div className="select-footer">
                            <div className="selected-info">
                                <Check size={16} className="check-icon" />
                                <span>Plantilla seleccionada: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong></span>
                            </div>
                        </div>
                    )
                }
            </div >
            {/* Preview Modal */}
            {previewTemplate && (
                <div className="preview-modal-overlay" onClick={() => setPreviewTemplate(null)}>
                    <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="preview-close-btn" onClick={() => setPreviewTemplate(null)}>
                            <X size={24} />
                        </button>

                        <div className="preview-model-header">
                            <div>
                                <h2>{previewTemplate.name}</h2>
                                <p>{previewTemplate.description}</p>
                            </div>
                            <Button
                                onClick={() => handleSelectTemplate(previewTemplate)}
                                rightIcon={<Check size={18} />}
                            >
                                Seleccionar este diseño
                            </Button>
                        </div>

                        <div className="preview-content-scroll">
                            <div className="preview-scale-wrapper">
                                {(() => {
                                    const TemplateComponent = previewTemplate.component;
                                    return (
                                        <div className="cv-preview-container">
                                            <TemplateComponent
                                                cvData={getSampleCVData()}
                                                sections={[]}
                                                isEditing={false}
                                            />
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default SelectTemplate;
